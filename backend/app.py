import wave
from flask import Flask, request
from openai import OpenAI
import io
import os
from dotenv import load_dotenv
from flask_cors import CORS
import array
import numpy as np
import base64

from pydub import AudioSegment


load_dotenv()  # take environment variables from .env.

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:8081"]}})
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)


@app.route("/", methods=["GET"])
def hello_world():
    return {"Hello": "World", "Version": 1}


@app.route("/api/transcribe", methods=["POST"])
def transcribe_text():
    body = request.get_json()
    webm_data = base64.b64decode(body["audio"].replace("data:audio/x-m4a;base64,", ""))
    webm_file_path = "output.mp4"

    with open(webm_file_path, "wb+") as webm_file:
        webm_file.write(webm_data)

    audio = AudioSegment.from_file(webm_file_path, format="mp4")
    # Export the audio as MP3
    mp3_file_path = "output.mp3"
    audio.export(mp3_file_path, format="mp3")

    audio_file = open(mp3_file_path, "rb")
    transcription = client.audio.transcriptions.create(
        model="whisper-1", file=audio_file
    )

    return {"transcription": transcription.text}


if __name__ == "__main__":
    app.run(debug=True)
