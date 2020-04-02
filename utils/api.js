export function queryString(params) {
  return '?' + Object.keys(params).map(i => `${i}=${params[i]}`).join('&')
}