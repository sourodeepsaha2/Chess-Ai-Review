import { messagingService } from './services/messagingService'

console.log('Chess AI Review: Content script injected and active.')

// Send PAGE_READY status as soon as the content script is loaded
messagingService.sendMessage('PAGE_READY', {
  url: window.location.href,
  title: document.title || 'Chess.com Game',
  timestamp: Date.now()
}).then(() => {
  console.log('[Content] Dispatched PAGE_READY event successfully')
}).catch((err) => {
  console.error('[Content] Failed to dispatch PAGE_READY event:', err)
})

// Listen for REQUEST_ANALYSIS trigger from background service worker
messagingService.on('REQUEST_ANALYSIS', (payload, sender) => {
  console.log('[Content] Received REQUEST_ANALYSIS from background.', { payload, sender })
  
  // Simulate chess engine evaluation delay
  setTimeout(() => {
    // Generate clean mock chess analysis
    const bestMoves = ['e4', 'Nf3', 'd4', 'Bc4', 'O-O', 'Nc3', 'd6', 'Bg5']
    const accuracies = [89.4, 91.2, 94.8, 97.2, 85.3, 90.7]
    const summaries = [
      'Excellent performance! You capitalized on your opponent\'s blunders and maintained a solid center control.',
      'A brilliant tactical sequence in the middle game secured a significant material advantage.',
      'A highly accurate game. The minor piece coordination was exceptional, leading to a strong endgame pressure.',
      'Strong positional play. You successfully restricted opponent counterplay and cruised to victory.'
    ]

    const randomBestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
    const randomAccuracy = accuracies[Math.floor(Math.random() * accuracies.length)]
    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)]
    const playerColor: 'white' | 'black' = Math.random() > 0.5 ? 'white' : 'black'

    console.log('[Content] Analysis simulation complete. Dispatching ANALYSIS_RECEIVED.')

    messagingService.sendMessage('ANALYSIS_RECEIVED', {
      summary: randomSummary,
      accuracy: randomAccuracy,
      bestMove: randomBestMove,
      playerColor,
      totalMoves: Math.floor(Math.random() * 25) + 20, // 20-45 moves
      timestamp: Date.now()
    }).catch((err) => {
      console.error('[Content] Failed to dispatch ANALYSIS_RECEIVED event:', err)
    })
  }, 1800) // 1.8 seconds simulated engine thinking time
})
