import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Share } from './pages/Share'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root in share.html')

createRoot(root).render(
  <StrictMode>
    <Share />
  </StrictMode>,
)
