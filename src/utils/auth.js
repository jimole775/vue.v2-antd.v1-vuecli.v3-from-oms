
const TokenKey = 'SToken'
const JumpKey = 'JumpInfo'

export function takeToken () {
  return localStorage[TokenKey] || ' '
}

export function saveToken (token) {
  localStorage[TokenKey] = token
}

export function removeToken () {
  return delete localStorage[TokenKey]
}

export function saveJumpInfo (omsjump) {
  localStorage[JumpKey] = omsjump
}

export function takeJumpInfo () {
  return localStorage[JumpKey] || ' '
}

export function removeJumpInfo () {
  return delete localStorage[JumpKey]
}
