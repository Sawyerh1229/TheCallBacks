import scrapy
from scrapy.crawler import CrawlerProcess
import os

class EventSpider(scrapy.Spider):
    name = "event_spider"

    def __init__(self, url, *args, **kwargs):
        super(EventSpider, self).__init__(*args, **kwargs)
        self.start_urls = [url]

    def parse(self, response):
        # Update selectors based on the actual event page structure
        for event in response.css('div.event'):
            yield {
                'name': event.css('h2::text').get(),
                'time': event.css('span.date::text').get(),
                'location': event.css('span.location::text').get(),
                'description': event.css('p.description::text').get(),
            }

def scrape_events_to_csv(url, user_id):
    # Ensure the EventCSVs directory exists
    csv_dir = os.path.join(os.path.dirname(__file__), "EventCSVs")
    os.makedirs(csv_dir, exist_ok=True)
    output_file = os.path.join(csv_dir, f"events_{user_id}.csv")
    # Remove file if it exists to avoid appending
    if os.path.exists(output_file):
        os.remove(output_file)
    process = CrawlerProcess(settings={
        "FEEDS": {
            output_file: {"format": "csv"},
        },
        "LOG_ENABLED": False
    })
    process.crawl(EventSpider, url=url)
    process.start()
    return output_file

if __name__ == "__main__":
    test_url = "https://www.torontotechweek.com/calendar"  # Replace with a real event page URL
    user_id = "testuser"
    csv_file = scrape_events_to_csv(test_url, user_id)
    print(f"Events saved to {csv_file}")