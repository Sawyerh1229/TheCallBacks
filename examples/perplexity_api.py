import os
from openai import OpenAI

perp_api_key=os.getenv("PERPLEXITY_API_KEY")

client = OpenAI(
    api_key=perp_api_key,
    base_url="https://api.perplexity.ai"
)

prompt = "Extract ALL events from this page which satisfy the condition: 'INTEREST = Career Fair, DATE = 25 June 2025'. For each event, return the name, date, location, and description from: https://www.torontotechweek.com/calendar \nList the events in CSV format with no other extra verbiage befor or after the list."

response = client.chat.completions.create(
    model="sonar-pro",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
)
print(response.choices[0].message.content)

