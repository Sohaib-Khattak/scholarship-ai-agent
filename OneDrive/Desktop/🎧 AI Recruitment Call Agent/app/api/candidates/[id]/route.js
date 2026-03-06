import { getCandidateById } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const candidate = await getCandidateById(params.id);

    if (!candidate) {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return Response.json({ success: true, candidate });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
