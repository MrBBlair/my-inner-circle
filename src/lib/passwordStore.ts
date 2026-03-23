const PREFIX = "mic_pwd_";

export function setStoredPassword(userId: string, password: string) {
  localStorage.setItem(PREFIX + userId, password);
}

export function checkStoredPassword(userId: string, password: string) {
  return localStorage.getItem(PREFIX + userId) === password;
}
