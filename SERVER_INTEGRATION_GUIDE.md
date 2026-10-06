# Server Integration Guide - Zap Shift Client

## Overview

The client is now fully configured to send Firebase tokens securely to the backend. This document explains:

1. What the client sends
2. How to verify tokens on the server
3. Expected API request/response formats

---

## Client Configuration Status ✅

### 1. Authentication Setup

- ✅ Firebase authentication configured in AuthProvider
- ✅ User tokens obtained via `user.getIdToken()`
- ✅ Tokens stored in localStorage as `firebaseToken`
- ✅ All secure requests include Authorization header

### 2. HTTP Client Setup

- ✅ useAxiosSecure hook creates clean axios instance
- ✅ Base URL: `import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"`
- ✅ Timeout: 10000ms
- ✅ Content-Type: application/json

### 3. Request Implementation

- ✅ SendParcel component gets fresh token for each request
- ✅ PaymentHistory component passes token in headers
- ✅ All requests include: `Authorization: Bearer {firebaseToken}`

---

## Request Format

### POST /parcels - Book a Parcel

**Headers:**

```
Authorization: Bearer {firebaseToken}
Content-Type: application/json
```

**Request Body:**

```json
{
  "parcelType": "document" | "not-document",
  "parcelName": "string",
  "parcelWeight": 2.5,
  "senderName": "string",
  "senderEmail": "user@example.com",
  "senderAddress": "string",
  "senderPhone": "string",
  "senderRegion": "string",
  "senderDistrict": "string",
  "pickupInstruction": "string",
  "receiverName": "string",
  "receiverAddress": "string",
  "receiverContact": "string",
  "receiverEmail": "string",
  "receiverRegion": "string",
  "receiverDistrict": "string",
  "deliveryInstruction": "string",
  "cost": 110
}
```

**Expected Response (Success):**

```json
{
  "success": true,
  "insertedId": "mongo_object_id",
  "message": "Parcel booked successfully"
}
```

OR

```json
{
  "status": 201,
  "data": {
    "insertedId": "mongo_object_id",
    "success": true
  }
}
```

---

### GET /payments - Get Payment History

**Headers:**

```
Authorization: Bearer {firebaseToken}
```

**Query Parameters:**

```
?email=user@example.com&senderEmail=user@example.com&customerEmail=user@example.com
```

**Expected Response:**

```json
{
  "payments": [
    {
      "_id": "mongo_object_id",
      "email": "user@example.com",
      "amount": 110,
      "paidAt": "2026-08-31T10:30:00Z",
      "transactionId": "txn_123",
      "status": "completed"
    }
  ]
}
```

OR (if not wrapped in `payments` key):

```json
[
  {
    "_id": "mongo_object_id",
    "email": "user@example.com",
    "amount": 110,
    "paidAt": "2026-08-31T10:30:00Z"
  }
]
```

---

## Server-Side Implementation Checklist

### 1. Firebase Token Verification

- [ ] Install Firebase Admin SDK: `npm install firebase-admin`
- [ ] Initialize Firebase Admin in your server
- [ ] Create middleware to verify tokens:

```javascript
// Middleware Example (Node.js)
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
```

### 2. CORS Configuration

- [ ] Allow client origin in CORS:

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
  }),
);
```

### 3. POST /parcels Route

- [ ] Apply token verification middleware
- [ ] Validate all required fields
- [ ] Extract user email from verified token: `req.user.email`
- [ ] Save parcel to MongoDB
- [ ] Return response with `insertedId` and `success: true`
- [ ] Log errors with status codes

### 4. GET /payments Route

- [ ] Apply token verification middleware
- [ ] Get email from query parameters (verify it matches token user)
- [ ] Query MongoDB for payments with that email
- [ ] Return array wrapped in `payments` key OR raw array
- [ ] Handle no results gracefully (return empty array)

### 5. Error Handling

- [ ] Return proper HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad request (validation error)
  - 401: Unauthorized (invalid token)
  - 403: Forbidden (token valid but user not allowed)
  - 500: Server error

- [ ] Include error messages in response:

```json
{
  "error": "Error message",
  "message": "User-friendly message"
}
```

---

## Testing the Integration

### 1. Test with Postman/Curl

```bash
# Get a token from Firebase console or client app
TOKEN="your_firebase_token_here"

# Test POST /parcels
curl -X POST http://localhost:3000/parcels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parcelType": "document",
    "parcelName": "Important Document",
    "parcelWeight": 0.5,
    "senderName": "John Doe",
    "senderEmail": "john@example.com",
    "senderAddress": "123 Main St",
    "senderPhone": "01712345678",
    "senderRegion": "Dhaka",
    "senderDistrict": "Dhaka",
    "receiverName": "Jane Doe",
    "receiverAddress": "456 Oak St",
    "receiverContact": "01987654321",
    "receiverEmail": "jane@example.com",
    "receiverRegion": "Chattogram",
    "receiverDistrict": "Chattogram",
    "cost": 80
  }'

# Test GET /payments
curl -X GET "http://localhost:3000/payments?email=john@example.com&senderEmail=john@example.com&customerEmail=john@example.com" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Check Browser Console

Client will log:

- "Form Data:" - the request payload
- "Token available: true" - token retrieval status
- "Parcel booking response:" - server response
- Error details if request fails

---

## Common Issues & Solutions

### Issue: "No Authorization Header" Error

**Solution:**

- Verify token is extracted correctly: `req.headers.authorization`
- Check format: `Bearer {token}` (with space)
- Log headers to debug: `console.log(req.headers)`

### Issue: "Invalid Token" Error

**Solution:**

- Verify Firebase credentials in Admin SDK
- Check token hasn't expired (tokens expire in 1 hour)
- Ensure client is using correct Firebase project

### Issue: Empty Payment Data

**Solution:**

- Verify email query parameter matches token user
- Check MongoDB documents have email field
- Return array (not object) or wrap in `payments` key

### Issue: CORS Error

**Solution:**

- Allow client origin in CORS config
- Include `credentials: true` if using cookies
- Check preflight OPTIONS requests are handled

---

## Required Environment Variables

### Client (.env.local)

```
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
```

### Server (.env)

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

---

## API Endpoints Summary

| Method | Endpoint         | Auth     | Purpose                      |
| ------ | ---------------- | -------- | ---------------------------- |
| POST   | /parcels         | Required | Book a new parcel            |
| GET    | /payments        | Required | Get payment history          |
| GET    | /payment-history | Required | Alternative payment endpoint |

---

## Client-Side Request Examples

### SendParcel.jsx

- Gets fresh Firebase token before each submission
- Stores token in localStorage
- Sends POST with token in Authorization header
- Expects response with `insertedId` or `success` flag

### PaymentHistory.jsx

- Gets fresh Firebase token for each fetch
- Sends GET request with token in header
- Expects array of payments or `{payments: []}`
- Handles empty results gracefully

---

## Ready for Server Implementation ✅

All client-side code is:

- ✅ Properly authenticated
- ✅ Sending valid Firebase tokens
- ✅ Including proper headers
- ✅ Handling errors gracefully
- ✅ Logging for debugging

**Next Step:** Implement server-side token verification and database operations.
