import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    if (!process.env.EMAIL_USER) {
      console.log('Email not configured, skipping send');
      return { success: false, message: 'Email not configured' };
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendCandidateNotification(candidate) {
  const subject = `New ${candidate.evaluation_result} Candidate: ${candidate.name}`;
  const html = `
    <h2>New Candidate Evaluation</h2>
    <p><strong>Name:</strong> ${candidate.name}</p>
    <p><strong>Result:</strong> ${candidate.evaluation_result}</p>
    <p><strong>Confidence Score:</strong> ${candidate.confidence_score}%</p>
    <p><strong>Skills:</strong> ${candidate.skills}</p>
    <p><strong>Experience:</strong> ${candidate.experience}</p>
    <p><strong>Summary:</strong> ${candidate.summary_text}</p>
  `;

  return await sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject,
    html,
  });
}
