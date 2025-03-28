from fastapi import APIRouter # Importa APIRouter per definire le rotte all'interno di un modulo separato
from app.models.chat_request import ChatRequest # Importa il modello per la richiesta della chat
from app.services.gpt_service import generate_chat_response # Importa la funzione che gestisce la logica della risposta GPT

# Crea un router per definire le rotte relative alla chat
router: APIRouter = APIRouter()

# Definisce l'endpoint POST /chat che riceve un oggetto ChatRequest
# e restituisce una risposta generata dalla funzione GPT
@router.post("/chat")
async def chat(request: ChatRequest):
    return await generate_chat_response(request)