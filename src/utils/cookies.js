function saveGroupToCookie(value) {
  document.cookie = `tts_group=${value}`;
}

function saveAccessTokenToCookie(value) {
  document.cookie = `tts_access_token=${value}`;
}

function saveRefreshTokenToCookie(value) {
  document.cookie = `tts_refresh_token=${value}`;
}

function saveUserToCookie(value) {
  document.cookie = `tts_user=${value}`;
}

function getGroupromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)tts_group\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}

function getAccessTokenFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)tts_access_token\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}

function getRefreshTokenFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)tts_refresh_token\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}

function getUserFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)tts_user\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}

function deleteCookie(value) {
  document.cookie = `${value}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export {
  saveGroupToCookie,
  saveAccessTokenToCookie,
  saveRefreshTokenToCookie,
  saveUserToCookie,
  getGroupromCookie,
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  getUserFromCookie,
  deleteCookie,
};
