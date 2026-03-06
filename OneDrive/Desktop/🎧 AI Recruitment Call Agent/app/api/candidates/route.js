import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const call_id = searchParams.get('call_id');
    const evaluation_result = searchParams.get('evaluation_result');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let result;

    if (call_id) {
      result = await sql`
        SELECT * FROM candidates
        WHERE call_id = ${call_id}
        LIMIT 1
      `;
    } else if (evaluation_result) {
      result = await sql`
        SELECT * FROM candidates
        WHERE evaluation_result = ${evaluation_result}
        ORDER BY call_timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      result = await sql`
        SELECT * FROM candidates
        ORDER BY call_timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return Response.json({
      success: true,
      candidates: result,
      count: result.length
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
