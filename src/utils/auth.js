
const TokenKey = 'SToken'
const JumpKey = 'JumpInfo'

export function getToken () {
  return localStorage[TokenKey] || ' '
}

export function setToken (token) {
  localStorage[TokenKey] = token
}

export function removeToken () {
  return delete localStorage[TokenKey]
}

export function setJumpInfo (omsjump) {
  localStorage[JumpKey] = omsjump
}

export function getJumpInfo () {
  return localStorage[JumpKey] || ' '
}

export function removeJumpInfo () {
  return delete localStorage[JumpKey]
}
