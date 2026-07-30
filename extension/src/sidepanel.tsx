import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SidePanelApp from './SidePanelApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidePanelApp />
  </StrictMode>
)
