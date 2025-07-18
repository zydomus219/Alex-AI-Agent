
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File, Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from supabase import create_client, Client
import uvicorn
import PyPDF2
import io, os
from typing import Optional
from firecrawl import FirecrawlApp, ScrapeOptions
from config import FIRECRAWL_API_KEY, CRAWL_SETTINGS  # type: ignore
from utils import generate_embedding, search_matched_knowledgeBases, get_response, sanitize_text  # type: ignore

app = FastAPI(title="Knowledge Base Content Extractor", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pdf_contents = ""
url_contents = ""
script_contents = ""

class URLRequest(BaseModel):
    url: HttpUrl

class ContentResponse(BaseModel):
    content: str
    title: str
    success: bool
    error: Optional[str] = None

class SearchBody(BaseModel):
    query: str
    agent_id: str

@app.get("/")
async def root():
    return {"message": "Knowledge Base Content Extractor API"}

@app.post("/extract/pdf", response_model=ContentResponse)
async def extract_pdf(file: UploadFile = File(...)):
    """Extract text content from uploaded PDF file"""
    try:
        if not file.filename or not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Read the uploaded file
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        
        # Extract text using PyPDF2
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        extracted_text = ""
        
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        
        pdf_contents = sanitize_text(extracted_text.strip())

        # print("pdf_contents:", pdf_contents)  # Debugging line
        return ContentResponse(
            content=extracted_text.strip(),
            title=file.filename or "Unknown PDF",
            success=True
        )
        
    except Exception as e:
        return ContentResponse(
            content="",
            title="",
            success=False,
            error=str(e)
        )

@app.post("/extract/url", response_model=ContentResponse)
async def extract_url(request: URLRequest):
    """Extract text content from website URL using Firecrawl"""
    try:
        if not FIRECRAWL_API_KEY:
            raise HTTPException(status_code=500, detail="Firecrawl API key not configured")
        
        # Initialize Firecrawl app
        app = FirecrawlApp(api_key=FIRECRAWL_API_KEY)
        scrape_options = ScrapeOptions(
            formats= [ 'markdown' ],
            onlyMainContent= False,
            excludeTags= [ 'path', 'img', 'svg' ],
            parsePDF= True,
            maxAge= 14400000
        )
        
        # Crawl the URL
        crawl_status = app.crawl_url(
            str(request.url),
            limit=CRAWL_SETTINGS.get("max_pages", 1),
            max_depth=CRAWL_SETTINGS.get("max_depth", 0),
            scrape_options=scrape_options,
            poll_interval=CRAWL_SETTINGS.get("poll_interval", 10)
        )
  
        # Extract content from crawl results
            
        if hasattr(crawl_status, 'data'):
            data = crawl_status.data
        else:
            data = crawl_status
        
        content = str(crawl_status)
        title = str(request.url)
        
        if not content.strip():
            raise HTTPException(status_code=400, detail="Could not extract content from URL")
        
        url_contents = content.strip()
        # print("url_contents:", url_contents)  # Debugging line

        return ContentResponse(
            content=content.strip(),
            title=title,
            success=True
        )
        
    except Exception as e:
        return ContentResponse(
            content="",
            title="",
            success=False,
            error=str(e)
        )

        # generate_embedding(pdf_contents, user_id = "76e5a3a8-19ec-4fcd-9f2b-2955ce6c7ee6", Knowledge_name="123123")

@app.post("/knowledge_embedding", response_model=ContentResponse)
async def knowledge_embedding(
    user_id: str = Body(..., embed=True),
    knowledge_base_id: str = Body(..., embed=True)
):
    try:
        # print("user: ", user_id, "\nknowledge_id: ", knowledge_base_id)
        # Call generate_embedding from utils.py
        # Assuming generate_embedding returns a dict with keys: content, title, success, error (optional)
        result = generate_embedding(user_id=user_id, Knowledge_id=knowledge_base_id)
        return ContentResponse(
            content=result.get("content", ""),
            # content="Successed",
            title=result.get("title", ""),
            success=result.get("success", True),
            error=result.get("error", None)
        )
    except Exception as e:
        return ContentResponse(
            content="",
            title="",
            success=False,
            error=str(e)
        )


@app.post("/query", response_model=ContentResponse)
async def get_answer(prompt:SearchBody):
    query = prompt.query
    agent_id = prompt.agent_id

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if url is None or key is None:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    supabase: Client = create_client(url, key)

    # Fetch user_id and knowledge_base_id from the agent table using agent_id
    agent_response = supabase.table("agents") \
        .select("user_id, knowledge_base_id, prompt_content") \
        .eq("id", agent_id) \
        .single() \
        .execute()

    if not agent_response.data:
        raise ValueError(f"No agent found with id {agent_id}")

    user_id = agent_response.data.get("user_id")
    knowledge_base_id = agent_response.data.get("knowledge_base_id")
    agent_feature = str(agent_response.data.get("prompt_content"))

    if not user_id or not knowledge_base_id:
        raise ValueError(f"Agent {agent_id} does not have user_id or knowledge_base_id")

    search = search_matched_knowledgeBases(query, knowledge_base_id)
    content = get_response(query, search, agent_feature)

    return ContentResponse(
        content=content,
        title="AI Response",
        success=True
    )

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
