from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class EvaluateRequest(BaseModel):
    code: str | None = None
    question: dict | None = None
    spokenAnswer: str | None = None
    phase: str | None = "technical"
    track: str | None = "General"
    difficulty: str | None = "Mid-Level"

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Python AI Microservice is running"}

@app.post("/api/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    try:
        temp_file_path = f"/tmp/{audio.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(await audio.read())
            
        with open(temp_file_path, "rb") as file:
            transcription = groq_client.audio.transcriptions.create(
                file=(temp_file_path, file.read()),
                model="whisper-large-v3",
                response_format="json",
                language="en",
                prompt="The following is a candidate explaining their technical code solution."
            )
            
        os.remove(temp_file_path)
        
        text = transcription.text.strip()
        if ('Thank you' in text and len(text) < 20) or text == '.':
            return {"text": "Could not clearly hear your voice. Please ensure your microphone is enabled and try speaking louder."}
            
        return {"text": text}
    except Exception as e:
        print(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/evaluate")
def evaluate(request: EvaluateRequest):
    try:
        prompt = ""
        
        if request.phase == 'behavioral':
            prompt = f"""You are an expert HR and behavioral AI interviewer.
Question Context: {json.dumps(request.question)}
Candidate's Spoken Answer: {request.spokenAnswer or "No spoken answer provided."}

Analyze the candidate's spoken answer strictly using the STAR Method (Situation, Task, Action, Result).
Determine if they clearly articulated each component. If the answer is vague, generate a specific follow-up question.
CRITICAL TASK: Assess their Communication Confidence Score (0-10) based on the clarity and structure of the transcription.

Provide a strictly valid JSON response:
{{
  "score": <integer 0-10>,
  "feedback": "<Detailed conversational feedback on their STAR method delivery. Include a follow-up question if they were vague.>",
  "strengths": ["<strength>"],
  "improvements": ["<improvement>"],
  "communicationConfidence": <integer 0-10>
}}"""
        elif request.phase == 'read-code':
            prompt = f"""You are an expert technical AI interviewer.
Question Context & Buggy Code: {json.dumps(request.question)}
Candidate's Spoken Explanation: {request.spokenAnswer or "No spoken answer provided."}

Analyze the candidate's spoken explanation to determine if they correctly identified the bug and explained how to fix it.
Do not evaluate their written code, only their spoken answer regarding the provided buggy code snippet.

Provide a strictly valid JSON response:
{{
  "score": <integer 0-10>,
  "feedback": "<Detailed feedback on their debugging logic>",
  "strengths": ["<strength>"],
  "improvements": ["<improvement>"]
}}"""
        else:
            prompt = f"""You are an expert technical AI interviewer.
You are evaluating a candidate for a {request.difficulty} role in the {request.track} track.

Question Context & Requirements:
{json.dumps(request.question or "General programming task.")}

Candidate's Code implementation:
{request.code or "No code provided."}

Candidate's Spoken Answer:
{request.spokenAnswer or "No spoken answer provided."}

Analyze the provided code and spoken answer strictly as a rigorous technical interviewer.
CRITICAL TASK 1: You must dry-run and evaluate the candidate's code against exactly 6 hidden edge-case / standard test cases.
CRITICAL TASK 2: Grade the candidate on whether they correctly identified the Time and Space complexity.
CRITICAL INSTRUCTION: Since this is a {request.difficulty} role, adjust your strictness accordingly. (e.g. Senior roles require optimal O(N) or better logic, Junior roles allow brute-force).

Provide a strictly valid JSON response containing EXACTLY the following structure:
{{
  "score": <integer from 0 to 10>,
  "feedback": "<Detailed conversational feedback evaluating their approach and complexity analysis>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "hiddenTestCases": [
    {{"name": "Test Case 1", "passed": true, "description": "Tests basic functionality"}},
    {{"name": "Test Case 2 (Edge case)", "passed": false, "description": "Tests empty/null arrays"}},
    {{"name": "Test Case 3", "passed": true, "description": "Tests algorithm constraints"}}
  ]
}}"""

        completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )

        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Evaluation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
