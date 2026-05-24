const fs = require('fs');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.transcribeAudio = async (filePath) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "json",
    });
    
    return {
      text: transcription.text,
      confidence: 1.0 // Whisper API doesn't return confidence directly in simple JSON
    };
  } catch (error) {
    console.error('[AI Service] Transcription Error:', error);
    throw error;
  }
};

exports.evaluateInterview = async (data) => {
  try {
    const prompt = `
    You are an expert technical interviewer for a software engineering role.
    Here is the recent conversation transcript or candidate's response:
    "${data.transcript}"
    
    Current Interview Context:
    Role: ${data.role || 'Frontend Engineer'}
    Topic: ${data.topic || 'Architecture'}
    
    Evaluate the candidate's response and provide:
    1. A score from 0-100 for technical accuracy.
    2. A brief feedback statement.
    3. The next logical interview question to ask them.
    4. Behavioral traits (Confidence, Clarity, Sentiment) scored 0-100.
    
    You MUST respond in valid JSON format ONLY, exactly matching this structure:
    {
      "score": 85,
      "feedback": "Strong understanding...",
      "nextQuestion": "How would you scale...",
      "behavioral": {
        "confidence": 90,
        "clarity": 80,
        "sentiment": 85
      }
    }
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI Interviewer outputting only JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(responseText);
  } catch (error) {
    console.error('[AI Service] Evaluation Error:', error);
    throw error;
  }
};
