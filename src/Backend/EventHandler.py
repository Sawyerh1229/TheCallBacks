import requests
import csv
import json

api_key = "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"
url_to_summarize = "https://lu.ma/torontotechweek"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

data = {
    "model": "sonar",  # or another available model
    "messages": [
        {
            "role": "user",
            "content": f"Extract all events from this page, under the events list: {url_to_summarize}. For each event, return the name, date, location, and description as a JSON array."
        }
    ]
}

response = requests.post(
    "https://api.perplexity.ai/chat/completions",
    headers=headers,
    json=data
)

result = response.json()
content = result["choices"][0]["message"]["content"]

print(result)

try:
    events = json.loads(content)
except Exception:
    # If the model returns markdown or text, extract the JSON part
    events = json.loads(content.split("```json")[-1].split("```")[-2])

with open("EventCSVs/events_perplexity.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["event name", "date", "location", "description"])
    writer.writeheader()
    for event in events:
        writer.writerow({
            "event name": event.get("name", ""),
            "date": event.get("date", ""),
            "location": event.get("location", ""),
            "description": event.get("description", "")
        })
print("Events saved to EventCSVs/events_perplexity.csv")