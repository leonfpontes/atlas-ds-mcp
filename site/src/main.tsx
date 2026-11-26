import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { HowItWorks } from './pages/HowItWorks'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root in index.html')

createRoot(root).render(
  <StrictMode>
    <HowItWorks />
  </StrictMode>,
)
