import os # Importa il modulo os per accedere alle variabili di ambiente
from dotenv import load_dotenv # Importa load_dotenv per caricare automaticamente le variabili dal file .env
from openai import OpenAI # Importa il client OpenAI

# Carica le variabili d'ambiente definite nel file .env
load_dotenv()

# Funzione per ottenere un'istanza del client OpenAI usando la chiave API dall'ambiente
def get_openai_client() -> OpenAI:
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))