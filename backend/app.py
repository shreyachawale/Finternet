from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
from threading import Lock

from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware



BASE_DIR = Path(__file__).resolve().parent.parent
WALLET_FILE = BASE_DIR / "src" / "data" / "wallet.json"
PLATFORM_CUT = 0.20

app = FastAPI(title="Demo Wallet System")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-process lock (demo only)
file_lock = Lock()


# ---------- Models ----------

class ChargeRequest(BaseModel):
    amount: float

class RechargeRequest(BaseModel):
    amount: float

# ---------- Helpers ----------

def read_wallet():
    with open(WALLET_FILE, "r") as f:
        return json.load(f)


def write_wallet(data):
    temp_file = WALLET_FILE.with_suffix(".json.tmp")
    with open(temp_file, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(temp_file, WALLET_FILE)


# ---------- Routes ----------

@app.get("/wallets")
def get_wallets():
    with file_lock:
        return read_wallet()


@app.post("/charge")
def charge(req: ChargeRequest):
    amount = round(req.amount, 2)

    if amount < 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    with file_lock:
        data = read_wallet()

        student = data["wallets"]["id1"]
        teacher = data["wallets"]["id2"]
        middleman = data["wallets"]["id3"]

        if student["balance"] < amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        platform_cut = round(amount * PLATFORM_CUT, 2)
        teacher_share = round(amount - platform_cut, 2)

        # Apply updates
        student["balance"] -= amount
        teacher["balance"] += teacher_share
        middleman["balance"] += platform_cut

        write_wallet(data)

    return {
        "charged": amount,
        "teacher_received": teacher_share,
        "platform_cut": platform_cut
    }


@app.get("/wallets/student/{student_id}")
def get_student_wallet(student_id: str):
    with file_lock:
        data = read_wallet()

    if student_id not in data["wallets"]:
        raise HTTPException(status_code=404, detail="Wallet not found")

    wallet = data["wallets"][student_id]

    if wallet["role"] != "student":
        raise HTTPException(status_code=400, detail="Not a student wallet")

    return {
        "student_id": student_id,
        "balance": wallet["balance"]
    }



@app.post("/recharge")
def recharge(req: RechargeRequest):
    amount = round(req.amount, 2)

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid recharge amount")

    with file_lock:
        data = read_wallet()

        student = data["wallets"]["id1"]  # TEMP: logged-in student

        student["balance"] += amount

        write_wallet(data)

    return {
        "recharged": amount,
        "new_balance": round(student["balance"], 2)
    }


# pip install fastapi pydantic vaderSentiment uvicorn

# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, Field, validator
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
# import re

# analyzer = SentimentIntensityAnalyzer()

# # --- 1. ROBUST DATA MODEL ---
# class ReviewRequest(BaseModel):
#     review_text: str = Field(default="", description="The text content of the review")
#     star_rating: int = Field(..., ge=1, le=5, description="Rating between 1 and 5")
#     watch_time_min: float = Field(..., ge=0, description="Time user spent watching")
#     total_time_min: float = Field(..., gt=0, description="Total duration of the course")

#     # Validator to ensure watch time doesn't exceed total time (logical error)
#     @validator('watch_time_min')
#     def validate_watch_time(cls, v, values):
#         if 'total_time_min' in values and v > values['total_time_min']:
#             return values['total_time_min'] # Cap it at max course length
#         return v

# # --- 2. THE TRUST ENGINE LOGIC ---
# def calculate_trust_score(data: ReviewRequest):
#     flags = []
#     trust_points = 100  # Start with a perfect score and deduct
    
#     # --- A. METRICS CALCULATION ---
    
#     # 1. Watch Ratio
#     watch_ratio = data.watch_time_min / data.total_time_min
    
#     # 2. Sentiment Score (-1.0 to 1.0)
#     if data.review_text.strip():
#         sentiment = analyzer.polarity_scores(data.review_text)['compound']
#     else:
#         sentiment = 0.0 # Neutral if empty

#     # --- B. HEURISTIC CHECKS (The "Thinking" Part) ---

#     # CHECK 1: The "Ghost" User (Did they actually watch it?)
#     # Logic: If course is long (>30m), they need 5%. If short, they need 20%.
#     min_threshold = 0.05 if data.total_time_min > 30 else 0.20
    
#     if watch_ratio < min_threshold:
#         # CRITICAL FAIL: If they watched almost nothing, the review is invalid regardless of text
#         trust_points -= 50 
#         flags.append(f"Insufficient watch time ({round(watch_ratio*100,1)}%). Minimum required: {min_threshold*100}%")
    
#     elif watch_ratio < (min_threshold * 2):
#         # MINOR FAIL: Watched a bit, but maybe not enough to judge fully
#         trust_points -= 10
#         flags.append("Low watch time relative to course length.")

#     # CHECK 2: The "Lazy" Reviewer (Empty Text)
#     if len(data.review_text.strip()) < 3:
#         # If rating is extreme (1 or 5) but no text, that's suspicious behavior
#         if data.star_rating == 1 or data.star_rating == 5:
#             trust_points -= 30
#             flags.append("Extreme rating (1 or 5) with no explanation is suspicious.")
#         else:
#             # If rating is average (2,3,4), empty text is just lazy, not necessarily fake
#             trust_points -= 10
#             flags.append("Review text is empty.")
    
#     # CHECK 3: Sentiment Consistency (Do words match stars?)
#     # We define expected sentiment ranges for star ratings
#     expected_sentiment = {
#         5: (0.1, 1.0),   # Expect positive
#         4: (0.0, 1.0),   # Expect neutral to positive
#         3: (-0.3, 0.3),  # Expect neutral-ish
#         2: (-1.0, 0.1),  # Expect negative to neutral
#         1: (-1.0, -0.1)  # Expect negative
#     }
    
#     # Only check consistency if there is actual text
#     if len(data.review_text) > 3:
#         min_exp, max_exp = expected_sentiment[data.star_rating]
        
#         # We allow a small "buffer" of 0.1 deviation
#         if sentiment < min_exp - 0.1:
#             trust_points -= 40
#             flags.append(f"Rating is {data.star_rating}★ but text is Negative/Neutral ({sentiment}).")
#         elif sentiment > max_exp + 0.1:
#             trust_points -= 40
#             flags.append(f"Rating is {data.star_rating}★ but text is too Positive ({sentiment}).")

#     # CHECK 4: Spam/Gibberish Detector
#     # Check if a single character is repeated too much (e.g., "Goooooood" or ".......")
#     if data.review_text and len(data.review_text) > 10:
#         unique_chars = set(data.review_text.lower())
#         if len(unique_chars) < 4: 
#             trust_points -= 60
#             flags.append("Text appears to be gibberish or repetitive spam.")

#     # --- C. FINAL VERDICT ---
    
#     # Normalize score (0 to 100)
#     final_score = max(0, min(100, trust_points))
    
#     if final_score >= 80:
#         status = "Trusted"
#     elif final_score >= 50:
#         status = "Questionable"
#     else:
#         status = "Rejected"

#     return {
#         "status": status,
#         "trust_score": final_score,
#         "is_genuine": final_score >= 50, # Simple boolean for your frontend
#         "sentiment_score": sentiment,
#         "watch_percentage": round(watch_ratio * 100, 1),
#         "flags": flags
#     }

# # --- 3. ENDPOINT ---

# @app.post("/verify-review")
# async def verify_review(review: ReviewRequest):
#     result = calculate_trust_score(review)
#     return result

# # Run with: uvicorn main:app --reload


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime
import json
import re
from fastapi.responses import StreamingResponse
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI  # OpenRouter uses the OpenAI library

# app = FastAPI()

analyzer = SentimentIntensityAnalyzer()

# --- 1. ROBUST DATA MODEL ---
class ReviewRequest(BaseModel):
    review_text: str = Field(default="", description="The text content of the review")
    star_rating: int = Field(..., ge=1, le=5, description="Rating between 1 and 5")
    watch_time_min: float = Field(..., ge=0, description="Time user spent watching")
    total_time_min: float = Field(..., gt=0, description="Total duration of the course")

    @validator("watch_time_min")
    def validate_watch_time(cls, v, values):
        if "total_time_min" in values and v > values["total_time_min"]:
            return values["total_time_min"]
        return v


# --- 2. TRUST ENGINE ---
def calculate_trust_score(data: ReviewRequest):
    flags = []
    trust_points = 100

    watch_ratio = data.watch_time_min / data.total_time_min

    sentiment = (
        analyzer.polarity_scores(data.review_text)["compound"]
        if data.review_text.strip()
        else 0.0
    )

    min_threshold = 0.05 if data.total_time_min > 30 else 0.20

    if watch_ratio < min_threshold:
        trust_points -= 50
        flags.append(
            f"Insufficient watch time ({round(watch_ratio * 100, 1)}%). "
            f"Minimum required: {min_threshold * 100}%"
        )
    elif watch_ratio < min_threshold * 2:
        trust_points -= 10
        flags.append("Low watch time relative to course length.")

    if len(data.review_text.strip()) < 3:
        if data.star_rating in (1, 5):
            trust_points -= 30
            flags.append("Extreme rating with no explanation is suspicious.")
        else:
            trust_points -= 10
            flags.append("Review text is empty.")

    expected_sentiment = {
        5: (0.1, 1.0),
        4: (0.0, 1.0),
        3: (-0.3, 0.3),
        2: (-1.0, 0.1),
        1: (-1.0, -0.1),
    }

    if len(data.review_text) > 3:
        min_exp, max_exp = expected_sentiment[data.star_rating]
        if sentiment < min_exp - 0.1 or sentiment > max_exp + 0.1:
            trust_points -= 40
            flags.append(
                f"Rating ({data.star_rating}★) inconsistent with sentiment ({sentiment})."
            )

    if data.review_text and len(data.review_text) > 10:
        if len(set(data.review_text.lower())) < 4:
            trust_points -= 60
            flags.append("Text appears to be spam or gibberish.")

    final_score = max(0, min(100, trust_points))

    status = (
        "Trusted" if final_score >= 80 else
        "Questionable" if final_score >= 50 else
        "Rejected"
    )

    return {
        "status": status,
        "trust_score": final_score,
        "is_genuine": final_score >= 50,
        "sentiment_score": sentiment,
        "watch_percentage": round(watch_ratio * 100, 1),
        "flags": flags,
    }


# --- 3. ENDPOINT (APPEND MODE) ---
@app.post("/verify-review")
async def verify_review(review: ReviewRequest):
    result = calculate_trust_score(review)

    new_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "input": review.dict(),
        "result": result,
    }

    file_path = "review.json"

    # Load existing data or initialize empty list
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                if not isinstance(data, list):
                    data = []
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    # Append new review
    data.append(new_entry)

    # Write back to file
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    return result



@app.get("/reviews")
async def get_reviews():
    with open("review.json", "r", encoding="utf-8") as f:
        return json.load(f)

# Run with:
# uvicorn main:app --reload


OPENROUTER_API_KEY = "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"
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# Hardcoded for testing (Feel free to change this)
HARDCODED_YT_LINK = "https://www.youtube.com/watch?v=mkZsaDA2JnA"

class ChatQuery(BaseModel):
    user_query: str = ""
    video_url: str = ""

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
