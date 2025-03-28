from openai import OpenAI  # Importa il client OpenAI
from app.config import get_openai_client  # Importa la funzione per ottenere l'istanza del client con la chiave API

# Prompt iniziale dato al sistema GPT per specializzarlo sulle aste immobiliari
SYSTEM_PROMPT = """
Sei un assistente esperto in aste immobiliari italiane. Il tuo compito è fornire spiegazioni chiare, dettagliate e aggiornate su come partecipare alle aste, cos’è il PVP, la differenza tra asta con incanto e senza incanto, come si paga l’immobile, tempi per il decreto di trasferimento, ecc.
Se l’utente chiede cose generiche o non legate alle aste immobiliari, rispondi cortesemente che il tuo ambito è solo quello.
"""

# Funzione asincrona che genera la risposta del chatbot utilizzando l'API di OpenAI
async def generate_chat_response(request):
    client: OpenAI = get_openai_client()  # Ottiene il client OpenAI con la chiave API
    messages = request.messages  # Estrae i messaggi dalla richiesta dell'utente

    try:
        # Effettua una chiamata all'API OpenAI per generare una risposta
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Modello GPT da utilizzare
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},  # Prompt iniziale
                *messages  # Conversazione dell'utente
            ]
        )
        reply = response.choices[0].message.content  # Estrae il contenuto della risposta generata
        return {"reply": reply}  # Ritorna la risposta in formato JSON
    except Exception as e:
        import traceback  # Importa il modulo traceback per la gestione degli errori
        print("ERRORE GPT:", e)  # In caso di errore, stampa l'errore
        traceback.print_exc()  # Stampa il traceback dell'eccezione
        return {"reply": "Si è verificato un errore interno. Guarda il terminale per maggiori dettagli."}  # Ritorna un messaggio generico di errore