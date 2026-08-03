import { messagingService } from './services/messagingService'
import type { MessagePayloads } from './types/messaging'

// Cache to keep track of the active page details
let activePageState: MessagePayloads['PAGE_READY'] | null = null

chrome.runtime.onInstalled.addListener(() => {
  console.log('Chess AI Review: Extension successfully installed.')

  // Configure the extension to open the side panel when the action button is clicked
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
      console.error('Failed to set side panel behavior:', error)
    })
  }
})

// Log and route incoming messages
messagingService.on('EXTENSION_READY', (payload, sender) => {
  console.log('[Background] Received EXTENSION_READY from side panel/popup', { payload, sender })
  
  // If we already have a page loaded, immediately notify the side panel
  if (activePageState) {
    console.log('[Background] Side panel ready. Sending cached PAGE_READY status:', activePageState)
    messagingService.sendMessage('PAGE_READY', activePageState)
  }
})

messagingService.on('PAGE_READY', (payload, sender) => {
  console.log('[Background] Received PAGE_READY from content script', { payload, sender })
  
  // Cache the page state so the side panel can load it when opened
  activePageState = payload

  // Forward the PAGE_READY state to the side panel if it is already open
  messagingService.sendMessage('PAGE_READY', payload)
})

messagingService.on('REQUEST_ANALYSIS', (payload, sender) => {
  console.log('[Background] Received REQUEST_ANALYSIS. Forwarding to active Chess tab.', { payload, sender })
  
  // Forward the analysis request to the content script running in the active tab
  messagingService.sendMessageToActiveTab('REQUEST_ANALYSIS', payload)
})

messagingService.on('ANALYSIS_RECEIVED', (payload, sender) => {
  console.log('[Background] Received ANALYSIS_RECEIVED from content script. Forwarding to Side Panel.', { payload, sender })
  
  // Forward the analysis details to the side panel
  messagingService.sendMessage('ANALYSIS_RECEIVED', payload)
})
