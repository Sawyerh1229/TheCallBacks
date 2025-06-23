from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import requests
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
api_key = os.getenv("PERPLEXITY_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExtractEventsRequest(BaseModel):
    url: str
    interests: str = ""

def extract_events_json(url_to_summarize: str, interests: str):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    prompt = (
        f"Extract all events from this page: {url_to_summarize}. "
        f"Based on the user's interests: {interests}, recommend and order the events from most to least relevant. "
        f"For each event, return an object with the following fields: name, date, time, location, description. "
        f"Return your answer as a JSON array, with each event as an object. If date and time are together, split them if possible."
    )
    data = {
        "model": "sonar-pro",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    response = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers=headers,
        json=data
    )
    if response.status_code != 200:
        return {"error": response.text}
    result = response.json()
    content = result["choices"][0]["message"]["content"]
    import re, json
    def extract_json_array(text):
        match = re.search(r'(\[.*?\])', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass
        try:
            return json.loads(text)
        except Exception:
            try:
                return json.loads(text.split("```json")[-1].split("```")[-2])
            except Exception:
                return None
    events = extract_json_array(content)
    if events is None:
        return {"error": "Could not parse events from LLM response.", "raw": content}
    return events

@app.post("/extract-events")
async def extract_events_endpoint(body: ExtractEventsRequest):
    url = body.url
    interests = body.interests
    if not url:
        return JSONResponse(status_code=400, content={"error": "Missing 'url' in request body."})
    try:
        events = extract_events_json(url, interests)
        return JSONResponse(content={"events": events})
    except Exception as e:
        print(f"Internal error: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error.", "details": str(e)})