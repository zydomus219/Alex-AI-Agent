# 🧭 Knowledge Base Content Extractor

A React + FastAPI app that extracts content from PDFs and websites, builds searchable knowledge bases with embeddings, and answers questions via AI—all through a modern UI.

---

## 📚 Table of Contents

[About](#-about)  
[Features](#-features)  
[Tech Stack](#-tech-stack)  
[Installation](#-installation)  
[Usage](#-usage)  
[Configuration](#-configuration)  
[Screenshots](#-screenshots)  
[API Documentation](#-api-documentation)  
[Contact](#-contact)

---

## 🧩 About

This project provides an intuitive interface for managing knowledge bases: upload PDFs or paste URLs to extract content, store and embed it (Supabase + OpenAI), then query it through configurable agents. It solves the need to turn documents and web pages into searchable, AI-ready knowledge without manual copying—useful for support bots, internal wikis, and research workflows.

---

## ✨ Features

- **PDF content extraction** – Upload PDFs and get clean text using PyPDF2.
- **Web content extraction** – Scrape URLs with Firecrawl (markdown/HTML, optional PDF parsing).
- **Knowledge bases & embeddings** – Store content in Supabase and generate embeddings for semantic search.
- **AI-powered Q&A** – Query knowledge bases via agents with configurable prompts (OpenAI).
- **Modern React UI** – Vite + TypeScript, shadcn/ui, Tailwind CSS, React Router, TanStack Query.
- **CORS & error handling** – Backend ready for frontend integration with structured API responses.

---

## 🧠 Tech Stack

**Languages:** TypeScript, JavaScript, Python  
**Frameworks:** React, FastAPI, Vite  
**Database:** Supabase (PostgreSQL)  
**Libraries:** PyPDF2, Firecrawl, OpenAI, BeautifulSoup4, React Hook Form, Zod  
**Tools:** Tailwind CSS, shadcn-ui, TanStack Query, Uvicorn, ESLint

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AlexAI-william.git

# Navigate to the project directory
cd AlexAI-William

# Install frontend dependencies
npm install
```

**Backend (optional, for local API):**

```bash
cd backend
pip install -r requirements.txt
```

---

## 🚀 Usage

**1. Configure environment** (see [Configuration](#-configuration)), then start the backend (if running locally):

```bash
cd backend
python main.py
```

Backend runs at **http://localhost:8000**.

**2. Start the frontend:**

```bash
npm run dev
```

Then open your browser at:

👉 [http://localhost:5173](http://localhost:5173)

(Vite may use port 8080 if configured in `vite.config.ts`.)

---

## 🧾 Configuration

Create a `.env` file in the project root (copy from `env.example`):

**Frontend (.env):**

```
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (backend/.env):**

```
FIRECRAWL_API_KEY=your_firecrawl_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
```

Get Firecrawl keys at [firecrawl.dev](https://firecrawl.dev/). Ensure the backend URL in the frontend matches where the API is running.

---

## 🖼 Screenshots

- **Pitch deck** – [pitchdeck.pdf](./public/pitchdeck.pdf)
- **Study case** – ![Study case](https://raw.githubusercontent.com/zydomus219/Alex-AI-Agent/refs/heads/main/public/Case%20Study.png)

Add demo images, GIFs, or UI preview screenshots here.

---

## 📜 API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| POST | `/extract/pdf` | Extract text from uploaded PDF (multipart form) |
| POST | `/extract/url` | Extract content from a URL (JSON: `{"url": "https://..."}`) |
| POST | `/knowledge_embedding` | Generate embeddings for a knowledge base (body: `user_id`, `knowledge_base_id`) |
| POST | `/query` | Get AI answer from knowledge base (body: `query`, `agent_id`) |

Responses use a common shape: `{ content, title, success, error? }`.

---

## 📬 Contact

**Author:** zydomus  
**Email:** luckystar000628@gmail.com  
**GitHub:** [@zydomus](https://github.com/zydomus)

---

## 🌟 Acknowledgements

- [Lovable](https://lovable.dev) – Project hosting and deployment (Lovable project: [link](https://lovable.dev/projects/be583b43-bf66-4f99-8e7c-be921d224e99))
- [Firecrawl](https://firecrawl.dev) – Web scraping and content extraction
- [shadcn/ui](https://ui.shadcn.com) – UI components
- [Supabase](https://supabase.com) – Database and auth
- [OpenAI](https://openai.com) – Embeddings and chat completions
