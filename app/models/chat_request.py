# Importa BaseModel da Pydantic per definire un modello di dati
from pydantic import BaseModel

# Definisce un modello per la richiesta della chat
# Il campo 'messages' è una lista di dizionari che rappresentano i messaggi della conversazione
# Ogni messaggio dovrebbe avere una struttura simile a: {"role": "user" | "assistant", "content": "testo"}
class ChatRequest(BaseModel):
    messages: list[dict]