import twilio from 'twilio';
import Telnyx from 'telnyx';

// Telnyx configuration (primary)
const telnyxApiKey = process.env.TELNYX_API_KEY;
const telnyxPhoneNumber = process.env.TELNYX_PHONE_NUMBER;
const telnyx = telnyxApiKey ? new Telnyx({ apiKey: telnyxApiKey }) : null;

// Twilio configuration (fallback)
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilioAccountSid && twilioAuthToken 
  ? twilio(twilioAccountSid, twilioAuthToken) 
  : null;

const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

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
  if (!adminPhoneNumber) {
    throw new Error('ADMIN_PHONE_NUMBER is not configured.');
  }

  const appUrl = getAppUrl();
  const contactType = isEmail ? 'Email' : 'Phone';
  const message = `New InstaGift Access Request\n\n${contactType}: ${contactInfo}\n\nReview at: ${appUrl}/requests`;

  // Try Telnyx first (primary)
  if (telnyx && telnyxPhoneNumber) {
    try {
      await telnyx.messages.send({
        from: telnyxPhoneNumber,
        to: adminPhoneNumber,
        text: message,
      });
      console.log('✅ Admin SMS notification sent successfully via Telnyx (primary)');
      return;
    } catch (error: any) {
      console.error('⚠️ Telnyx failed, trying Twilio fallback:', error.message);
    }
  }

  // Fall back to Twilio
  if (!twilioClient || !twilioPhoneNumber) {
    throw new Error('Both Telnyx and Twilio SMS are not configured properly. Please check your environment secrets.');
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: adminPhoneNumber,
    });

    console.log('✅ Admin SMS notification sent successfully via Twilio (fallback)');
    console.log('Twilio Message SID:', result.sid, 'Status:', result.status, 'To:', result.to);
  } catch (error: any) {
    console.error('❌ Error sending admin SMS via Twilio:', error);
    
    // Check for specific Twilio errors
    if (error.code === 21211) {
      throw new Error('Invalid Twilio phone number. Please verify TWILIO_PHONE_NUMBER is correct and in E.164 format (+1XXXXXXXXXX).');
    }
    if (error.code === 21608) {
      throw new Error('Twilio phone number not SMS-capable. Please ensure your Twilio number supports SMS.');
    }
    if (error.code === 21614) {
      throw new Error('Invalid recipient number. Admin phone number must be in E.164 format (+1XXXXXXXXXX).');
    }
    
    throw new Error(`Failed to send admin SMS notification: ${error.message}`);
  }
}

export async function sendPasswordSMS(phoneNumber: string, password: string): Promise<void> {
  const message = `Your InstaGift access password is: ${password}\n\nUse this to access the demo at ${getAppUrl()}`;

  // Try Telnyx first (primary)
  if (telnyx && telnyxPhoneNumber) {
    try {
      await telnyx.messages.send({
        from: telnyxPhoneNumber,
        to: phoneNumber,
        text: message,
      });
      console.log('✅ Password SMS sent successfully via Telnyx (primary) to', phoneNumber);
      return;
    } catch (error: any) {
      console.error('⚠️ Telnyx failed, trying Twilio fallback:', error.message);
    }
  }

  // Fall back to Twilio
  if (!twilioClient || !twilioPhoneNumber) {
    throw new Error('Both Telnyx and Twilio SMS are not configured properly. Please check your environment secrets.');
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    console.log('✅ Password SMS sent successfully via Twilio (fallback) to', phoneNumber);
    console.log('Twilio Message SID:', result.sid, 'Status:', result.status, 'To:', result.to);
  } catch (error: any) {
    console.error('❌ Error sending password SMS via Twilio:', error);
    
    // Check for specific Twilio errors
    if (error.code === 21211) {
      throw new Error('Invalid Twilio phone number. Please verify TWILIO_PHONE_NUMBER is correct and in E.164 format (+1XXXXXXXXXX).');
    }
    if (error.code === 21608) {
      throw new Error('Twilio phone number not SMS-capable. Please ensure your Twilio number supports SMS.');
    }
    if (error.code === 21614) {
      throw new Error('Invalid recipient number. Please ensure the phone number is in E.164 format (+1XXXXXXXXXX).');
    }
    
    throw new Error(`Failed to send password SMS: ${error.message}`);
  }
}
