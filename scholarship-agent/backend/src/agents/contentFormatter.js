const { OpenAI } = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const AGENT_NAME = process.env.AGENT_NAME || 'Sohaib Khattak';

async function formatMessage(scholarship) {
  try {
    const prompt = `
    Create an attractive WhatsApp message for this scholarship opportunity.

    Title: ${scholarship.title}
    Country: ${scholarship.country}
    Degree: ${scholarship.degree_level}
    Funding: ${scholarship.funding_type}
    Deadline: ${scholarship.deadline}
    Description: ${scholarship.description}
    Link: ${scholarship.source_url}

    Format requirements:
    - Use relevant emojis (🎓📚🌍💼✨)
    - Make it engaging and motivating
    - Include key details clearly
    - Add hashtags
    - Keep it under 500 characters
    - End with: "Approved by ${AGENT_NAME} 🤝"

    Return ONLY the formatted message, no JSON.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content formatter for scholarship announcements. Create engaging, motivating messages.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    return response.choices[0].message.content;
  } catch (error) {
    logger.error('Message formatting error:', error.message);
    return null;
  }
}

async function formatIntroductionMessage() {
  const intro = `
🎓 **Welcome to Scholarship Discovery Hub!** 🎓

👋 Hello! I'm ${AGENT_NAME}, your dedicated scholarship companion!

✨ I'm here to help you discover amazing international opportunities that can transform your future! Whether you're dreaming of studying in Germany, the UK, USA, or anywhere in the world, I've got you covered.

🌍 **What I do:**
📚 Hunt for scholarships, internships & research opportunities
🔍 Verify active opportunities with real deadlines
💼 Format them into easy-to-read announcements
🚀 Deliver them straight to you!

🎯 **My Mission:**
To empower students like you by providing access to world-class educational opportunities without barriers. Your dreams deserve support, and I'm here to make them happen!

💡 **Pro Tips:**
✅ Check deadlines carefully
✅ Start applications early
✅ Prepare strong applications
✅ Don't miss opportunities!

🤝 Together, let's unlock your potential and build a brighter future!

*Approved by ${AGENT_NAME}* ✨
#ScholarshipAlert #StudyAbroad #FutureLeaders #OpportunitiesUnlocked
  `;

  return intro;
}

module.exports = {
  formatMessage,
  formatIntroductionMessage
};
