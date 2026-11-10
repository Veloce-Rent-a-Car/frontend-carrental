import { useState, useEffect } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning'
}

let toastId = 0
const listeners = new Set<(toasts: Toast[]) => void>()
let toasts: Toast[] = []

function notify() {
  listeners.forEach((listener) => listener([...toasts]))
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts)

  useEffect(() => {
    listeners.add(setCurrentToasts)
    return () => {
      listeners.delete(setCurrentToasts)
    }
  }, [])

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId
    const newToast: Toast = { id, message, type }
    toasts = [...toasts, newToast]
    notify()
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      notify()
    }, 4000)
  }

  return { toasts: currentToasts, showToast }
}
