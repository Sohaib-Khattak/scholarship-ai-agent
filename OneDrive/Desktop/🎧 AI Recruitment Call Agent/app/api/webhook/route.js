import { neon } from '@neondatabase/serverless';
import { createCandidate } from '@/lib/db';

const sql = neon(process.env.DATABASE_URL);
import { verifyWebhookSignature } from '@/lib/crypto';
import { sendCandidateNotification } from '@/lib/notifications';

export async function POST(request) {
  try {
    const signature = request.headers.get('x-webhook-signature');
    const payload = await request.json();

    // Verify webhook signature
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(payload, signature, webhookSecret);
      if (!isValid) {
        return Response.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Validate required fields
    const requiredFields = ['candidate_name', 'evaluation_result', 'call_id'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Check for duplicate call_id
    const existingCandidate = await sql`SELECT id FROM candidates WHERE call_id = ${payload.call_id}`;
    if (existingCandidate.length > 0) {
      return Response.json({ error: 'Duplicate call_id' }, { status: 409 });
    }

    // Create candidate record
    const candidateData = {
      name: payload.candidate_name,
      age: payload.age,
      qualification: payload.qualification,
      skills: payload.skills,
      experience: payload.experience,
      preferred_country: payload.preferred_country,
      expected_salary: payload.expected_salary,
      evaluation_result: payload.evaluation_result,
      confidence_score: payload.confidence_score,
      summary_text: payload.summary_text,
      call_id: payload.call_id,
    };

    const result = await createCandidate(candidateData);
    const candidate = result[0];

    // Send notification if AGREE
    if (payload.evaluation_result === 'AGREE') {
      await sendCandidateNotification(candidate);
    }

    return Response.json({
      success: true,
      candidate_id: candidate.id,
      message: 'Candidate data received and stored'
    }, { status: 201 });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
