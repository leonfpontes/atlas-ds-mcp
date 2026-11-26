import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { NotFound } from './pages/NotFound'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root in 404.html')

createRoot(root).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)
