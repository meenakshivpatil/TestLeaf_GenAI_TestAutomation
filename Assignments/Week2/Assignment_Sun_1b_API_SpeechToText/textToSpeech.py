import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

speech_file_path = "speech.wav" 
model = "playai-tts"
voice = "Gail-PlayAI"
text = "I am working on TestLeaf Assignment week2 speech to text via Groq API"
response_format = "wav"

response = client.audio.speech.create(
    model=model,
    voice=voice,
    input=text,
    response_format=response_format
)

response.write_to_file(speech_file_path)