# Importa FastAPI e middleware CORS per gestire le richieste cross-origin
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router

# Istanzia l'applicazione FastAPI
app: FastAPI = FastAPI()

# Aggiunge il middleware CORS per permettere richieste da qualunque origine (utile per frontend separati)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permette richieste da tutti i domini
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include le rotte definite nel modulo app.routes.chat
app.include_router(chat_router)

# Avvio dell'applicazione con: uvicorn app.main:app --reload