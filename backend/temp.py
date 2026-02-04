import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI  # OpenRouter uses the OpenAI library

app = FastAPI(title="AI YouTube Tutor Pro")

# 1. SETUP OPENROUTER
# Get your key at https://openrouter.ai/keys
OPENROUTER_API_KEY = "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"
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# Hardcoded for testing (Feel free to change this)
HARDCODED_YT_LINK = "https://www.youtube.com/watch?v=mkZsaDA2JnA"

class ChatQuery(BaseModel):
    user_query: str
    video_url: str | None = None

def extract_video_id(url: str):
    video_id_match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return video_id_match.group(1) if video_id_match else None

def resolve_video_id(video_url: str | None):
    url = video_url if video_url else HARDCODED_YT_LINK
    video_id = extract_video_id(url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    return video_id

def get_transcript_text(video_id: str):
    try:
        api = YouTubeTranscriptApi()
        # Fetch the transcript (defaults to English)
        transcript_data = api.list(video_id).find_transcript(['en']).fetch()
        
        # Robust parsing: handles both item['text'] and item.text
        full_text = []
        for item in transcript_data:
            # Check if it's an object (newer versions) or a dict (older versions)
            text = item.text if hasattr(item, 'text') else item['text']
            start = item.start if hasattr(item, 'start') else item['start']
            full_text.append(f"[{int(start)}s]: {text}")
            
        return " ".join(full_text)

    except Exception as e:
        print(f"DEBUG ERROR: {str(e)}")
        return None



@app.get("/get-formatted-transcript")
async def get_formatted_transcript(video_url: str | None = None):
    video_id = resolve_video_id(video_url)

    try:
        api = YouTubeTranscriptApi()
        transcript_data = api.list(video_id).find_transcript(['en']).fetch()

        formatted_list = []
        for item in transcript_data:
            raw_start = item.start if hasattr(item, 'start') else item['start']
            text = item.text if hasattr(item, 'text') else item['text']

            minutes = int(raw_start // 60)
            seconds = int(raw_start % 60)
            timestamp = f"{minutes}:{seconds:02d}"

            formatted_list.append({
                "timestamp": timestamp,
                "text": text,
                "raw_seconds": raw_start
            })

        return {
            "video_id": video_id,
            "transcript": formatted_list
        }

    except Exception as e:
        print(f"DEBUG ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not format transcript")

@app.post("/ask-ai")
async def ask_ai_stream(query: ChatQuery):
    video_id = resolve_video_id(query.video_url)
    transcript = get_transcript_text(video_id)

    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript unavailable.")

    system_prompt = f"""
    You are a 'Video Chat-Bit'—a highly intelligent academic assistant.
    Below is the transcript of a YouTube video (with timestamps).
    Your task:
    1. Answer the user's questions ONLY using the video content.
    2. If the user asks for a summary, provide key takeaways with timestamps.
    3. If the user's question isn't covered, politely say:
       "The video doesn't mention that, but based on what it says about [topic]..."

    TRANSCRIPT:
    {transcript}
    """

    async def event_generator():
        response = client.chat.completions.create(
            model="arcee-ai/trinity-large-preview:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query.user_query}
            ],
            stream=True,
        )

        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    return StreamingResponse(event_generator(), media_type="text/plain")
