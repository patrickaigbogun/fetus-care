from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import json

app = FastAPI()

OLLAMA_API_URL = "http://localhost:11434/api/generate"


class RequestPayload(BaseModel):
    prompt: str
    model: str = "meditron:7b"


@app.post("/generate/")
async def generate_text(payload: RequestPayload):
    try:
        response = requests.post(
            OLLAMA_API_URL,
            json={"model": payload.model, "prompt": payload.prompt},
            stream=True,
        )
        response.raise_for_status()

        def stream_response():
            buffer = ""
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode("utf-8")
                    buffer += decoded_line
                    try:
                        # Try to parse complete JSON
                        data = json.loads(buffer)
                        yield data.get("response", "")
                        buffer = ""  # Clear buffer after successfully parsing
                    except json.JSONDecodeError:
                        # Wait until full JSON object is received
                        continue

        return StreamingResponse(stream_response(), media_type="text/plain")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Ollama API error: {str(e)}")
