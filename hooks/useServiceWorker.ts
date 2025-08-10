import { useEffect } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          registration => {
            console.log('ServiceWorker registration successful')
          },
          err => {
            console.log('ServiceWorker registration failed: ', err)
          }
        )
      })
    }
  }, [])
}