
const tokenMark = 'x-token'
const jumpMark = 'jumper'
const fingerprint = 'fp_track'

export function getToken () {
  return localStorage[tokenMark] || ' '
}

export function setToken (token) {
  localStorage[tokenMark] = token
}

export function removeToken () {
  return delete localStorage[tokenMark]
}

export function setJumpInfo (jumpinfo) {
  localStorage[jumpMark] = jumpinfo
}

export function getJumpInfo () {
  return localStorage[jumpMark] || ' '
}

export function removeJumpInfo () {
  return delete localStorage[jumpMark]
}

export function getFingerprint () {
  return localStorage[fingerprint] || ''
}

export function setFingerprint (code) {
  localStorage[fingerprint] = code
}
