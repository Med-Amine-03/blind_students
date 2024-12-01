const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'fr-FR'; 
recognition.interimResults = false;
recognition.maxAlternatives = 1;


let isRecognizing = false;

function startVoiceInput(inputId) {
    if (isRecognizing) {
        console.log("Déjà en train d'écouter...");
        return;
    }

    const inputElement = document.getElementById(inputId);
    inputElement.focus();
    inputElement.value = ''; 

    let instructionText = '';
    if (inputId === 'name') {
        instructionText = 'Veuillez dire votre nom d\'utilisateur.';
    } else if (inputId === 'email') {
        instructionText = 'Veuillez dire votre adresse email.';
    } else if (inputId === 'password') {
        instructionText = 'Veuillez dire votre mot de passe.';
    }

    speakText(instructionText, function() {
        recognition.start();
        isRecognizing = true;
        console.log(`La reconnaissance vocale a commencé pour ${inputId}`);

        toggleButtonState(inputId, true);
    });
}

function speakText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'fr-FR';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = function() {
        callback();
    };

    window.speechSynthesis.speak(speech);
    console.log(`En train de parler: ${text}`);
}

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const focusedElement = document.activeElement;

    console.log(`Résultat de la reconnaissance: ${transcript}`);

    if(!transcript.trim()){
        console.log('Pas de texte reconnu');
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
    console.log('La reconnaissance vocale est terminée');
    isRecognizing = false;

    const activeInputId = document.activeElement.id;
    toggleButtonState(activeInputId, false);
};

recognition.onerror = function(event) {
    console.error('Erreur lors de la reconnaissance vocale: ', event.error);
}

function toggleButtonState(inputId, disable) {
    const button = document.querySelector(`#${inputId}-button`);
    if (button) {
        button.disabled = disable;
        console.log(disable ? "Button disabled" : "Button enabled");
    } else {
        console.error(`Button with ID ${inputId}-button not found!`);
    }
}


document.getElementById("registerForm");addEventListener('submit',function(e){
    e.preventDefault();

    const name =document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profileImage = document.getElementById('profileImage').files[0];


    if(name && email && password && profileImage){
        const reader =new FileReader();

        reader.onloadend= function(){
            const imageBases64 = reader.result;

            const storedUsers =JSON.parse(localStorage.getItem('users')) || [];

            const usersExists = storedUsers.some(user => user.email === email);
            if (usersExists){
                document.getElementById("message").textContent ="L'utilisateur existe déjà !";
                return;
            }

            const newUser ={name ,email, password ,profileImage:imageBases64};
            storedUsers.push(newUser);

            localStorage.setItem('users',JSON.stringify(storedUsers));
            document.getElementById("message").textContent ="L'utilisateur a été ajouté avec succès !";

            setTimeout(()=>{
                window.location.href = "Login.html";
            },2000);
        };
        reader.readAsDataURL(profileImage);
    }
    else{
        document.getElementById("message").textContent ="Veuillez remplir tous les champs !";
    }
})