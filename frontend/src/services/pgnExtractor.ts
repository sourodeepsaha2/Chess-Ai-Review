export interface ExtractionResult {
  success: boolean;
  pgn?: string;
  source: 'page' | 'manual' | 'unknown';
  error?: string;
}

export class PgnExtractor {
  /**
   * Attempts to extract the chess game's PGN from already available page data.
   * Does not scrape move lists, automate page clicks, or fetch new data.
   */
  async extractPgn(): Promise<ExtractionResult> {
    try {
      // Strategy 1: Check for standard hidden elements or textareas containing PGN
      const selectors = [
        'textarea[name="pgn"]',
        'textarea.pgn',
        '.pgn-textarea',
        '[data-test-id="pgn-textarea"]',
        '#pgn-textarea'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element instanceof HTMLTextAreaElement && element.value.trim()) {
          return {
            success: true,
            pgn: element.value.trim(),
            source: 'page'
          };
        }
        if (element && element instanceof HTMLInputElement && element.value.trim()) {
          return {
            success: true,
            pgn: element.value.trim(),
            source: 'page'
          };
        }
      }

      // Strategy 2: Check for embedded script blocks containing PGN annotations (e.g. JSON-LD or global configs)
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent || '';
        if (content.includes('[Event "') && content.includes('[Site "')) {
          // Look for PGN metadata structure
          const pgnMatch = content.match(/\[Event[\s\S]+?\](?:\r?\n\r?\n[\d\w\s.\-#=+()]+)?/)?.[0];
          if (pgnMatch) {
            return {
              success: true,
              pgn: pgnMatch.trim(),
              source: 'page'
            };
          }
        }
      }

      // Strategy 3: Check for data attributes containing PGN on target chessboard containers
      const boardSelectors = ['.board', '#board-layout-main', '[class*="board"]'];
      for (const selector of boardSelectors) {
        const boardElement = document.querySelector(selector);
        if (boardElement) {
          const dataPgn = boardElement.getAttribute('data-pgn') || 
                          boardElement.getAttribute('data-game-pgn') ||
                          boardElement.getAttribute('pgn');
          if (dataPgn) {
            return {
              success: true,
              pgn: dataPgn.trim(),
              source: 'page'
            };
          }
        }
      }

      // If no pre-loaded PGN exists, return descriptive error
      return {
        success: false,
        source: 'unknown',
        error: 'No active PGN element, game configuration script, or board metadata attributes found on the page.'
      };
    } catch (err: any) {
      return {
        success: false,
        source: 'unknown',
        error: `Extraction failed due to error: ${err.message || err}`
      };
    }
  }
}

export const pgnExtractor = new PgnExtractor();
