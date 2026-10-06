# Real Request/Response Examples - Client to Server

## How to Use This Document

This document shows EXACT request and response formats that will be sent between client and server. Use this to:

1. Set up your server endpoints
2. Test your implementation
3. Verify compatibility
4. Debug any issues

---

## 1. POST /parcels - Book a Parcel

### Real Client Request

**Headers:**

```
POST /parcels HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE3MGUwOTgzMGI1OGI4ZDM1OTMzMzg2MzAwMjQ4ZWM0OWI4OWU0YzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZWJhc2UtcHJvamVjdC1pZCIsImF1ZCI6ImZpcmViYXNlLXByb2plY3QtaWQiLCJhdXRoX3RpbWUiOjE2OTI5NDE0NDksInVzZXJfaWQiOiJ1SWQxMjM0NTY3ODkwIiwiY2xhc2MiOjE2OTI5NDE0NDksImVtYWlsIjoiam9obkBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJqb2huQGVtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn0sImlhdCI6MTY5Mjk0MTQ0OSwiZXhwIjoxNjkyOTQ1MDQ5LCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImpvaG5AZW1haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifSwic3ViIjoidUlkMTIzNDU2Nzg5MCJ9.abc123xyz...
Content-Type: application/json
Content-Length: 487
```

**Request Body:**

```json
{
  "parcelType": "document",
  "parcelName": "Important Confidential Document",
  "parcelWeight": 0.5,
  "senderName": "John Doe",
  "senderEmail": "john@email.com",
  "senderAddress": "123 Main Street, Dhaka",
  "senderPhone": "01712345678",
  "senderRegion": "Dhaka",
  "senderDistrict": "Dhaka",
  "pickupInstruction": "Please knock twice and wait",
  "receiverName": "Jane Smith",
  "receiverAddress": "456 Park Avenue, Chattogram",
  "receiverContact": "01987654321",
  "receiverEmail": "jane@email.com",
  "receiverRegion": "Chattogram",
  "receiverDistrict": "Chattogram",
  "deliveryInstruction": "Leave at reception if no one home",
  "cost": 80
}
```

### Expected Success Response

**Option 1 - Basic Success Response:**

```json
{
  "success": true,
  "insertedId": "64e8f9a1b2c3d4e5f6g7h8i9",
  "message": "Parcel booked successfully"
}
```

**Option 2 - MongoDB Response Format:**

```json
{
  "acknowledged": true,
  "insertedId": "64e8f9a1b2c3d4e5f6g7h8i9"
}
```

**HTTP Status:** `201 Created` or `200 OK`

### What Client Expects

Client checks for:

```javascript
response.status === 200 ||
  response.status === 201 ||
  response.data?.insertedId ||
  response.data?.acknowledged ||
  response.data?.success;
```

### If Any of Above → SUCCESS ✅

```javascript
// User sees:
Swal.fire({
  position: "top-end",
  icon: "success",
  title: "Parcel Booked Successfully!",
  text: "You will be redirected to payment.",
  showConfirmButton: false,
  timer: 2500,
});
// Then redirects to /dashboard/my-parcels
```

### Error Response Example

**HTTP Status:** `400`, `401`, `500`

```json
{
  "error": "Invalid request data",
  "message": "Parcel weight must be a positive number"
}
```

OR

```json
{
  "message": "Unauthorized: Invalid token",
  "error": "Firebase token verification failed"
}
```

### What Client Does on Error

```javascript
// Shows to user:
Swal.fire(
  "Error!",
  "Invalid request data", // from error.response.data.message
  "error",
);

// Also logs:
console.error("Error booking parcel:", error);
console.error("Error response:", error.response?.data);
console.error("Error status:", error.response?.status);
```

---

## 2. GET /payments - Fetch Payment History

### Real Client Request

**HTTP Request:**

```
GET /payments?email=john@email.com&senderEmail=john@email.com&customerEmail=john@email.com HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE3MGUwOTgzMGI1OGI4ZDM1OTMzMzg2MzAwMjQ4ZWM0OWI4OWU0YzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZWJhc2UtcHJvamVjdC1pZCIsImF1ZCI6ImZpcmViYXNlLXByb2plY3QtaWQiLCJhdXRoX3RpbWUiOjE2OTI5NDE0NDksInVzZXJfaWQiOiJ1SWQxMjM0NTY3ODkwIiwiY2xhc3MiOjE2OTI5NDE0NDksImVtYWlsIjoiam9obkBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJqb2huQGVtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn0sImlhdCI6MTY5Mjk0MTQ0OSwiZXhwIjoxNjkyOTQ1MDQ5LCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImpvaG5AZW1haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifSwic3ViIjoidUlkMTIzNDU2Nzg5MCJ9.abc123xyz...
Accept: application/json
```

### Expected Success Response - Format 1

**With `payments` wrapper:**

```json
{
  "payments": [
    {
      "_id": "64e8f9a1b2c3d4e5f6g7h8i9",
      "email": "john@email.com",
      "amount": 80,
      "paidAt": "2026-08-31T10:30:00Z",
      "transactionId": "stripe_12345",
      "status": "completed",
      "parcelName": "Important Confidential Document"
    },
    {
      "_id": "64e8f9a1b2c3d4e5f6g7h8ja",
      "email": "john@email.com",
      "amount": 150,
      "paidAt": "2026-08-30T15:45:00Z",
      "transactionId": "stripe_12346",
      "status": "completed",
      "parcelName": "Package"
    }
  ]
}
```

### Expected Success Response - Format 2

**Direct array (client extracts automatically):**

```json
[
  {
    "_id": "64e8f9a1b2c3d4e5f6g7h8i9",
    "email": "john@email.com",
    "amount": 80,
    "paidAt": "2026-08-31T10:30:00Z",
    "transactionId": "stripe_12345",
    "status": "completed",
    "parcelName": "Important Confidential Document"
  },
  {
    "_id": "64e8f9a1b2c3d4e5f6g7h8ja",
    "email": "john@email.com",
    "amount": 150,
    "paidAt": "2026-08-30T15:45:00Z",
    "transactionId": "stripe_12346",
    "status": "completed",
    "parcelName": "Package"
  }
]
```

**HTTP Status:** `200 OK`

### Empty Result

**Client expects:**

```json
{
  "payments": []
}
```

OR

```json
[]
```

**HTTP Status:** `200 OK`

### What Client Does with Response

```javascript
// Client code:
const res = await axiosSecure.get(`/payments?${queryParams.toString()}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Extracts data (handles both formats):
const records = res.data?.payments ?? res.data ?? [];
return Array.isArray(records) ? records : [];

// Then displays in table:
sortedPayments.map((payment) => (
  <tr key={payment?._id}>
    <td>{payment?.amount}</td>
    <td>{formatRelativeTime(payment?.paidAt)}</td>
    {/* ... more fields */}
  </tr>
));
```

### Error Response Example

**HTTP Status:** `401`, `404`, `500`

```json
{
  "error": "User not found",
  "message": "No payments found for this user"
}
```

### What Client Does on Error

```javascript
// Shows in console:
console.error("Error fetching payment history:", error);
console.error("Error status:", error.response?.status);
console.error("Error data:", error.response?.data);

// User sees empty table (default empty array)
// No error alert shown (graceful handling)
```

---

## Complete Transaction Flow Example

### Scenario: User Books a Parcel and Later Checks Payment

```
Step 1: User fills SendParcel form
═══════════════════════════════════════════════════════════

Form Data:
{
  parcelType: "document",
  parcelName: "Documents",
  parcelWeight: 0.5,
  senderName: "John Doe",
  senderEmail: "john@email.com",
  senderPhone: "01712345678",
  senderRegion: "Dhaka",
  senderDistrict: "Dhaka",
  receiverName: "Jane Smith",
  receiverEmail: "jane@email.com",
  receiverPhone: "01987654321",
  receiverRegion: "Chattogram",
  receiverDistrict: "Chattogram",
}


Step 2: Cost is calculated
═══════════════════════════════════════════════════════════

Same district: true
Document: true
Cost: 60 BDT (not 80 because same district)
Wait, let me recalculate: same district + document = 60


Step 3: User confirms payment alert
═══════════════════════════════════════════════════════════

Alert shows: "You have to Pay 60 BDT!"


Step 4: Client gets Firebase token and sends request
═══════════════════════════════════════════════════════════

REQUEST:
POST /parcels
Authorization: Bearer {firebaseToken}

BODY:
{
  ...all form fields...,
  cost: 60
}


Step 5: Server verifies token and saves parcel
═══════════════════════════════════════════════════════════

Server:
1. Extracts token from Authorization header
2. Verifies token with Firebase Admin SDK
3. Extracts user email from token: john@email.com
4. Validates request data
5. Saves to MongoDB parcels collection


Step 6: Server responds
═══════════════════════════════════════════════════════════

RESPONSE:
{
  "success": true,
  "insertedId": "64e8f9a1b2c3d4e5f6g7h8i9",
  "message": "Parcel booked successfully"
}

HTTP Status: 201 Created


Step 7: Client shows success and redirects
═══════════════════════════════════════════════════════════

Alert: "Parcel Booked Successfully! You will be redirected to payment."
Redirects to: /dashboard/my-parcels


Step 8: User navigates to PaymentHistory
═══════════════════════════════════════════════════════════

Component mounts, triggers query


Step 9: Client gets fresh Firebase token and sends request
═══════════════════════════════════════════════════════════

REQUEST:
GET /payments?email=john@email.com&senderEmail=john@email.com&customerEmail=john@email.com
Authorization: Bearer {newFirebaseToken}


Step 10: Server returns payment history
═══════════════════════════════════════════════════════════

RESPONSE:
{
  "payments": [
    {
      "_id": "64e8f9a1b2c3d4e5f6g7h8i9",
      "email": "john@email.com",
      "amount": 60,
      "paidAt": "2026-08-31T10:30:00Z",
      "transactionId": "stripe_12345",
      "status": "completed",
      "parcelName": "Documents"
    }
  ]
}

HTTP Status: 200 OK


Step 11: Client displays payment table
═══════════════════════════════════════════════════════════

Shows in table:
- Amount: 60 BDT
- Paid: Just now
- Status: Completed
```

---

## Server Implementation Checklist Using These Examples

Using this document, implement your server with these exact request/response formats:

### POST /parcels

- [ ] Extract `Authorization` header
- [ ] Split by "Bearer " to get token
- [ ] Verify token with Firebase Admin SDK
- [ ] Get user email from token
- [ ] Validate all required fields in request body
- [ ] Save to MongoDB `parcels` collection
- [ ] Return response with `insertedId` or `acknowledged`
- [ ] Return HTTP 201 on success
- [ ] Return HTTP 400/401/500 on error with message

### GET /payments

- [ ] Extract `Authorization` header
- [ ] Verify token with Firebase Admin SDK
- [ ] Get email from query parameters
- [ ] Query MongoDB `payments` collection
- [ ] Return array wrapped in `payments` key OR raw array
- [ ] Return HTTP 200 with payments
- [ ] Return HTTP 401 for invalid token
- [ ] Return HTTP 500 on server error

---

## Testing with cURL

```bash
# Set your token
TOKEN="your_firebase_token_here"

# Test POST /parcels
curl -X POST http://localhost:3000/parcels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parcelType": "document",
    "parcelName": "Test Document",
    "parcelWeight": 0.5,
    "senderName": "John Doe",
    "senderEmail": "john@email.com",
    "senderAddress": "123 Main St",
    "senderPhone": "01712345678",
    "senderRegion": "Dhaka",
    "senderDistrict": "Dhaka",
    "receiverName": "Jane Smith",
    "receiverAddress": "456 Park Ave",
    "receiverContact": "01987654321",
    "receiverEmail": "jane@email.com",
    "receiverRegion": "Chattogram",
    "receiverDistrict": "Chattogram",
    "cost": 60
  }'

# Test GET /payments
curl -X GET "http://localhost:3000/payments?email=john@email.com&senderEmail=john@email.com&customerEmail=john@email.com" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Summary

**Client sends:**
✅ Valid Firebase JWT token in Authorization header
✅ Proper Content-Type header
✅ Complete request payload
✅ Proper formatting

**Server must:**
✅ Verify Firebase token
✅ Extract user info from token
✅ Process request
✅ Return proper response format
✅ Use correct HTTP status codes

**All data flow examples are here for reference!** ✨
