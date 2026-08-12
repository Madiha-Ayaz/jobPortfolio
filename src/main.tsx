import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
import './i18n/config' // Initialize i18next

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
