// Seleziona il contenitore della chat
const chatBox = document.getElementById("chat-box");

// Inizializza la cronologia della conversazione
let conversationHistory = [];

// Recupera eventuali messaggi salvati nel localStorage e li mostra
const savedMessages = JSON.parse(localStorage.getItem("chatHistory"));
if (Array.isArray(savedMessages) && savedMessages.length > 0) {
  savedMessages.forEach(msg => {
    chatBox.innerHTML += `<div class="message ${msg.sender}">${msg.text}</div>`;
  });
}

// Mostra l'indicatore "sta scrivendo"
function showTypingIndicator() {
  const indicator = document.createElement("div"); // Crea un nuovo elemento div per l'indicatore
  indicator.classList.add("message", "bot", "typing"); // Aggiunge le classi appropriate
  indicator.textContent = "Sta scrivendo"; // Imposta il testo dell'indicatore
  chatBox.appendChild(indicator); // Aggiunge l'indicatore alla chat
  chatBox.scrollTop = chatBox.scrollHeight; // Scorre automaticamente in basso
}

// Rimuove l'indicatore "sta scrivendo"
function removeTypingIndicator() {
  const typing = document.querySelector(".typing"); // Seleziona l'indicatore di scrittura
  if (typing) {
    typing.remove(); // Rimuove l'indicatore se esiste
  }
}

// Funzione per inviare un messaggio al backend
async function sendMessage() {
  const input = document.getElementById("user-input"); // Seleziona il campo di input
  const userMessage = input.value.trim(); // Ottiene il messaggio dell'utente e rimuove gli spazi
  if (!userMessage) return; // Esce se il messaggio è vuoto

  // Aggiunge il messaggio dell'utente alla chat
  chatBox.innerHTML += `<div class="message user">${userMessage}</div>`;
  input.value = ""; // Pulisce il campo di input

  // Scroll automatico in basso
  chatBox.scrollTop = chatBox.scrollHeight;

  // Mostra indicatore "sta scrivendo"
  showTypingIndicator();

  try {
    // Invia la conversazione al backend
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST", // Metodo di invio
      headers: { "Content-Type": "application/json" }, // Imposta l'intestazione per JSON
      body: JSON.stringify({
        messages: [
          ...conversationHistory, // Invia la cronologia della conversazione
          { role: "user", content: userMessage } // Aggiunge il messaggio dell'utente
        ]
      })
    });

    // Riceve la risposta del bot
    const data = await res.json(); // Converte la risposta in JSON
    const botMessage = data.reply; // Estrae il messaggio del bot

    // Aggiorna la cronologia
    conversationHistory.push({ role: "user", content: userMessage }); // Aggiunge il messaggio dell'utente alla cronologia
    conversationHistory.push({ role: "assistant", content: botMessage }); // Aggiunge il messaggio del bot alla cronologia

    // Rimuove l'indicatore e mostra la risposta animata
    removeTypingIndicator();
    typeBotReply(botMessage); // Mostra la risposta del bot
  } catch (err) {
    removeTypingIndicator(); // Rimuove l'indicatore in caso di errore
    chatBox.innerHTML += `<div class="message bot">Errore nella richiesta. Controlla che il backend sia attivo.</div>`; // Mostra un messaggio di errore
  }
}

// Permette l'invio del messaggio premendo Invio (senza Shift)
document.getElementById("user-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) { // Controlla se il tasto premuto è "Enter" senza Shift
    event.preventDefault(); // Evita l'invio del form o nuova riga
    sendMessage(); // Invia il messaggio
  }
});

// Mostra la risposta del bot una lettera alla volta
function typeBotReply(text) {
  const botMessage = document.createElement("div"); // Crea un nuovo elemento div per il messaggio del bot
  botMessage.classList.add("message", "bot"); // Aggiunge le classi appropriate
  chatBox.appendChild(botMessage); // Aggiunge il messaggio alla chat

  let index = 0; // Indice per il carattere corrente
  const speed = 40; // Ritmo di scrittura (ms per lettera)

  // Funzione per scrivere un carattere alla volta
  function typeChar() {
    if (index < text.length) { // Controlla se ci sono caratteri da scrivere
      botMessage.textContent += text.charAt(index); // Aggiunge il carattere corrente al messaggio
      index++; // Incrementa l'indice
      setTimeout(typeChar, speed); // Chiama la funzione dopo un certo intervallo
    } else {
      updateChatHistory("bot", text); // Aggiorna la cronologia della chat
      chatBox.scrollTop = chatBox.scrollHeight; // Scorre in basso
    }
  }

  typeChar(); // Inizia a scrivere la risposta
}

// Cancella la cronologia della chat
function clearChatHistory() {
  const confirmClear = confirm("Sei sicuro di voler cancellare la cronologia?"); // Chiede conferma all'utente
  if (confirmClear) { // Se l'utente conferma
    localStorage.removeItem("chatHistory"); // Rimuove la cronologia dal localStorage
    chatBox.innerHTML = ''; // Pulisce la chat

    // Mostra un messaggio temporaneo di conferma
    const notification = document.createElement("div"); // Crea un nuovo elemento div per la notifica
    notification.textContent = "✅ Cronologia cancellata"; // Imposta il testo della notifica
    notification.classList.add("notification"); // Aggiunge la classe per la notifica
    document.body.appendChild(notification); // Aggiunge la notifica al corpo del documento

    setTimeout(() => {
      notification.remove(); // Rimuove la notifica dopo 2 secondi
    }, 2000);
  }
}