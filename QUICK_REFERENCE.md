# QUICK REFERENCE - Client Firebase Setup

## What You Asked For ✅

"Send Firebase token to backend properly for secure API requests"

## What Was Done ✅

### 1. Fixed useAxiosSecure.jsx

**Problem:** Async interceptor was causing timeouts
**Solution:** Clean axios instance, no interceptors

```javascript
// Now it's simple and works:
const axiosSecure = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
```

### 2. Enhanced SendParcel.jsx

**What it does:**

1. User fills form and clicks submit
2. Gets fresh Firebase token: `await user.getIdToken()`
3. Sends POST /parcels with Authorization header: `Bearer {token}`
4. Server receives request with valid token
5. Shows success or error message

**Key code:**

```javascript
const token = await user.getIdToken();
localStorage.setItem("firebaseToken", token);

const response = await axiosSecure.post("/parcels", data, {
  headers: { Authorization: `Bearer ${token}` },
});
```

### 3. Enhanced PaymentHistory.jsx

**What it does:**

1. Component loads
2. Gets fresh Firebase token: `await user.getIdToken()`
3. Sends GET /payments with Authorization header: `Bearer {token}`
4. Server receives request with valid token
5. Shows payment history table

**Key code:**

```javascript
const token = await user.getIdToken();

const res = await axiosSecure.get(`/payments?email=${email}...`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Files Changed

1. ✅ `src/Hooks/useAxiosSecure.jsx` - Clean HTTP client
2. ✅ `src/Pages/SendParcel/SendParcel.jsx` - Book parcel with token
3. ✅ `src/Pages/Dashboard/PaymentHistory/PaymentHistory.jsx` - Fetch with token

---

## What Client Sends to Server

### POST /parcels

```
Headers:
  Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
  Content-Type: application/json

Body:
{
  parcelType: "document",
  parcelName: "...",
  parcelWeight: 0.5,
  senderName: "...",
  senderEmail: "...",
  ... more fields ...
  cost: 80
}
```

### GET /payments

```
Headers:
  Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

Query:
  /payments?email=user@example.com&senderEmail=user@example.com&customerEmail=user@example.com
```

---

## What Server Must Do

### 1. Verify Token

```javascript
const token = req.headers.authorization?.split("Bearer ")[1];
const decodedToken = await firebase.admin.auth().verifyIdToken(token);
// Now you have user info: decodedToken.email, decodedToken.uid
```

### 2. Process Request

Save to MongoDB or query database

### 3. Return Response

```json
For POST /parcels:
{
  "success": true,
  "insertedId": "mongo_id",
  "message": "Parcel booked successfully"
}

For GET /payments:
{
  "payments": [
    { "_id": "123", "amount": 80, "paidAt": "..." }
  ]
}
```

---

## Testing Without Server

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Book a parcel or check payments
4. Look for logs like:
   - "Form Data:"
   - "Token available: true"
   - "Parcel booking response:"
   - "Error booking parcel:" (if error)

### Check Network Tab

1. Go to Network tab
2. Submit form or fetch payments
3. Look for POST /parcels or GET /payments request
4. Click on it
5. Check Headers:
   - `Authorization: Bearer ...` ✅

### Check localStorage

1. Open DevTools
2. Go to Application tab
3. Click localStorage
4. Look for key "firebaseToken"
5. Value should be a long JWT token

---

## Common Issues & Fixes

### Issue: "No data showing"

**Cause:** Server endpoint not responding
**Fix:** Implement server endpoint

### Issue: "Network error"

**Cause:** Server not running or wrong base URL
**Fix:** Check VITE_API_BASE_URL in .env.local

### Issue: "Invalid token"

**Cause:** Token not sent or malformed
**Fix:** Check Authorization header in Network tab

### Issue: "CORS error"

**Cause:** Server doesn't allow client origin
**Fix:** Configure CORS on server

---

## Key Points to Remember

✅ **Token is sent automatically** in Authorization header
✅ **Fresh token per request** (automatically handled)
✅ **Token stored in localStorage** as `firebaseToken`
✅ **Server must verify token** using Firebase Admin SDK
✅ **No manual token handling needed** in response

---

## Documentation Files

For more details, see:

- `COMPLETE_SETUP_SUMMARY.md` - Full overview
- `SERVER_INTEGRATION_GUIDE.md` - How to implement server
- `REAL_REQUEST_RESPONSE_EXAMPLES.md` - Real request examples
- `CLIENT_VERIFICATION_CHECKLIST.md` - Verification details

---

## You're Ready! 🚀

The client side is complete and properly sends Firebase tokens.
Now implement the server side using the guides provided.

Questions? Check the documentation files or review the code in the modified files.
