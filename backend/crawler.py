import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from ddgs import DDGS

def crawl_page(url):
    try:
        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "IDEAOS Research Bot/1.0"
            }
        )

        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        title = soup.title.get_text(strip=True) if soup.title else ""

        # Remove unnecessary webpage elements
        for element in soup(["script", "style", "noscript"]):
            element.decompose()

        # Extract readable text
        text = soup.get_text(" ", strip=True)

        # Keep the response manageable
        text = text[:5000]

        links = []

        for link in soup.find_all("a", href=True):
            full_url = urljoin(url, link["href"])

            if full_url.startswith(("http://", "https://")):
                links.append(full_url)

        return {
            "url": url,
            "title": title,
            "text": text,
            "links": links[:20]
        }

    except Exception as e:
        return {
            "url": url,
            "error": str(e)
        }

def search_web(query, max_results=5):
    results = []

    try:
        # Give the search request more time on Render
        with DDGS(timeout=20) as ddgs:
            search_results = ddgs.text(
                query,
                max_results=max_results,
                backend="google,bing"
            )

            for result in search_results:
                results.append({
                    "title": result.get("title", ""),
                    "url": result.get("href", ""),
                    "description": result.get("body", "")
                })

        return {
            "query": query,
            "results": results
        }

    except Exception as e:
        return {
            "query": query,
            "results": [],
            "error": str(e)
        }
def search_web(query, max_results=5):
    results = []

    try:
        with DDGS(timeout=20) as ddgs:
            search_results = ddgs.text(
                query,
                max_results=max_results,
                backend="auto"
            )

            for result in search_results:
                results.append({
                    "title": result.get("title", ""),
                    "url": result.get("href", ""),
                    "description": result.get("body", "")
                })

        return {
            "query": query,
            "results": results
        }

    except Exception as e:
        return {
            "query": query,
            "results": [],
            "error": f"Search service unavailable: {str(e)}"
        }
def research_web(query, max_results=5):
    search_results = search_web(query, max_results)

    if "error" in search_results:
        return search_results

    research_data = []

    for result in search_results["results"]:
        url = result.get("url", "")

        if not url:
            continue

        page_data = crawl_page(url)

        research_data.append({
            "title": result.get("title", ""),
            "url": url,
            "description": result.get("description", ""),
            "page_title": page_data.get("title", ""),
            "text": page_data.get("text", "")
        })

    return {
        "query": query,
        "results": research_data
    }