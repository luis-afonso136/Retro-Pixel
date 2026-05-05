import { create } from 'zustand'

export const useUIStore = create((set) => ({
  confirm: { open: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', resolve: null },
  betResult: { open: false, win: false, title: '', message: '' },
  showConfirm: ({ title = '', message = '', confirmText = 'Confirm', cancelText = 'Cancel' } = {}) => {
    return new Promise((resolve) => {
      set({ confirm: { open: true, title, message, confirmText, cancelText, resolve } })
    })
  },
  closeConfirm: (result) => {
    set((state) => {
      try {
        state.confirm.resolve?.(result)
      } catch {
        // ignore
      }
      return { confirm: { open: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', resolve: null } }
    })
  },
  showBetResult: ({ win = false, title = '', message = '' } = {}) => {
    set({ betResult: { open: true, win, title, message } })
  },
  closeBetResult: () => {
    set({ betResult: { open: false, win: false, title: '', message: '' } })
  },
}))
