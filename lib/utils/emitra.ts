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
  data: Record<string, string | number | boolean>
): void {
  try {
    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.style.display = 'none';

    // Add all data as hidden input fields
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    // Append form to body and submit
    document.body.appendChild(form);
    form.submit();

    // Optional: remove form after submission
    setTimeout(() => {
      document.body.removeChild(form);
    }, 100);
  } catch (error) {
    console.error('Error redirecting to payment gateway:', error);
    throw error;
  }
}

/**
 * Check if response contains valid payment gateway data
 */
export function isValidPaymentData(response: any): boolean {
  return !!(response?.ENCDATA && response?.MERCHANTCODE && response?.SERVICEID);
}
