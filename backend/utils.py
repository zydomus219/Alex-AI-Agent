import json
import os
import re
# import gpt3_tokenizer
from openai import OpenAI
from supabase import create_client, Client
from typing import List
from openai.types.chat import ChatCompletionMessageParam



def get_embedding(query, model="text-embedding-ada-002", max_tokens=8191):
    """
    Get embedding for a query, handling maximum token limit for the model.
    If the query is too long for the model's token limit, it splits the query into chunks,
    gets embeddings for each chunk, and returns the average embedding.
    """
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    query = query.replace("\n", " ")

    # Try to use tiktoken to count tokens accurately
    try:
        import tiktoken
        enc = tiktoken.encoding_for_model(model)
        tokens = enc.encode(query)
        token_chunks = [tokens[i:i+max_tokens] for i in range(0, len(tokens), max_tokens)]
        text_chunks = [enc.decode(chunk) for chunk in token_chunks]
    except Exception:
        # Fallback: split by words (not accurate, but avoids crash)
        words = query.split()
        chunk_size = max_tokens  # approximate
        text_chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

    embeddings = []
    for chunk in text_chunks:
        response = client.embeddings.create(input=[chunk], model=model)
        embeddings.append(response.data[0].embedding)

    # If only one chunk, return its embedding directly
    if len(embeddings) == 1:
        return embeddings[0]
    else:
        # Average the embeddings element-wise
        import numpy as np
        return np.mean(embeddings, axis=0).tolist()

def generate_embedding(user_id, Knowledge_id):
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if url is None or key is None:
        print("Supabase cridential error !")
        raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    supabase: Client = create_client(url, key)

    # Fetch all content from the knowledge_items table for the given user and knowledge base
    # Try fetching all columns to debug content retrieval issues
    response = supabase.table("knowledge_items") \
        .select("content") \
        .eq('user_id', user_id) \
        .eq('knowledge_base_id', Knowledge_id) \
        .eq('status', "completed") \
        .execute()

    # if hasattr(response, "error") and response.error:
    #     raise Exception(f"Supabase error: {response.error.message}")

    items = response.data or []

    if not items or len(items) == 0:
        return {
            "content": "",
            "title": "",
            "success": False,
            "error": "No completed knowledge items found for this knowledge base."
        }

    # Concatenate all content for embedding
    content = "".join([item["content"] for item in items if item.get("content")])
    
    content = content.replace("\n", " ")
    embedding = get_embedding(content)
    # print("Embedding: ", embedding)
    supabase.table("knowledge_bases").update({"embedding": embedding, "metadata": content}).eq('id', Knowledge_id).eq('user_id', user_id).execute()

    return {
        "content": content,
        "title": f"Embedding generated for knowledge base {Knowledge_id}",
        "success": True,
        "error": None
    }

def search_matched_knowledgeBases(query, knowledge_base_id, model="text-embedding-ada-002"):
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if url is None or key is None:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    supabase: Client = create_client(url, key)
    embedding = get_embedding(query, model)

    # # Fetch user_id and knowledge_base_id from the agent table using agent_id
    # agent_response = supabase.table("agents") \
    #     .select("user_id, knowledge_base_id") \
    #     .eq("id", agent_id) \
    #     .single() \
    #     .execute()

    # if not agent_response.data:
    #     raise ValueError(f"No agent found with id {agent_id}")

    # user_id = agent_response.data.get("user_id")
    # knowledge_base_id = agent_response.data.get("knowledge_base_id")

    # if not user_id or not knowledge_base_id:
    #     raise ValueError(f"Agent {agent_id} does not have user_id or knowledge_base_id")

    matches = supabase.rpc(
        "match_knowledge_bases",
        {
            "query_embedding": embedding,
            "knowledge_base_id": knowledge_base_id,
            "match_threshold": 0.7,
            "match_count": 6
        }
    ).execute()
    return matches.data
    

def get_response(prompt: str, matches: List[dict], agent_feature="You are a helpful assistant that answers questions using the provided context."):
    print("""Generate a response based on the prompt and matched documents using chat roles.""")
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    context = "\n".join([match['content'] for match in matches])
    

    messages: list[ChatCompletionMessageParam] = [
        {"role": "system", "content": agent_feature},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {prompt}"}
    ]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=150,
        temperature=0.7
    )
    
    if response.choices and response.choices[0].message and response.choices[0].message.content:
        return response.choices[0].message.content.strip()
    else:
        return ""

def sanitize_text(text: str) -> str:
    # Remove null bytes and other non-printable/control characters except \n, \r, \t
    return re.sub(r'[^\x09\x0A\x0D\x20-\x7E\u0000-\uFFFF]', '', text)