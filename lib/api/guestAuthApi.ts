import { http } from '../http';

export interface LoginResponse {
  message: string;
  success: boolean;
}

export interface UserDetailDto {
  id?: string;
  mobileNo?: string;
  email?: string;
  [key: string]: any;
}

export interface VerifyOTPResult {
  token: string;
  tokenExpiry: number;
  userRole: string;
  userType: string;
  systemAdmin: boolean;
  userDetailDto: UserDetailDto | null;
  [key: string]: any;
}

export interface VerifyOTPResponse {
  message: string;
  success: boolean;
  result?: VerifyOTPResult;
  token?: string;
  user?: {
    id: string;
    mobileNo?: string;
    email?: string;
  };
}

/**
 * Login with mobile number
 */
export async function loginWithMobile(mobileNo: string): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append('mobileNo', mobileNo);

  const response = await http.post('/guest/login?isEmailVerify=false', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

/**
 * Login with email
 */
export async function loginWithEmail(email: string): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append('email', email);

  const response = await http.post('/guest/login?isEmailVerify=true', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

/**
 * Verify OTP for mobile login
 * Extracts token from response.result for use in subsequent API calls
 */
export async function verifyOTPForMobile(
  mobileNo: string,
  otp: string
): Promise<VerifyOTPResponse> {
  const formData = new FormData();
  formData.append('mobileNo', mobileNo);
  formData.append('otp', otp);

  const response = await http.post('/guest/verify?isEmailVerify=false', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = response.data;

  // Extract token from result and add to response for easier access
  if (data?.result?.token) {
    data.token = data.result.token;
  }

  return data;
}

/**
 * Verify OTP for email login
 * Extracts token from response.result for use in subsequent API calls
 */
export async function verifyOTPForEmail(
  email: string,
  otp: string
): Promise<VerifyOTPResponse> {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('otp', otp);

  const response = await http.post('/guest/verify?isEmailVerify=true', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = response.data;

  // Extract token from result and add to response for easier access
  if (data?.result?.token) {
    data.token = data.result.token;
  }

  return data;
}
