import { getSettings, updateSettings } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/crypto';

export async function GET(request) {
  try {
    const settings = await getSettings();

    if (settings && settings.api_key_encrypted) {
      settings.api_key = '***********';
      delete settings.api_key_encrypted;
    }

    return Response.json({ success: true, settings });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { assistant_id, api_key, environment_mode } = body;

    if (!assistant_id || !api_key) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const api_key_encrypted = encrypt(api_key);
    const webhook_secret = process.env.WEBHOOK_SECRET;

    const result = await updateSettings({
      assistant_id,
      api_key_encrypted,
      webhook_secret,
      connection_status: 'CONNECTED',
      environment_mode: environment_mode || 'sandbox'
    });

    return Response.json({
      success: true,
      message: 'Settings saved successfully',
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhook`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
