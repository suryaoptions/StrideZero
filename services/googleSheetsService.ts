
export interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  productNames: string; // "Product A (1), Product B (2)"
  totalAmount: string;
  dateTime: string;
}

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const SCRIPT_URL = 'https://script.google.com/macros/s/INSERT_YOUR_ID_HERE/exec';

export const submitOrderToGoogleSheets = async (data: OrderData) => {
  if (SCRIPT_URL.includes('INSERT_YOUR_ID_HERE')) {
    console.warn('Google Apps Script URL is not configured. Check services/googleSheetsService.ts');
    return false;
  }

  try {
    // 'no-cors' is required for Google Apps Script Web Apps when called from a browser
    // Note: detailed response status is opaque in no-cors mode
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('Order sent to Google Sheets');
    return true;
  } catch (error) {
    console.error('Error sending order to Google Sheets', error);
    return false;
  }
};
