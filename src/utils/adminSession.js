// The admin's OTP session token (from /auth/admin/otp/verify).
// sessionStorage: it ends when the browser tab closes.
const KEY = "zapshift-admin-session";

export const getAdminSession = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (!saved?.token || saved.expiresAt <= Date.now()) return null;
    return saved.token;
  } catch {
    return null;
  }
};

export const setAdminSession = (token, expiresAt) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ token, expiresAt }));
  } catch {
    // Storage blocked: the admin will simply be asked for a code again
  }
};

export const clearAdminSession = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};
