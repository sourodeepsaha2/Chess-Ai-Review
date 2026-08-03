export type MessageType =
  | 'EXTENSION_READY'
  | 'PAGE_READY'
  | 'REQUEST_ANALYSIS'
  | 'ANALYSIS_RECEIVED';

export interface MessagePayloads {
  EXTENSION_READY: {
    timestamp: number;
  };
  PAGE_READY: {
    url: string;
    title: string;
    timestamp: number;
  };
  REQUEST_ANALYSIS: {
    timestamp: number;
  };
  ANALYSIS_RECEIVED: {
    summary: string;
    accuracy: number; // e.g., 87.5
    bestMove: string; // e.g., "Nf3"
    playerColor: 'white' | 'black';
    totalMoves: number;
    timestamp: number;
  };
}

export interface ExtensionMessage<T extends MessageType> {
  type: T;
  payload: MessagePayloads[T];
}
export type AnyExtensionMessage = 
  | { type: 'EXTENSION_READY'; payload: MessagePayloads['EXTENSION_READY'] }
  | { type: 'PAGE_READY'; payload: MessagePayloads['PAGE_READY'] }
  | { type: 'REQUEST_ANALYSIS'; payload: MessagePayloads['REQUEST_ANALYSIS'] }
  | { type: 'ANALYSIS_RECEIVED'; payload: MessagePayloads['ANALYSIS_RECEIVED'] };
