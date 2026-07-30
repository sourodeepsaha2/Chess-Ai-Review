// Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('Chess AI Review: Extension successfully installed.')

  // Configure the extension to open the side panel when the action button is clicked
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
      console.error('Failed to set side panel behavior:', error)
    })
  }
})
