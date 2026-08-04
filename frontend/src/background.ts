import { messagingService } from './services/messagingService'
import type { MessagePayloads } from './types/messaging'
import { analysisService } from './services/analysisService'

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
  
  // Notify Side Panel we have started extraction
  messagingService.sendMessage('ANALYSIS_STATUS', {
    status: 'loading',
    phaseMessage: 'Extracting PGN...',
    timestamp: Date.now()
  })

  // Forward the analysis request to the content script running in the active tab
  messagingService.sendMessageToActiveTab('REQUEST_ANALYSIS', payload)
})

messagingService.on('ANALYSIS_RECEIVED', (payload, sender) => {
  console.log('[Background] Received ANALYSIS_RECEIVED from content script. Forwarding to Side Panel.', { payload, sender })
  
  // Forward the analysis details to the side panel
  messagingService.sendMessage('ANALYSIS_RECEIVED', payload)
})

messagingService.on('PGN_EXTRACTED', (payload, sender) => {
  console.log('[Background] Received PGN_EXTRACTED from content script.', { payload, sender })
  
  // 1. Forward the PGN extraction details to the side panel
  messagingService.sendMessage('PGN_EXTRACTED', payload)

  const uploadPgn = async () => {
    // 2. Check if extraction succeeded and pgn is present
    if (!payload.success) {
      console.log('[Background] PGN extraction failed. Aborting API upload.', payload.error)
      messagingService.sendMessage('ANALYSIS_STATUS', {
        status: 'error',
        error: payload.error || 'PGN extraction failed.',
        timestamp: Date.now()
      })
      return
    }

    if (!payload.pgn) {
      console.log('[Background] PGN content is missing. Aborting API upload.')
      messagingService.sendMessage('ANALYSIS_STATUS', {
        status: 'error',
        error: 'Missing PGN content: extracted string was empty.',
        timestamp: Date.now()
      })
      return
    }

    // 3. Notify Side Panel we are sending the game
    messagingService.sendMessage('ANALYSIS_STATUS', {
      status: 'loading',
      phaseMessage: 'Sending game...',
      timestamp: Date.now()
    })

    // 4. Perform backend API connection call
    try {
      console.log('[Background] Sending PGN to backend server for analysis...')
      const response = await analysisService.analyseGame(payload.pgn)
      
      if (response && response.success) {
        console.log('[Background] Analysis request completed successfully:', response)
        messagingService.sendMessage('ANALYSIS_STATUS', {
          status: 'success',
          response: {
            success: true,
            message: response.message,
            timestamp: response.timestamp || Date.now()
          },
          timestamp: Date.now()
        })
      } else {
        console.warn('[Background] Backend returned unsuccessful response:', response)
        messagingService.sendMessage('ANALYSIS_STATUS', {
          status: 'error',
          error: response?.message || 'Server returned an unsuccessful analysis response.',
          timestamp: Date.now()
        })
      }
    } catch (err: any) {
      console.error('[Background] Failed to query analysis backend API:', err)
      messagingService.sendMessage('ANALYSIS_STATUS', {
        status: 'error',
        error: err.message || 'Network request failed or timed out.',
        timestamp: Date.now()
      })
    }
  }

  uploadPgn()
})

