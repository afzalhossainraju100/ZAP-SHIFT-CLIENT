// Turn Firebase / server errors into messages people understand
const firebaseMessages = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/user-not-found": "No account found for this email. Please register first.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your internet connection.",
  "auth/popup-blocked": "The Google window was blocked. Allow pop-ups and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

export const isPopupClosed = (error) =>
  error?.code === "auth/popup-closed-by-user" ||
  error?.code === "auth/cancelled-popup-request";

export const getAuthErrorMessage = (error) =>
  error?.response?.data?.message ||
  firebaseMessages[error?.code] ||
  error?.message ||
  "Something went wrong. Please try again.";
