const answers = {
    positive: [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Yes",
        "Signs point to yes"
    ],
    neutral: [
        "Reply hazy, try again",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again"
    ],
    negative: [
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful"
    ]
};

let isAnimating = false;
let questionHistory = [];
let stats = {
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0
};

function getRandomAnswer() {
    const allAnswers = [...answers.positive, ...answers.neutral, ...answers.negative];
    const randomIndex = Math.floor(Math.random() * allAnswers.length);
    return allAnswers[randomIndex];
}

function getAnswerWithType() {
    const rand = Math.random();
    let type, answer;

    if (rand < 0.4) {
        type = 'positive';
        answer = answers.positive[Math.floor(Math.random() * answers.positive.length)];
    } else if (rand < 0.75) {
        type = 'negative';
        answer = answers.negative[Math.floor(Math.random() * answers.negative.length)];
    } else {
        type = 'neutral';
        answer = answers.neutral[Math.floor(Math.random() * answers.neutral.length)];
    }
    return { answer, type };
}

function validateQuestion(question) {
    if (!question || question.trim() === '') {
        return { isValid: false, message: "Please ask a question first!" };
    }
    if (question.length < 3) {
        return { isValid: false, message: "Please ask a longer question!" };
    }
    return { isValid: true, message: "" };
}

function formatQuestionText(question) {
    return question.charAt(0).toUpperCase() + question.slice(1).toLowerCase();
}

function getResponse(question) {
    const validation = validateQuestion(question);
    if (!validation.isValid) {
        return { 
            question: "", 
            answer: validation.message, 
            type: "error" 
        };
    }
    
    const formattedQuestion = formatQuestionText(question);
    const { answer, type } = getAnswerWithType();
    
    return { 
        question: formattedQuestion, 
        answer: answer, 
        type: type 
    };
}

function updateStats(type) {
    stats.total++;

    if (type === 'positive') {
        stats.positive++;
    } else if (type === 'negative') {
        stats.negative++;
    } else if (type === 'neutral') {
        stats.neutral++;
    }
    
    document.getElementById('totalQuestions').textContent = stats.total;
    document.getElementById('positiveAnswers').textContent = stats.positive;
    document.getElementById('negativeAnswers').textContent = stats.negative;
}

function addToHistory(question, answer, type) {
    questionHistory.unshift({ question, answer, type, timestamp: new Date() });
    if (questionHistory.length > 10) {
        questionHistory.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    questionHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'historyItem';
        
        const questionEl = document.createElement('div');
        questionEl.className = 'historyQuestion';
        questionEl.textContent = item.question;

        const answerEl = document.createElement('div');
        answerEl.className = 'historyAnswer';
        answerEl.textContent = item.answer;

        historyItem.appendChild(questionEl);
        historyItem.appendChild(answerEl);
        historyList.appendChild(historyItem);
    });
}

function triggerShakeAnimation(element) {
    element.classList.add('shake');
    isAnimating = true;
    
    setTimeout(() => {
        element.classList.remove('shake');
        isAnimating = false;
    }, 1500);
}

function showAnswer(element, answer, type) {
    element.classList.add('hidden');
    element.textContent = answer;

    if (type === 'positive') {
        element.style.color = '#4ade80';
    } else if (type === 'negative') {
        element.style.color = '#f87171';
    } else if (type === 'neutral') {
        element.style.color = '#60a5fa';
    } else {
        element.style.color = 'white';
    }
    
    setTimeout(() => {
        element.classList.remove('hidden');
    }, 500);
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;

        particlesContainer.appendChild(particle);
    }
}

function handleShake() {
    if (isAnimating) return;

    const magic8Ball = document.getElementById('magic8Ball');
    const answerElement = document.getElementById('answer');
    const questionInput = document.getElementById('questionInput');

    const question = questionInput.value;
    const response = getResponse(question);
    
    triggerShakeAnimation(magic8Ball);

    setTimeout(() => {
        showAnswer(answerElement, response.answer, response.type);
        if (response.type !== 'error') {
            addToHistory(response.question, response.answer, response.type);
            updateStats(response.type);
        }
    }, 1000);

    if (response.type !== 'error') {
        questionInput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const shakeButton = document.getElementById('shakeButton');
    const magic8Ball = document.getElementById('magic8Ball');
    const questionInput = document.getElementById('questionInput');

    shakeButton.addEventListener('click', handleShake);
    magic8Ball.addEventListener('click', handleShake);
    
    questionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleShake();
        }
    });
    
    questionInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 0 2px var(--primary), 0 10px 30px rgba(0, 0, 0, 0.5)';
    });
    
    questionInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    });
    
    createParticles();
    console.log("Magic 8-Ball initialized. Ready for Questions!");
});