from flask import Flask, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from openai import OpenAI
import json
import io

cred = credentials.Certificate("./serviceAccount.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

client = OpenAI()
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

@app.route('/chat', methods=['POST'])
def infer_function():
    data = request.get_json()
    uid = data.get('uid')
    
    user_ref = db.collection("user-data").document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return {"error": "User not found for the given UID"}, 404
    
    user = user_doc.to_dict()
    assistant_id = user['assistant_id']

    thread = client.beta.threads.create(
      messages=[
          {
            "role": "user",
            "content": "Who is my roommate?",
          }
      ]
    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id, assistant_id=assistant_id
    )

    messages = list(client.beta.threads.messages.list(thread_id=thread.id, run_id=run.id))

    message_content = messages[0].content[0].text.value

    print(message_content)

    return {'message' : message_content}

@app.route('/add_file', methods=['POST'])
def add_file():
    
    data = request.get_json()

    text = data.get('text')
    location = data.get('location')
    timestamp = data.get('timestamp')
    uid = data.get('uid')

    user_ref = db.collection("user-data").document(uid).get().to_dict()

    cats = user_ref['categories']

    file_data = {
      'location': location,
      'timestamp': timestamp,
      'data': text
    }

    # Ready the file data for upload to OpenAI as a JSON stream

    file_streams = [io.BytesIO(json.dumps(file_data).encode('utf-8'))]

    with open("test.json", "w") as json_file:
      # Step 4: Use json.dump to write the dictionary to the file
      json.dump(data, json_file, indent=4)

    file_paths = ["./test.json"]
    file_streams = [open(path, "rb") for path in file_paths]
    
    # Use the upload and poll SDK helper to upload the files, add them to the vector store,
    # and poll the status of the file batch for completion.
    file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
      vector_store_id=user_ref['vs_id'], files=file_streams
    )

    print(file_batch)

    tasks = create_tasks(text, cats)

    for task in tasks['tasks']:
      task['user'] = uid
      task['complete'] = False
      update_time, task_ref = db.collection("todo-items").add(task)

    return {'message' : 'succesfully added file'}

@app.route('/register_user', methods=['POST'])
def add_user():
    data = request.get_json()
    uid = data.get('uid')

    user_ref = db.collection("user-data").document(uid)

    vector_store = client.beta.vector_stores.create(
      name=uid,
    )

    assistant_general = client.beta.assistants.create(
      instructions="You are an all knowing personal assistant (very similar to tony stark's jarvis). You have access to all the conversations the user has with other people and some other data. Use that data to be as useful as possible to the user.",
      name=uid,
      tools=[{"type": "file_search"}],
      model="gpt-4-turbo"
    )

    assistant_general = client.beta.assistants.update(
      assistant_id=assistant_general.id,
      tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
    )

    user_ref.set({"vs_id": vector_store.id, "assistant_id" : assistant_general.id, "categories" : ["Other"]}, merge=True)

    return {
        "message" : "user succesfully registered"
    }


def create_tasks(text : str, categories):
    completion = client.chat.completions.create(
      model="gpt-4o",
      response_format={ "type": "json_object" },
      messages=[
        {"role": "system", "content": f"Your job is to take text which are real conversations from users and make tasks out of them that the user might need to complete. Make sure to return no tasks if there are none. All your responses should be JSON only return the list of tasks in the field 'tasks'. Also categorize tasks into one of the following categories : " + ', '.join(categories) + """. Format data like so : {"tasks" : [{"task" : "the task here", "category" : "category here"}]}"""},
        {"role": "user", "content": text}
      ]
    )

    print(completion.choices[0].message.content)

    # Parse the JSON content from the completion message
    tasks_json = json.loads(completion.choices[0].message.content)

    return tasks_json
    

    # print(completion)

if __name__ == '__main__':
    app.run(debug=True)

    # create_tasks("""""", ['House', 'Other'])
