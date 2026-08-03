import type { MessageType, MessagePayloads, ExtensionMessage } from '../types/messaging';

export type MessageCallback<T extends MessageType> = (
  payload: MessagePayloads[T],
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void | boolean;

class ExtensionMessagingService {
  private listeners: Map<MessageType, Set<MessageCallback<any>>> = new Map();
  private globalListenerRegistered = false;

  constructor() {
    this.initGlobalListener();
  }

  private initGlobalListener() {
    if (typeof chrome === 'undefined' || !chrome.runtime?.onMessage) {
      return;
    }

    if (this.globalListenerRegistered) {
      return;
    }

    chrome.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
      if (message && typeof message === 'object' && 'type' in message && 'payload' in message) {
        const msgType = message.type as MessageType;
        const msgPayload = message.payload;
        const callbacks = this.listeners.get(msgType);

        if (callbacks && callbacks.size > 0) {
          let keepChannelOpen = false;
          for (const callback of callbacks) {
            try {
              const result = callback(msgPayload, sender, sendResponse);
              if (result === true) {
                keepChannelOpen = true;
              }
            } catch (err) {
              console.error(`[MessagingService] Error in listener for message type "${msgType}":`, err);
            }
          }
          return keepChannelOpen;
        }
      }
      return false;
    });

    this.globalListenerRegistered = true;
  }

  /**
   * Sends a message to the extension background context, side panel, or popup.
   * Typically used from content scripts or side panel to communicate with background.
   */
  async sendMessage<T extends MessageType>(
    type: T,
    payload: MessagePayloads[T]
  ): Promise<any> {
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
      console.warn(`[MessagingService] chrome.runtime.sendMessage not available (type: ${type})`);
      return null;
    }

    const message: ExtensionMessage<T> = { type, payload };
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        const error = chrome.runtime.lastError;
        if (error) {
          // If receiver does not exist (e.g. background listener has not registered yet), reject or return null
          if (error.message?.includes('Could not establish connection')) {
            resolve(null);
          } else {
            reject(new Error(error.message));
          }
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Sends a message to a specific active tab (content script context).
   * Typically used from background worker.
   */
  async sendMessageToTab<T extends MessageType>(
    tabId: number,
    type: T,
    payload: MessagePayloads[T]
  ): Promise<any> {
    if (typeof chrome === 'undefined' || !chrome.tabs?.sendMessage) {
      console.warn(`[MessagingService] chrome.tabs.sendMessage not available (tabId: ${tabId}, type: ${type})`);
      return null;
    }

    const message: ExtensionMessage<T> = { type, payload };
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        const error = chrome.runtime.lastError;
        if (error) {
          if (error.message?.includes('Could not establish connection')) {
            resolve(null);
          } else {
            reject(new Error(error.message));
          }
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Sends a message to the active tab's content script context.
   * Helper that queries for active tabs and fires the message.
   */
  async sendMessageToActiveTab<T extends MessageType>(
    type: T,
    payload: MessagePayloads[T]
  ): Promise<any> {
    if (typeof chrome === 'undefined' || !chrome.tabs?.query) {
      console.warn(`[MessagingService] chrome.tabs.query not available (type: ${type})`);
      return null;
    }

    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      if (!activeTab || activeTab.id === undefined) {
        console.warn(`[MessagingService] No active tab found to send message (type: ${type})`);
        return null;
      }
      return await this.sendMessageToTab(activeTab.id, type, payload);
    } catch (err) {
      console.error(`[MessagingService] Failed to send message to active tab (type: ${type}):`, err);
      return null;
    }
  }

  /**
   * Subscribes to a specific message type.
   * Returns a cleanup function to unsubscribe.
   */
  on<T extends MessageType>(
    type: T,
    callback: MessageCallback<T>
  ): () => void {
    // Lazy check in case chrome runtime APIs became available later
    this.initGlobalListener();

    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(callback);

    return () => {
      const callbacks = this.listeners.get(type);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }
}

export const messagingService = new ExtensionMessagingService();
