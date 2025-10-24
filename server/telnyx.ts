import Telnyx from 'telnyx';

const telnyxApiKey = process.env.TELNYX_API_KEY;
const telnyxPhoneNumber = process.env.TELNYX_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

const telnyx = telnyxApiKey ? new Telnyx({ apiKey: telnyxApiKey }) : null;

function getAppUrl(): string {
  if (process.env.REPLIT_DOMAINS) {
    const domains = process.env.REPLIT_DOMAINS.split(',');
    return `https://${domains[0]}`;
  }
  const replSlug = process.env.REPL_SLUG || 'instagift';
  const replOwner = process.env.REPL_OWNER || 'dev';
  return `https://${replSlug}.${replOwner}.repl.co`;
}

export async function sendAdminNotificationSMS(contactInfo: string, isEmail: boolean): Promise<void> {
  if (!telnyx || !telnyxPhoneNumber || !adminPhoneNumber) {
    throw new Error('Telnyx SMS is not configured. Please add TELNYX_API_KEY, TELNYX_PHONE_NUMBER, and ADMIN_PHONE_NUMBER to environment secrets.');
  }

  try {
    const appUrl = getAppUrl();
    const contactType = isEmail ? 'Email' : 'Phone';
    const message = `New InstaGift Access Request\n\n${contactType}: ${contactInfo}\n\nReview at: ${appUrl}/requests`;

    await telnyx.messages.send({
      from: telnyxPhoneNumber,
      to: adminPhoneNumber,
      text: message,
    });

    console.log('Admin SMS notification sent successfully');
  } catch (error: any) {
    console.error('Error sending admin SMS:', error);
    
    // Check for specific Telnyx errors
    const errorCode = error.error?.errors?.[0]?.code;
    if (error.status === 400) {
      if (errorCode === '40013') {
        throw new Error('Invalid Telnyx phone number. Please verify TELNYX_PHONE_NUMBER is SMS-enabled and in E.164 format (+1XXXXXXXXXX).');
      }
      if (errorCode === '40305') {
        throw new Error('Telnyx phone number not configured. Please verify TELNYX_PHONE_NUMBER is associated with a messaging profile in your Telnyx dashboard.');
      }
    }
    
    throw new Error(`Failed to send admin SMS notification: ${error.message}`);
  }
}

export async function sendPasswordSMS(phoneNumber: string, password: string): Promise<void> {
  if (!telnyx || !telnyxPhoneNumber) {
    throw new Error('Telnyx SMS is not configured. Please add TELNYX_API_KEY and TELNYX_PHONE_NUMBER to environment secrets.');
  }

  try {
    const message = `Your InstaGift access password is: ${password}\n\nUse this to access the demo at ${getAppUrl()}`;

    await telnyx.messages.send({
      from: telnyxPhoneNumber,
      to: phoneNumber,
      text: message,
    });

    console.log('Password SMS sent successfully to', phoneNumber);
  } catch (error: any) {
    console.error('Error sending password SMS:', error);
    
    // Check for specific Telnyx errors
    const errorCode = error.error?.errors?.[0]?.code;
    if (error.status === 400) {
      if (errorCode === '40013') {
        throw new Error('Invalid Telnyx phone number. Please verify TELNYX_PHONE_NUMBER is SMS-enabled and in E.164 format (+1XXXXXXXXXX).');
      }
      if (errorCode === '40305') {
        throw new Error('Telnyx phone number not configured. Please verify TELNYX_PHONE_NUMBER is associated with a messaging profile in your Telnyx dashboard.');
      }
    }
    
    throw new Error(`Failed to send password SMS: ${error.message}`);
  }
}
