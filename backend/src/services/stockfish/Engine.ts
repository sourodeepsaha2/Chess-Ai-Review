import { spawn, ChildProcess } from 'child_process';
import logger from '../../utils/logger';

export class StockfishEngine {
  private static instance: StockfishEngine | null = null;
  private process: ChildProcess | null = null;
  
  private stdoutCallbacks: Set<(line: string) => void> = new Set();
  private stderrCallbacks: Set<(line: string) => void> = new Set();
  private exitCallbacks: Set<() => void> = new Set();
  
  private stdoutBuffer: string = '';
  private stderrBuffer: string = '';
  private binaryPath: string;

  private constructor() {
    this.binaryPath = process.env.STOCKFISH_PATH || '/opt/homebrew/bin/stockfish';
  }

  /**
   * Retrieves the singleton StockfishEngine instance.
   */
  public static getInstance(): StockfishEngine {
    if (!StockfishEngine.instance) {
      StockfishEngine.instance = new StockfishEngine();
    }
    return StockfishEngine.instance;
  }

  /**
   * Spawns the Stockfish process if it is not already running.
   */
  public async start(): Promise<ChildProcess> {
    if (this.process) {
      return this.process;
    }

    logger.info(`[StockfishEngine] Launching Stockfish process: ${this.binaryPath}`);

    try {
      this.process = spawn(this.binaryPath, [], { stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (err: any) {
      logger.error(`[StockfishEngine] Failed to spawn process: ${err.message}`);
      throw new Error(`Failed to spawn Stockfish process: ${err.message}`);
    }

    // Capture stdout and buffer by line
    this.process.stdout?.on('data', (chunk: Buffer) => {
      this.stdoutBuffer += chunk.toString();
      const lines = this.stdoutBuffer.split(/\r?\n/);
      this.stdoutBuffer = lines.pop() || '';
      for (const line of lines) {
        for (const callback of this.stdoutCallbacks) {
          callback(line);
        }
      }
    });

    // Capture stderr and buffer by line
    this.process.stderr?.on('data', (chunk: Buffer) => {
      this.stderrBuffer += chunk.toString();
      const lines = this.stderrBuffer.split(/\r?\n/);
      this.stderrBuffer = lines.pop() || '';
      for (const line of lines) {
        for (const callback of this.stderrCallbacks) {
          callback(line);
        }
      }
    });

    // Process error trap
    this.process.on('error', (err) => {
      logger.error(`[StockfishEngine] Process error: ${err.message}`);
      this.handleUnexpectedExit();
    });

    // Process exit listener
    this.process.on('exit', (code, signal) => {
      if (code !== 0 && code !== null) {
        logger.warn(`[StockfishEngine] Process exited unexpectedly. Code: ${code}, Signal: ${signal}`);
      } else {
        logger.info(`[StockfishEngine] Process exited cleanly`);
      }
      this.handleUnexpectedExit();
    });

    return this.process;
  }

  /**
   * Writes a raw command line string to Stockfish's stdin.
   */
  public write(command: string): void {
    if (!this.process || !this.process.stdin) {
      throw new Error('Stockfish process is not running or stdin stream is unavailable.');
    }
    this.process.stdin.write(`${command}\n`);
  }

  /**
   * Subscribes to buffered stdout lines. Returns unsubscribe function.
   */
  public onStdout(callback: (line: string) => void): () => void {
    this.stdoutCallbacks.add(callback);
    return () => {
      this.stdoutCallbacks.delete(callback);
    };
  }

  /**
   * Subscribes to buffered stderr lines. Returns unsubscribe function.
   */
  public onStderr(callback: (line: string) => void): () => void {
    this.stderrCallbacks.add(callback);
    return () => {
      this.stderrCallbacks.delete(callback);
    };
  }

  /**
   * Subscribes to unexpected process termination signals.
   */
  public onExit(callback: () => void): () => void {
    this.exitCallbacks.add(callback);
    return () => {
      this.exitCallbacks.delete(callback);
    };
  }

  /**
   * Shuts down Stockfish process gracefully or kills it if unresponsive.
   */
  public async stop(): Promise<void> {
    if (!this.process) return;

    logger.info('[StockfishEngine] Stopping Stockfish process gracefully...');
    try {
      this.write('quit');
    } catch {
      // Ignored if stream is already closed
    }

    const proc = this.process;
    this.process = null;
    this.stdoutCallbacks.clear();
    this.stderrCallbacks.clear();

    await new Promise<void>((resolve) => {
      const killTimeout = setTimeout(() => {
        logger.warn('[StockfishEngine] Graceful quit timed out. Forcing process kill...');
        proc.kill();
        resolve();
      }, 1500);

      proc.on('exit', () => {
        clearTimeout(killTimeout);
        resolve();
      });
    });
  }

  private handleUnexpectedExit(): void {
    this.process = null;
    this.stdoutBuffer = '';
    this.stderrBuffer = '';
    
    // Notify exit listeners
    for (const callback of this.exitCallbacks) {
      callback();
    }
    
    // Clear list of callbacks to prevent leaking memory
    this.stdoutCallbacks.clear();
    this.stderrCallbacks.clear();
    this.exitCallbacks.clear();
  }
}
