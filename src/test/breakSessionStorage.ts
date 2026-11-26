import { vi } from 'vitest'
import { SUPABASE_STORAGE_KEY } from '@/config/authStorage'

/** Makes removing the stored Supabase session throw, like a browser with storage blocked. Undo with vi.restoreAllMocks(). */
export function breakSessionStorage() {
  const removeItem = Storage.prototype.removeItem
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (this: Storage, key: string) {
    if (key === SUPABASE_STORAGE_KEY) throw new Error('storage unavailable')
    removeItem.call(this, key)
  })
}
