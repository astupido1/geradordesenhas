let passwordHistory = [];

function generatePassword() {
    let length = parseInt(document.getElementById('length').value);
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    // Bloqueia comprimento maior que 20
    if (length > 20) {
        length = 20;
        document.getElementById('length').value = 20;
    }

    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (uppercase) chars += upperChars;
    if (lowercase) chars += lowerChars;
    if (numbers) chars += numberChars;
    if (symbols) chars += symbolChars;

    if (chars === '') {
        alert('Selecione pelo menos uma opção!');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    const passwordElement = document.getElementById('password');
    passwordElement.textContent = ''; // Limpa o conteúdo anterior
    
    // Efeito de digitação
    let index = 0;
    const typingInterval = setInterval(() => {
        if (index < password.length) {
            passwordElement.textContent += password[index];
            index++;
        } else {
            clearInterval(typingInterval);
            updateStrengthMeter(password);
            addToHistory(password);
        }
    }, 50);
}

// Adiciona senha ao histórico
function addToHistory(password) {
    passwordHistory.unshift(password);
    if (passwordHistory.length > 5) passwordHistory.pop();

    const historyList = document.getElementById('password-history');
    historyList.innerHTML = '';
    passwordHistory.forEach(pwd => {
        const li = document.createElement('li');
        li.textContent = pwd;
        historyList.appendChild(li);
    });
}

function updateStrengthMeter(password) {
    const meter = document.getElementById('strength-fill');
    let strength = 0;
    
    if (password.length >= 12) strength += 30;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) strength += 10;

    meter.style.width = `${strength}%`;
    if (strength < 40) meter.style.background = '#ff4d4d';
    else if (strength < 70) meter.style.background = '#ffa500';
    else meter.style.background = '#4b0082';
}

function copyPassword() {
    const password = document.getElementById('password').textContent;
    navigator.clipboard.writeText(password);
    alert('Senha copiada para a área de transferência! 📋');
}

// Salva o histórico como arquivo de texto
function saveHistory() {
    if (passwordHistory.length === 0) {
        alert('Nenhuma senha no histórico para salvar! 🚫');
        return;
    }

    const text = passwordHistory.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico_senhas.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Bloqueia entrada manual acima de 20
document.getElementById('length').addEventListener('input', function() {
    if (this.value > 20) {
        this.value = 20;
    }
});