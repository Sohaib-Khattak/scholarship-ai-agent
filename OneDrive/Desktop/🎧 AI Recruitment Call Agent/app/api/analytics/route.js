import { getStats } from '@/lib/db';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';

    const stats = await getStats();

    // Get trend data
    let dateFormat;
    switch (period) {
      case 'weekly':
        dateFormat = 'YYYY-IW';
        break;
      case 'monthly':
        dateFormat = 'YYYY-MM';
        break;
      case 'yearly':
        dateFormat = 'YYYY';
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
    }

    const trendData = await sql`
      SELECT
        TO_CHAR(call_timestamp, ${dateFormat}) as period,
        COUNT(*) as total,
        SUM(CASE WHEN evaluation_result = 'AGREE' THEN 1 ELSE 0 END) as agree,
        SUM(CASE WHEN evaluation_result = 'DISAGREE' THEN 1 ELSE 0 END) as disagree
      FROM candidates
      GROUP BY period
      ORDER BY period DESC
      LIMIT 30
    `;

    // Skill distribution
    const skillsData = await sql`
      SELECT skills, COUNT(*) as count
      FROM candidates
      WHERE skills IS NOT NULL
      GROUP BY skills
      ORDER BY count DESC
      LIMIT 10
    `;

    // Country preference
    const countryData = await sql`
      SELECT preferred_country, COUNT(*) as count
      FROM candidates
      WHERE preferred_country IS NOT NULL
      GROUP BY preferred_country
      ORDER BY count DESC
      LIMIT 10
    `;

    return Response.json({
      success: true,
      stats,
      trends: trendData,
      skills: skillsData,
      countries: countryData
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
