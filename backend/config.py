import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Firecrawl configuration
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")

# Crawl settings
CRAWL_SETTINGS = {
    "max_pages": 1,  # Only crawl the single page for content extraction
    "max_depth": 1,  #extract sub url of depth
    "poll_interval": 10,  # seconds between status checks
} 