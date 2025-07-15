import json
import os
import re
# import gpt3_tokenizer
from openai import OpenAI
from supabase import create_client, Client
from typing import List
from openai.types.chat import ChatCompletionMessageParam

def get_embedding(query, model="text-embedding-ada-002"):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    query = query.replace("\n", " ")
    embedding = client.embeddings.create(input=[query], model=model).data[0].embedding
    return embedding

def generate_embedding(text):
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if url is None or key is None:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
        print("Supabase cridential error !")
    supabase: Client = create_client(url, key)
    user_id = "76e5a3a8-19ec-4fcd-9f2b-2955ce6c7ee6"
    text = text.replace("\n", " ")
    embedding = get_embedding(text)
    print("Embedding: ", embedding)
    supabase.table("knowledge_bases").update({"embedding": embedding}).eq('user_id', user_id).eq('name', '123123').execute()

def search_documents(query, model="text-embedding-ada-002"):
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if url is None or key is None:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    supabase: Client = create_client(url, key)
    embedding = get_embedding(query, model)
    matches = supabase.rpc(
        "match_documents",
        {"query_embedding": embedding, "match_threshold": 0.7, "match_count": 6},
    ).execute()
    return matches
    
    

def get_response(prompt: str, matches: List[dict]):
    print("""Generate a response based on the prompt and matched documents using chat roles.""")
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    context = "\n".join([match['content'] for match in matches])
    

    messages: list[ChatCompletionMessageParam] = [
        {"role": "system", "content": "You are a helpful assistant that answers questions using the provided context."},
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