import { getFingerprint, setFingerprint } from '@/utils/auth'

let monitor = null
let cache = ''

export function mount() {
  monitor = setInterval(watching, 100)
}

export function unmount() {
  clearInterval(monitor)
}

// 保持 fingerprint 无法被用户修改
function watching(params) {
  const local = getFingerprint()
  if (!cache) cache = local
  if (cache && local !== cache) {
    setFingerprint(cache)
  }
}
