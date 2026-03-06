import { initDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await initDatabase();

    if (result.success) {
      return Response.json({ success: true, message: 'Database initialized successfully' });
    } else {
      return Response.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
