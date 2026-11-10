import { useToast } from '@/hooks/useToast'

export function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast px-4 py-3 rounded-lg shadow-lg text-white animate-slide-in ${
            toast.type === 'success' ? 'toast-success' : toast.type === 'error' ? 'toast-error' : 'toast-warning'
          }`}
          role="alert"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
