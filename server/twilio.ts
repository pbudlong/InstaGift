import twilio from 'twilio';

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

const twilioClient = twilioAccountSid && twilioAuthToken 
  ? twilio(twilioAccountSid, twilioAuthToken) 
  : null;

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
  if (!twilioClient || !twilioPhoneNumber || !adminPhoneNumber) {
    throw new Error('Twilio SMS is not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, and ADMIN_PHONE_NUMBER to environment secrets.');
  }

  try {
    const appUrl = getAppUrl();
    const contactType = isEmail ? 'Email' : 'Phone';
    const message = `New InstaGift Access Request\n\n${contactType}: ${contactInfo}\n\nReview at: ${appUrl}/requests`;

    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: adminPhoneNumber,
    });

    console.log('Admin SMS notification sent successfully via Twilio');
    console.log('Twilio Message SID:', result.sid, 'Status:', result.status, 'To:', result.to);
  } catch (error: any) {
    console.error('Error sending admin SMS via Twilio:', error);
    
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
  if (!twilioClient || !twilioPhoneNumber) {
    throw new Error('Twilio SMS is not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to environment secrets.');
  }

  try {
    const message = `Your InstaGift access password is: ${password}\n\nUse this to access the demo at ${getAppUrl()}`;

    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    console.log('Password SMS sent successfully via Twilio to', phoneNumber);
    console.log('Twilio Message SID:', result.sid, 'Status:', result.status, 'To:', result.to);
  } catch (error: any) {
    console.error('Error sending password SMS via Twilio:', error);
    
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
