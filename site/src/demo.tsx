import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { DemoPage } from './pages/Demo'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root in demo.html')

createRoot(root).render(
  <StrictMode>
    <DemoPage />
  </StrictMode>,
)
