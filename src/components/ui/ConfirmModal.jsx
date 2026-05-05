import { useCallback } from 'react'
import { useUIStore } from '../../stores/uiStore'

export function ConfirmModal() {
  const confirm = useUIStore((s) => s.confirm)
  const closeConfirm = useUIStore((s) => s.closeConfirm)

  const onCancel = useCallback(() => closeConfirm(false), [closeConfirm])
  const onConfirm = useCallback(() => closeConfirm(true), [closeConfirm])

  if (!confirm.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-line bg-surface/95 p-6">
        {confirm.title && <h3 className="mb-2 text-lg font-semibold text-zinc-100">{confirm.title}</h3>}
        <p className="mb-6 text-sm text-zinc-300">{confirm.message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded border border-line px-3 py-1 text-sm text-zinc-300">{confirm.cancelText}</button>
          <button onClick={onConfirm} className="rounded bg-accent px-3 py-1 text-sm font-semibold text-black">{confirm.confirmText}</button>
        </div>
      </div>
    </div>
  )
}
