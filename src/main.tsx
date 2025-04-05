
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a cache-busting version parameter to force fresh loads
const cacheBuster = `?v=${new Date().getTime()}`

// Add cache-busting to any dynamically loaded resources
const injectCacheBuster = () => {
  // Find all link and script elements
  const links = document.querySelectorAll('link[rel="stylesheet"]')
  const scripts = document.querySelectorAll('script[src]')
  
  // Add timestamp to stylesheets
  links.forEach(link => {
    const href = link.getAttribute('href')
    if (href && !href.includes('?v=')) {
      link.setAttribute('href', `${href}${cacheBuster}`)
    }
  })
  
  // Add timestamp to scripts
  scripts.forEach(script => {
    const src = script.getAttribute('src')
    if (src && !src.includes('?v=')) {
      script.setAttribute('src', `${src}${cacheBuster}`)
    }
  })
}

// Run cache-busting logic after DOM is loaded
window.addEventListener('DOMContentLoaded', injectCacheBuster)

createRoot(document.getElementById("root")!).render(<App />);
