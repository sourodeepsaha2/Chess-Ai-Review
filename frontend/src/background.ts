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

    // 4. Perform background API connection call
    try {
      console.log('[Background] Enqueuing PGN on backend queue...')
      const startResponse = await analysisService.startAnalysisJob(payload.pgn)
      
      if (!startResponse || !startResponse.success || !startResponse.analysisId) {
        throw new Error(startResponse?.message || 'Server rejected the analysis request.')
      }

      const jobId = startResponse.analysisId
      console.log(`[Background] Analysis job successfully enqueued: ${jobId}. Initiating poll loop...`)

      // Start polling status
      const pollInterval = 1000
      const runPoll = async () => {
        try {
          const statusResponse = await analysisService.getAnalysisJobStatus(jobId)
          
          if (!statusResponse || !statusResponse.success) {
            throw new Error(statusResponse?.error || 'Failed to retrieve job status.')
          }

          console.log(`[Background] Job ${jobId} Status: ${statusResponse.status}, Progress: ${statusResponse.progress}%`)

          if (statusResponse.status === 'success') {
            messagingService.sendMessage('ANALYSIS_STATUS', {
              status: 'success',
              phaseMessage: 'Finished',
              response: {
                success: true,
                message: 'Game uploaded successfully',
                moveCount: statusResponse.totalMoves,
                moves: statusResponse.moves || [],
                timestamp: Date.now()
              },
              timestamp: Date.now()
            })
            return // stop polling
          }

          if (statusResponse.status === 'error') {
            messagingService.sendMessage('ANALYSIS_STATUS', {
              status: 'error',
              error: statusResponse.error || 'Analysis process encountered an error.',
              timestamp: Date.now()
            })
            return // stop polling
          }

          // Still running (loading / analyzing): Send progress update to UI
          messagingService.sendMessage('ANALYSIS_STATUS', {
            status: 'loading',
            phaseMessage: `Move ${statusResponse.currentMove} / ${statusResponse.totalMoves}`,
            progress: statusResponse.progress,
            currentMove: statusResponse.currentMove,
            totalMoves: statusResponse.totalMoves,
            timestamp: Date.now()
          })

          // Schedule next poll
          setTimeout(runPoll, pollInterval)

        } catch (pollErr: any) {
          console.error('[Background] Polling error:', pollErr)
          messagingService.sendMessage('ANALYSIS_STATUS', {
            status: 'error',
            error: pollErr.message || 'Lost connection to backend server during analysis.',
            timestamp: Date.now()
          })
        }
      }

      // Start first poll after interval
      setTimeout(runPoll, pollInterval)

    } catch (err: any) {
      console.error('[Background] Failed to enqueue analysis:', err)
      messagingService.sendMessage('ANALYSIS_STATUS', {
        status: 'error',
        error: err.message || 'Network request failed or timed out.',
        timestamp: Date.now()
      })
    }
  }

  uploadPgn()
})

