/**
 * eMitra Payment Gateway Redirect Utility
 * Handles redirecting to payment gateway with encrypted data
 */

/**
 * Get eMitra environment URL based on current environment
 */
export function getEmiraUrl(): string {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'production';

  if (environment === 'stage') {
    const stageUrl = process.env.NEXT_PUBLIC_EMITRA_STAGE_URL;
    if (!stageUrl) {
      console.error('NEXT_PUBLIC_EMITRA_STAGE_URL is not configured');
      throw new Error('Payment gateway URL not configured for stage environment');
    }
    return stageUrl;
  }

  const prodUrl = process.env.NEXT_PUBLIC_EMITRA_PROD_URL;
  if (!prodUrl) {
    console.error('NEXT_PUBLIC_EMITRA_PROD_URL is not configured');
    throw new Error('Payment gateway URL not configured for production environment');
  }
  return prodUrl;
}

/**
 * Open payment gateway in a new POST request
 * Creates a form with encrypted data and submits it to eMitra
 */
export function openPostPage(
  url: string,
  data: Record<string, any>
): void {
  try {
    const form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;

    for (const name in data) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = String(data[name]);
      form.appendChild(input);
    }

    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error('Error redirecting to payment gateway:', error);
    throw error;
  }
}

/**
 * Check if response contains valid payment gateway data
 * Checks both top-level and result-nested payment data
 */
export function isValidPaymentData(response: any): boolean {
  // Check if payment data is at top level
  if (response?.ENCDATA && response?.MERCHANTCODE && response?.SERVICEID) {
    return true;
  }

  // Check if payment data is in result object
  if (response?.result?.ENCDATA && response?.result?.MERCHANTCODE && response?.result?.SERVICEID) {
    return true;
  }

  return false;
}
