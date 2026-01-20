# Ticket Pricing API Integration & Session Management

## 📋 Overview

Implemented dynamic ticket pricing fetching and session-based authentication to provide real-time pricing and seamless user experience.

---

## 🔄 API Integration

### Ticket Pricing API
```
GET /booking/tickets?placeId=:placeId&date=:dateEpoch&specificChargesId=:specificChargesId
```

**Parameters:**
- `placeId` (string) - Backend place ID from `backendPlace.id`
- `date` (number) - Current date in epoch milliseconds (milliseconds, not seconds)
- `specificChargesId` (string) - Charge specification ID (default: `65aa27a26aebab05633bd572`)

**Headers (if authenticated):**
```javascript
Authorization: Bearer ${authToken}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "placeId": "65c8c4ec6d3ed87a4de309ee",
  "date": 1768588200000,
  "ticketTypes": [
    {
      "id": "1",
      "name": "Indian Citizen",
      "price": 50,
      "type": "INDIAN"
    },
    {
      "id": "2",
      "name": "Foreign Citizen",
      "price": 200,
      "type": "FOREIGNER"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Place not found"
}
```

---

## 🔐 Authentication & Session Management

### 1. **Token Storage** (After OTP Verification)

When `/guest/verify` API returns successfully, the response contains:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "mobileNo": "9876543210"
  }
}
```

**Session Storage Keys:**
```javascript
sessionStorage.setItem('authToken', response.token);
sessionStorage.setItem('authUser', JSON.stringify(response.user));
sessionStorage.setItem('verifiedContact', contact);
sessionStorage.setItem('verifiedIsEmail', String(isEmailLogin));
```

### 2. **Session Persistence**

When verify page loads, it checks for existing authentication:

```typescript
const existingToken = sessionStorage.getItem('authToken');
const existingContact = sessionStorage.getItem('verifiedContact');

if (existingToken && existingContact) {
  // User is already verified
  // Skip login, go directly to confirmation modal
  setOtpSent(true);
  setShowConfirmModal(true);
}
```

**Benefits:**
- ✅ User doesn't need to re-login if they press back from confirmation modal
- ✅ Faster return to booking
- ✅ Better user experience on slower networks

### 3. **Authorization Header**

When fetching ticket pricing, include auth token if available:

```typescript
const authToken = sessionStorage.getItem('authToken');

const response = await getBookingTickets(
  placeId,
  dateEpoch,
  specificChargesId,
  authToken || undefined  // Automatically includes in Authorization header
);
```

---

## 🎨 UI Components

### BookingConfirmModal

**Location:** `components/booking/BookingConfirmModal.tsx`

**Features:**
- ✅ Fetches ticket types on modal open
- ✅ Displays dynamic pricing from API
- ✅ Shows skeleton loader while fetching
- ✅ Fallback to default prices if API fails
- ✅ Calculates total based on API prices
- ✅ Displays per-ticket and total breakdown
- ✅ Bottom-sheet modal (mobile-friendly)

**Props:**
```typescript
interface BookingConfirmModalProps {
  isOpen: boolean;
  bookingData: BookingData | null;
  contact: string;
  isEmailLogin: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  specificChargesId?: string; // Default: '65aa27a26aebab05633bd572'
}
```

### Skeleton Loaders

**Location:** `components/SkeletonLoader.tsx`

**Components:**
- `SkeletonTicketRow` - Individual ticket row loading state
- `SkeletonPriceBreakdown` - Price section loading
- `SkeletonModalContent` - Complete modal skeleton

**Usage:**
```typescript
{loadingTickets ? (
  <SkeletonModalContent />
) : (
  // Actual modal content
)}
```

---

## 🔄 Data Flow

### Complete User Journey with Session Management

```
1. QR Scan
   └─> /place-details/[slug]

2. Place Details
   ├─> Display place info
   ├─> Select tickets
   └─> Click "Proceed to Payment"
       └─> sessionStorage.setItem('booking', {...})

3. Verify Page
   ├─> Check sessionStorage for authToken
   │   ├─ If exists: Skip login, show confirmation modal
   │   └─ If not exists: Show login form
   ├─> User enters mobile/email
   ├─> Send OTP via /guest/login?isEmailVerify=false/true
   ├─> User enters OTP
   └─> Verify via /guest/verify?isEmailVerify=false/true
       └─> Response: { token, user }
           └─> Save to sessionStorage
               ├─> authToken
               ├─> authUser
               ├─> verifiedContact
               └─> verifiedIsEmail

4. Confirmation Modal
   ├─> Fetch ticket types
   │   └─> GET /booking/tickets?placeId=...&date=...&specificChargesId=...
   │       └─> Include Authorization: Bearer ${authToken}
   ├─> Display dynamic pricing
   ├─> Show booking summary
   └─> User confirms
       └─> Proceed to payment

5. User Presses Back (from modal)
   └─> Returns to verify page
       ├─> Check authToken exists in session
       └─> Skip login, show modal directly
```

---

## 🧪 Data Format Examples

### Epoch Date Conversion

```typescript
// Convert date string to epoch milliseconds
const dateStr = "2024-01-20";
const dateEpoch = new Date(dateStr).getTime();
// Result: 1705689000000

// Or use current date
const currentDateEpoch = new Date().getTime();
// Result: 1768588200000 (example)
```

### API Call Example

```typescript
const response = await getBookingTickets(
  "65c8c4ec6d3ed87a4de309ee",        // placeId (backendPlace.id)
  1768588200000,                      // date (epoch milliseconds)
  "65aa27a26aebab05633bd572",        // specificChargesId
  "eyJhbGciOiJIUzI1NiIs..."          // authToken (optional)
);

// Response
{
  success: true,
  placeId: "65c8c4ec6d3ed87a4de309ee",
  date: 1768588200000,
  ticketTypes: [
    { id: "1", name: "Indian Citizen", price: 50, type: "INDIAN" },
    { id: "2", name: "Foreign Citizen", price: 200, type: "FOREIGNER" }
  ]
}
```

---

## ⚙️ Error Handling

### API Error Response
```typescript
try {
  const response = await getBookingTickets(...);
  setTicketTypes(response.ticketTypes);
} catch (error) {
  console.error('Failed to fetch ticket types:', error);
  // Fallback to default prices
  setTicketTypes([
    { id: '1', name: 'Indian Citizen', price: 50, type: 'INDIAN' },
    { id: '2', name: 'Foreign Citizen', price: 200, type: 'FOREIGNER' },
  ]);
  setTicketError('Could not load ticket pricing');
}
```

### Fallback Pricing
If API fails, default prices are used:
- Indian Citizen: ₹50
- Foreign Citizen: ₹200

---

## 🔄 Session Storage Keys Reference

| Key | Type | Value | Used For |
|-----|------|-------|----------|
| `booking` | JSON | Ticket selections & pricing | Booking data from place details |
| `authToken` | String | JWT token | API authentication header |
| `authUser` | JSON | User object | User info (id, mobile/email) |
| `verifiedContact` | String | Mobile/email | Display on modal, restore on back |
| `verifiedIsEmail` | String | "true" or "false" | Know which login method used |
| `verifiedBooking` | JSON | Complete booking data | Final booking with verification |

---

## 📱 Mobile Optimization

✅ Bottom-sheet modal (gesture-friendly)  
✅ Skeleton loader (progressive loading)  
✅ Large touch targets (48px minimum)  
✅ Session persistence (no re-login)  
✅ Error handling with fallbacks  
✅ Responsive pricing display  

---

## 🚀 Next Steps

1. **Payment Gateway Integration**
   - Create `/payment` page
   - Use `verifiedBooking` from session storage
   - Integrate Stripe/Razorpay/CCAvenue
   - Include auth token in payment API calls

2. **Booking Confirmation**
   - Create `/confirmation` page
   - Display ticket reference number
   - Send email/SMS confirmation

3. **Analytics**
   - Track ticket type distribution
   - Monitor pricing variations by date
   - Analyze booking completion rates

---

## 🧪 Testing Checklist

- [ ] Verify ticket types fetched correctly
- [ ] Dynamic pricing displays accurately
- [ ] Skeleton loader shows during fetch
- [ ] Fallback pricing works on API error
- [ ] Auth token saved in session storage
- [ ] Back navigation skips login
- [ ] Session persists across page reloads
- [ ] Multiple users don't share sessions
- [ ] Token included in API headers
- [ ] Date conversion to epoch correct
- [ ] Modal responsive on different screen sizes
