# Rajasthan Ticket Booking - Complete Flow

## 📱 User Journey

### 1. **QR Code Scan**
- Tourist scans QR code at monument
- Direct link: `https://yourdomain.com/place-details/Hawa-mahal`
- No home page redirection

### 2. **Place Details Page** (`/place-details/[slug]`)
- ✅ Displays place information
- ✅ Auto-selects today's date
- ✅ Shows place image from GraphQL API
- ✅ Displays ticket selection interface
- ✅ User selects Indian/Foreign citizen tickets
- ✅ Shows price breakdown
- ✅ **Click "Proceed to Payment"** → Navigates to `/verify`

### 3. **Verification & Login Page** (`/verify`)

#### Step 1: Choose Login Method
- **Toggle between Mobile or Email**
- Default: Mobile login

#### Step 2: Send OTP
**Mobile Login Flow:**
```
API Call: POST /guest/login?isEmailVerify=false
Form Data: { mobileNo: "9876543210" }
Response: { success: true, message: "OTP sent" }
```

**Email Login Flow:**
```
API Call: POST /guest/login?isEmailVerify=true
Form Data: { email: "user@example.com" }
Response: { success: true, message: "OTP sent" }
```

#### Step 3: Verify OTP
**Mobile OTP Verification:**
```
API Call: POST /guest/verify?isEmailVerify=false
Form Data: { mobileNo: "9876543210", otp: "123456" }
Response: {
  success: true,
  message: "Verified",
  token: "auth_token_xyz",
  user: { id: "user123", mobileNo: "9876543210" }
}
```

**Email OTP Verification:**
```
API Call: POST /guest/verify?isEmailVerify=true
Form Data: { email: "user@example.com", otp: "123456" }
Response: {
  success: true,
  message: "Verified",
  token: "auth_token_xyz",
  user: { id: "user123", email: "user@example.com" }
}
```

### 4. **Booking Confirmation Modal** (After successful OTP verification)

The modal displays:
- ✅ Place name & location
- ✅ Visit date (formatted)
- ✅ Ticket breakdown (Indian & Foreign citizens)
- ✅ Per-ticket and total pricing
- ✅ Verified contact (mobile or email)
- ✅ Confirmation message

#### Actions:
- **"Confirm & Proceed to Payment"** → Proceeds to payment
- **"Cancel"** → Goes back to edit

### 5. **Payment Page** (`/payment`)
- Receives verified booking data from session storage
- Includes contact info and authentication
- Ready for payment gateway integration

---

## 🔄 API Integration Points

### Authentication Endpoints
```
POST /guest/login?isEmailVerify=false     // Mobile login
POST /guest/login?isEmailVerify=true      // Email login
POST /guest/verify?isEmailVerify=false    // Mobile OTP verification
POST /guest/verify?isEmailVerify=true     // Email OTP verification
```

### Booking Data Flow
```
SessionStorage:
{
  "booking": {
    "placeName": "Hawa Mahal",
    "strapiPlaceId": 1,
    "backendPlaceId": 42,
    "indian": 2,
    "foreigner": 1,
    "total": 400,
    "date": "2024-01-20"
  },
  
  "verifiedBooking": {
    ...booking,
    "contact": "9876543210" or "user@example.com",
    "isEmailLogin": false,
    "verifiedAt": "2024-01-20T10:30:00Z"
  }
}
```

---

## 🎨 UI Components

### Created Components:
1. **BookingConfirmModal** (`components/booking/BookingConfirmModal.tsx`)
   - Bottom sheet modal (mobile-friendly)
   - Displays booking summary
   - Confirm and cancel actions
   - Shows booking details clearly

2. **Updated TicketSelector** (`components/booking/TicketSelector.tsx`)
   - Places booking data in session storage
   - Navigates to `/verify`

3. **Updated VerifyPage** (`app/verify/page.tsx`)
   - Mobile/Email toggle
   - OTP request and verification
   - Booking summary display
   - Integration with BookingConfirmModal

---

## 📋 Form Data Format

### Login Requests
```javascript
// Mobile
const formData = new FormData();
formData.append('mobileNo', '9876543210');

// Email
const formData = new FormData();
formData.append('email', 'user@example.com');
```

### OTP Verification Requests
```javascript
// Mobile
const formData = new FormData();
formData.append('mobileNo', '9876543210');
formData.append('otp', '123456');

// Email
const formData = new FormData();
formData.append('email', 'user@example.com');
formData.append('otp', '123456');
```

---

## 🔐 Security Features

✅ **Secure Communication:**
- HTTPS endpoints configured
- OTP validation on server-side
- Token-based authentication

✅ **User Privacy:**
- No sensitive data in logs
- Secure session storage
- Client-side form validation

✅ **Error Handling:**
- User-friendly error messages
- Toast notifications
- Graceful fallbacks

---

## 📊 State Management

### Session Storage Keys:
- `booking` - Ticket selections and pricing
- `verifiedBooking` - Complete booking with verification

### Component State:
- Contact (mobile or email)
- Login method toggle (mobile/email)
- OTP input
- Modal visibility
- Loading states
- Timer for OTP resend

---

## ✨ Features

✅ Toggle between Mobile and Email login  
✅ OTP countdown timer  
✅ OTP resend functionality  
✅ Real-time validation  
✅ Loading states  
✅ Error handling with toast notifications  
✅ Booking summary display  
✅ Confirmation modal with details  
✅ Thumb-friendly UI for mobile  
✅ Responsive design (375px+)  

---

## 🚀 Next Steps

1. **Payment Gateway Integration**
   - Create `/payment` page
   - Integrate Stripe/Razorpay/CCAvenue
   - Pass verified booking data

2. **Booking Confirmation Page**
   - Create `/confirmation` page
   - Display ticket details
   - Show reference number
   - Email/SMS confirmation flow

3. **Admin Dashboard**
   - View bookings
   - Manage QR codes
   - Analytics

---

## 📱 Mobile Optimization

✅ Thumb-friendly buttons (48px × 48px minimum)  
✅ Large touch targets  
✅ Form fields with proper spacing  
✅ Bottom sheet modals  
✅ Native input types (tel, email)  
✅ Keyboard-aware layouts  
✅ Accessible form labels  

---

## 🧪 Testing Checklist

- [ ] Mobile login flow
- [ ] Email login flow
- [ ] OTP resend functionality
- [ ] Booking confirmation modal
- [ ] Form validation
- [ ] Error handling
- [ ] Session persistence
- [ ] Payment page integration
