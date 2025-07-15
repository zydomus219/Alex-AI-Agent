
# Knowledge Base Content Extractor API

A FastAPI backend service that extracts content from PDF files and websites using Firecrawl for web scraping.

## Features

- **PDF Content Extraction**: Extract text content from uploaded PDF files using PyPDF2
- **Web Content Extraction**: Extract content from websites using Firecrawl (supports markdown and HTML formats)
- **CORS Support**: Configured for frontend integration
- **Error Handling**: Comprehensive error handling for both PDF and URL extraction

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Firecrawl API Key

1. Get your Firecrawl API key from [https://firecrawl.dev/](https://firecrawl.dev/)
2. Create a `.env` file in the backend directory:
   ```bash
   cp env.example .env
   ```
3. Edit the `.env` file and add your Firecrawl API key:
   ```
   FIRECRAWL_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### GET /
Returns a welcome message.

### POST /extract/pdf
Extract text content from an uploaded PDF file.

**Request**: Multipart form data with a PDF file
**Response**: JSON with extracted content, title, and success status

### POST /extract/url
Extract content from a website URL using Firecrawl.

**Request**: JSON with URL
```json
{
  "url": "https://example.com"
}
```

**Response**: JSON with extracted content, title, and success status

## Configuration

The `config.py` file contains configuration settings:

- `FIRECRAWL_API_KEY`: Your Firecrawl API key
- `CRAWL_SETTINGS`: Crawl configuration (max pages, poll interval)

## Dependencies

- FastAPI: Web framework
- Uvicorn: ASGI server
- PyPDF2: PDF text extraction
- Firecrawl: Web scraping and content extraction
- Python-dotenv: Environment variable management
- BeautifulSoup4: HTML parsing (fallback)
- Requests: HTTP requests (fallback)

## Error Handling

The API returns structured error responses with:
- `success`: Boolean indicating if the operation was successful
- `error`: Error message if the operation failed
- `content`: Extracted content (empty if failed)
- `title`: Page title or filename (empty if failed)
