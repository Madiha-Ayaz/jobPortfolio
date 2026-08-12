# backend.py
import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Initialization ---
app = Flask(__name__)

# IMPORTANT: Enable CORS for requests from your frontend
# Replace "http://localhost:3000" with your actual frontend URL in production
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# --- API Key Configuration ---
# Load environment variables from .env and .env.local if present so the
# developer can keep keys in a local file during development.
import pathlib

# Use absolute path to .env and .env.local
env_path = pathlib.Path(__file__).parent / ".env"
env_local_path = pathlib.Path(__file__).parent / ".env.local"

print(f"Looking for .env at: {env_path}")
print(f".env exists: {env_path.exists()}")
print(f"Looking for .env.local at: {env_local_path}")
print(f".env.local exists: {env_local_path.exists()}")

# Load .env first (base config)
# if env_path.exists():
#     load_dotenv(env_path, override=True)
#     print("[OK] Loaded .env")

# Then load .env.local (overrides .env)
if env_local_path.exists():
    load_dotenv(env_local_path, override=True)
    print("[OK] Loaded .env.local")
else:
    print("[WARN] .env.local not found")

# The backend expects `GOOGLE_API_KEY`, but some projects store the key under
# `NEXT_PUBLIC_GEMINI_API_KEY` (used by the frontend). Accept either.
api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("NEXT_PUBLIC_GEMINI_API_KEY")

# Debug: Print full key to see what was loaded
print(f"[DEBUG] Full API Key: {api_key}")
print(f"[DEBUG] Key length: {len(api_key) if api_key else 0}")
print(f"API Key loaded: {api_key[:20] if api_key else 'NONE'}...")

if not api_key:
    print("FATAL: GOOGLE_API_KEY (or NEXT_PUBLIC_GEMINI_API_KEY) environment variable not set.")
    print("Please set the key in your environment or add it to .env/.env.local and try again.")
    exit()

try:
    genai.configure(api_key=api_key)
    print(f"[OK] Gemini API configured with key: {api_key[:20]}...")
except Exception as e:
    print("[ERROR] Failed to configure google generative ai client:", e)
    exit()


# --- Gemini Model Configuration ---
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-latest",
    generation_config=generation_config,
    safety_settings=safety_settings,
)


# --- API Routes ---
@app.route("/test", methods=["GET"])
def test():
    """Test if Gemini API is working"""
    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash-latest")
        result = model.generate_content("Say 'Hello' in one word")
        return jsonify({"status": "✓ Gemini API is working!", "response": result.text})
    except Exception as e:
        return jsonify({"status": "❌ Gemini API error", "error": str(e)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    """
    Handles chat requests from the frontend.
    Expects a JSON payload with a "message" key.
    """
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' in request body."}), 400

    user_message = data["message"]

    try:
        # Start a chat session and send the message
        convo = model.start_chat(history=[])
        convo.send_message(user_message)
        
        # Get the model's response
        # Note: Gemini may return a multi-part response. We'll join them.
        bot_response = "".join(part.text for part in convo.last.parts)

        return jsonify({"reply": bot_response})

    except Exception as e:
        error_msg = str(e)
        print(f"❌ Chat Error: {error_msg}")
        import traceback
        traceback.print_exc()
        # Return the full error for debugging (remove in production)
        return jsonify({"error": f"Gemini API Error: {error_msg}"}), 500


# --- Main Execution ---
if __name__ == "__main__":
    # Note: Flask's default development server is not for production.
    # Use a production-ready WSGI server like Gunicorn or Waitress.
    app.run(debug=True, port=5000)

