import os
import json

from fastapi import FastAPI
from crawler import crawl_page, research_web
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from datetime import datetime


# Load environment variables
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
SAVED_IDEAS_FILE = BASE_DIR / "saved_ideas.json"

# Create FastAPI app
app = FastAPI()


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# OpenAI client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing. Check backend/.env")

client = Groq(api_key=GROQ_API_KEY)

# =========================
# DATA MODELS
# =========================

class IdeaRequest(BaseModel):
    idea: str


class SaveIdeaRequest(BaseModel):

    idea: str
    target_users: str = ""
    problem: str = ""
    solution: str = ""
    core_product: str = ""
    business_model: str = ""
    key_features: str = ""
    marketing: str = ""
    risks: str = ""
    next_step: str = ""

    version: int = 1

    evolution: list = None

    idea_id: str = ""

    category: str = "Other"

    created_at: str = ""

    updated_at: str = ""


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "IDEAOS AI backend is running 🚀"
    }



# =========================
# BUILD IDEA
# =========================

@app.post("/build")
def build_idea(request: IdeaRequest):

    prompt = f"""
You are the AI engine of IDEAOS.

The user gives you one startup/product idea.

Analyze this idea and create a practical business blueprint.

USER IDEA:
{request.idea}

Return ONLY valid JSON with exactly these fields:

{{
    "idea": "...",
    "target_users": "...",
    "problem": "...",
    "solution": "...",
    "core_product": "...",
    "business_model": "...",
    "key_features": "...",
    "marketing": "...",
    "risks": "...",
    "next_step": "...",
    "category": "..."
}}

Keep every field useful, specific to the user's idea,
and easy for a beginner to understand.

Choose the most suitable category from:
AI, E-commerce, Fitness, Education, Space, Other.
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You are the AI engine of IDEAOS."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

    except Exception:
        return {
            "error": "IDEAOS could not generate your idea right now. Please try again in a few seconds."
        }

    result_text = response.choices[0].message.content.strip()

    if result_text.startswith("```"):
        result_text = result_text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(result_text)

    except json.JSONDecodeError:
        result = {
            "idea": request.idea,
            "target_users": result_text,
            "problem": "AI returned an unexpected format.",
            "solution": "",
            "core_product": "",
            "business_model": "",
            "key_features": "",
            "marketing": "",
            "risks": "",
            "next_step": "Try generating the blueprint again.",
            "category": "Other"
        }

    return result
# =========================
# IMPROVE IDEA
# =========================

@app.post("/improve")
def improve_idea(request: IdeaRequest):

    prompt = f"""
You are the AI improvement engine of IDEAOS.

Take the user's startup/product idea and improve it.

CURRENT IDEA:
{request.idea}

Create a stronger, more practical version of the idea.

Return ONLY valid JSON with exactly these fields:

{{
    "improved_idea": "...",
    "why_better": "...",
    "new_features": "...",
    "target_users": "...",
    "next_step": "..."
}}

Keep the answer specific and easy to understand.
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You are the AI improvement engine of IDEAOS."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

    except Exception:
        return {
            "error": "IDEAOS could not improve your idea right now. Please try again in a few seconds."
        }

    result_text = response.choices[0].message.content.strip()

    if result_text.startswith("```"):
        result_text = result_text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(result_text)

    except json.JSONDecodeError:
        result = {
            "improved_idea": result_text,
            "why_better": "",
            "new_features": "",
            "target_users": "",
            "next_step": ""
        }

    return result


# =========================
# SAVE IDEA
# =========================

@app.post("/save")
def save_idea(request: SaveIdeaRequest):

    file_path = SAVED_IDEAS_FILE

    # Load existing ideas
    try:
        if os.path.exists(file_path) and os.path.getsize(file_path) > 0:

            with open(file_path, "r", encoding="utf-8") as file:
                ideas = json.load(file)

            if not isinstance(ideas, list):
                ideas = []

        else:
            ideas = []

    except (json.JSONDecodeError, OSError):
        ideas = []

    # Check if this idea already exists
    existing_index = None
    existing_created_at = None

    for index, item in enumerate(ideas):

        if item.get("idea_id") == request.idea_id:

            existing_index = index
            existing_created_at = item.get("created_at")

            break

    # Current timestamp
    now = datetime.now().isoformat()

    # Updated idea data
    updated_idea = {
        "idea_id": request.idea_id,
        "idea": request.idea,

        "target_users": request.target_users,
        "problem": request.problem,
        "solution": request.solution,
        "core_product": request.core_product,
        "business_model": request.business_model,
        "key_features": request.key_features,
        "marketing": request.marketing,
        "risks": request.risks,
        "next_step": request.next_step,

        "version": request.version,
        "evolution": request.evolution,
        "category": request.category,

        "created_at": existing_created_at or request.created_at or now,
        "updated_at": now
    }

    # Update existing idea
    if existing_index is not None:

        ideas[existing_index] = updated_idea

        message = "Idea updated successfully!"

    # Save new idea
    else:

        ideas.append(updated_idea)

        message = "Idea saved successfully!"

    # Write ideas to file
    try:

        with open(file_path, "w", encoding="utf-8") as file:

            json.dump(
                ideas,
                file,
                indent=4,
                ensure_ascii=False
            )

    except OSError:

        return {
            "error": "IDEAOS could not save your idea right now. Please try again."
        }

    return {
        "message": message
    }

# =========================
# GET SAVED IDEAS
# =========================

@app.get("/ideas")
def get_ideas():

    file_path = SAVED_IDEAS_FILE

    if not os.path.exists(file_path):
        return []

    try:

        with open(file_path, "r", encoding="utf-8") as file:
            ideas = json.load(file)

        if not isinstance(ideas, list):
            return []

        return ideas

    except (json.JSONDecodeError, OSError):

        return []


# =========================
# DELETE IDEA
# =========================

# =========================
# DELETE IDEA
# =========================

@app.delete("/ideas/{idea_index}")
def delete_idea(idea_index: int):

    file_path = SAVED_IDEAS_FILE

    if not os.path.exists(file_path):
        return {
            "error": "No saved ideas found."
        }

    # Load saved ideas
    try:

        with open(file_path, "r", encoding="utf-8") as file:
            ideas = json.load(file)

        if not isinstance(ideas, list):
            ideas = []

    except (json.JSONDecodeError, OSError):

        return {
            "error": "Saved ideas file could not be read."
        }

    # Check index
    if idea_index < 0 or idea_index >= len(ideas):

        return {
            "error": "Idea not found."
        }

    # Delete idea
    ideas.pop(idea_index)

    # Save updated list
    try:

        with open(file_path, "w", encoding="utf-8") as file:

            json.dump(
                ideas,
                file,
                indent=4,
                ensure_ascii=False
            )

    except OSError:

        return {
            "error": "IDEAOS could not delete the idea right now."
        }

    return {
        "message": "Idea deleted successfully!"
    }

# =========================
# WEB CRAWLER
# =========================

@app.get("/crawl")
def crawl(url: str):

    try:
        return crawl_page(url)

    except Exception:
        return {
            "error": "IDEAOS could not access that webpage right now."
        }
    
# =========================
# WEB RESEARCH
# =========================

@app.get("/research")
def research(query: str = Query(..., min_length=2)):

    try:
        return research_web(query, max_results=5)

    except Exception:
        return {
            "error": "IDEAOS could not perform web research right now. Please try again."
        }
    
# =========================
# ANALYZE RESEARCH
# =========================

@app.post("/analyze-research")
def analyze_research(data: dict):

    research = data.get("research", [])

    if not research:
        return {
            "error": "No research data provided."
        }

    research_text = ""

    for item in research:

        research_text += f"""
SOURCE TITLE: {item.get("title", "")}
URL: {item.get("url", "")}
DESCRIPTION: {item.get("description", "")}
PAGE CONTENT: {item.get("text", "")[:1200]}

-------------------------
"""

    prompt = f"""
You are the research analyst for IDEAOS.

Analyze the following web research about a startup/product idea.

Return ONLY valid JSON with these fields:

competitors
existing_features
market_opportunities
problems_and_gaps
differentiation
recommendations

Each field should contain useful information based on the provided research.

WEB RESEARCH:
{research_text}
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert startup research analyst."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={
                "type": "json_object"
            },
            max_tokens=1200
        )

        result_text = response.choices[0].message.content.strip()

        try:
            result = json.loads(result_text)

        except json.JSONDecodeError:

            return {
                "error": "Research analysis returned an unexpected format."
            }

        return result

    except Exception:

        return {
            "error": "IDEAOS could not analyze the research right now. Please try again."
        }

# =========================
# FULL RESEARCH
# =========================

@app.post("/full-research")
def full_research(data: dict):

    query = data.get("query", "").strip()

    if not query:
        return {
            "error": "Query is required."
        }

    # Step 1: Search and crawl the web
    try:

        web_research = research_web(query, max_results=3)

    except Exception:

        return {
            "query": query,
            "error": "IDEAOS could not perform web research right now. Please try again."
        }

    if "error" in web_research:
        return web_research

    if not web_research.get("results"):

        return {
            "query": query,
            "error": "No web research results found."
        }

    # Step 2: Prepare research for AI
    research = web_research["results"]

    research_text = ""

    for item in research:

        research_text += f"""
SOURCE TITLE: {item.get("title", "")}
URL: {item.get("url", "")}
DESCRIPTION: {item.get("description", "")}
PAGE CONTENT: {item.get("text", "")[:3000]}

-------------------------
"""

    prompt = f"""
You are the research analyst for IDEAOS.

Analyze the following web research about this startup/product idea:

{query}

Use ONLY the information available in the research below.
Clearly distinguish evidence from reasonable suggestions.
Do not invent competitor facts, prices, statistics, or market sizes.

Return ONLY valid JSON.

The JSON must contain exactly these fields:

competitors
existing_features
market_opportunities
problems_and_gaps
differentiation
recommendations

IMPORTANT JSON RULES:
- Use normal JSON syntax only.
- Do NOT use Markdown.
- Do NOT use code fences.
- Do NOT put Markdown links inside strings.
- URLs must be plain text such as "https://example.com".
- Use double quotes for JSON keys and string values.
- Do not include comments.
- Do not include any text before or after the JSON.

WEB RESEARCH:
{research_text}
"""

    # Step 3: Analyze research with AI
    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert startup research analyst."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={
                "type": "json_object"
            }
        )

    except Exception:

        return {
            "query": query,
            "error": "IDEAOS could not analyze the research right now. Please try again."
        }

    # Step 4: Parse AI response
    result_text = response.choices[0].message.content.strip()

    try:

        analysis = json.loads(result_text)

    except json.JSONDecodeError:

        return {
            "query": query,
            "sources": research,
            "error": "Research analysis returned an unexpected format."
        }

    # Step 5: Return final research
    return {
        "query": query,
        "sources": research,
        "analysis": analysis
    }
# =========================
# IMPROVE WITH RESEARCH
# =========================

@app.post("/improve-with-research")
def improve_with_research(data: dict):

    idea = data.get("idea", "").strip()
    research = data.get("research", {})

    if not idea:
        return {
            "error": "Idea is required."
        }

    if not research:
        return {
            "error": "Research data is required."
        }

    research_text = json.dumps(
        research,
        indent=2,
        ensure_ascii=False
    )

    prompt = f"""
You are the product strategist for IDEAOS.

The user's original startup/product idea is:

{idea}

The following web research was performed on this idea:

{research_text}

Use the research to improve the original idea.

Important rules:
- Keep the core purpose of the original idea.
- Use competitor weaknesses and market gaps to identify improvements.
- Do not invent market statistics or competitor facts.
- Clearly make the improved idea more differentiated.
- Make the result practical enough to build as an MVP.

Return ONLY valid JSON with these fields:

improved_idea
why_better
new_features
target_users
unique_advantage
mvp_plan
next_step
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert startup product strategist."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={
                "type": "json_object"
            }
        )

    except Exception:

        return {
            "error": "IDEAOS could not improve your idea using the research right now. Please try again."
        }

    improvement_text = response.choices[0].message.content.strip()

    try:

        improvement = json.loads(improvement_text)

    except json.JSONDecodeError:

        return {
            "error": "Research improvement returned an unexpected format."
        }

    return {
        "idea": idea,
        "improvement": improvement
    }