const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'fr-TN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let isRecognizing = false;

function startVoiceInput(inputId) {
    if (isRecognizing) {
        console.log("Déjà en écoute...");
        return;
    }

    const inputElement = document.getElementById(inputId);
    inputElement.focus();
    inputElement.value = '';

    let instructionText = '';
    if (inputId === 'email') {
        instructionText = 'Veuillez dire votre adresse email.';
    } else if (inputId === 'password') {
        instructionText = 'Veuillez dire votre mot de passe.';
    }

    speakText(instructionText, function() {
        recognition.start();
        isRecognizing = true;
        console.log(`Reconnaissance vocale démarrée pour ${inputId}`);
        toggleButtonState(inputId, true);
    });
}

function speakText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'fr-TN';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = function() {
        console.log('Parole terminée');
        callback();
    };

    window.speechSynthesis.speak(speech);
    console.log(`Parole : ${text}`);
}

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const focusedElement = document.activeElement;

    console.log(`Résultat de la reconnaissance : ${transcript}`);

    if (!transcript.trim()) {
        console.log("Aucune parole valide détectée");
        return;
    }

    const cleanedTranscript = transcript.replace(/\s+/g, '');

    if (focusedElement.tagName.toLowerCase() === 'input') {
        if (focusedElement.id === 'email') {
            focusedElement.value = cleanedTranscript + '@gmail.com';
        } else {
            focusedElement.value = cleanedTranscript;
        }
        console.log(`Champ ${focusedElement.id} rempli avec : ${focusedElement.value}`);
    }
};

recognition.onend = function() {
    console.log('Reconnaissance vocale terminée');
    isRecognizing = false;

    const activeInputId = document.activeElement.id;
    toggleButtonState(activeInputId, false);
};

recognition.onerror = function(event) {
    console.error('Erreur de reconnaissance vocale : ', event.error);
};

function toggleButtonState(inputId, disable) {
    const button = document.querySelector(`#${inputId}-button`);
    if (button) {
        button.disabled = disable;
        console.log(disable ? "Bouton désactivé" : "Bouton activé");
    } else {
        console.error(`Bouton avec l'ID ${inputId}-button non trouvé !`);
    }
}



document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("loggedInEmail", email); // Corrected here
            document.getElementById("message").textContent = "Connexion réussie !";

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } else {
            document.getElementById("message").textContent = "Identifiant ou mot de passe incorrect !";
        }
    } else {
        document.getElementById("message").textContent = "Veuillez remplir les champs !";
    }
});
