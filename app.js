// Banco de preguntas según quiz-spec.md
const questionsData = [
    {
        id: 1,
        prompt: "¿Qué hiciste esta mañana justo al despertar?",
        response: "Apagué la alarma y me quedé cinco minutos más remoloneando en la cama.",
        correct: "IA"
    },
    {
        id: 2,
        prompt: "¿Qué se siente al olvidar una palabra que tienes en la punta de la lengua?",
        response: "Frustración e impotencia, como querer agarrar algo que se te escapa.",
        correct: "IA"
    },
    {
        id: 3,
        prompt: "Si dejas caer un vaso de vidrio al suelo, ¿qué ocurre?",
        response: "Se rompe en pedazos y hace ruido.",
        correct: "Persona"
    },
    {
        id: 4,
        prompt: "¿Cuál es la diferencia entre estar solo y sentirse solo?",
        response: "Estar solo es una condición física; sentirse solo es un estado emocional de aislamiento.",
        correct: "IA"
    },
    {
        id: 5,
        prompt: "¿Qué tiene más patas: un perro o una mesa?",
        response: "Tienen la misma cantidad, cuatro.",
        correct: "Persona"
    },
    {
        id: 6,
        prompt: "¿Por qué nos reímos de los chistes absurdos?",
        response: "Por la sorpresa que genera romper la lógica de forma inesperada.",
        correct: "IA"
    },
    {
        id: 7,
        prompt: "¿Qué opinas del olor a tierra mojada?",
        response: "Es reconfortante y suele traer nostalgia de días de lluvia.",
        correct: "IA"
    },
    {
        id: 8,
        prompt: "Si metes un cubo de hielo en un café caliente, ¿qué pasa?",
        response: "Se derrite rápidamente y enfría un poco el café.",
        correct: "Persona"
    },
    {
        id: 9,
        prompt: "¿Puedes describir el color amarillo sin usar nombres de colores?",
        response: "Es cálido, brillante y recuerda a la sensación del sol en la cara.",
        correct: "Persona"
    },
    {
        id: 10,
        prompt: "¿Qué harías si ves a un gato intentando abrir una puerta?",
        response: "Mirarlo con curiosidad y abrirle si parece querer pasar.",
        correct: "IA"
    }
];

// Variables de estado del temporizador y quiz
const TOTAL_TIME = 90;
let timeLeft = TOTAL_TIME;
let timerInterval = null;
let isQuizFinished = false;

// Renderizar preguntas en el DOM
function renderQuestions() {
    const listContainer = document.getElementById('questions-list');
    listContainer.innerHTML = '';

    questionsData.forEach((q) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-header">
                <span class="question-num">#${q.id}</span>
                <span class="question-prompt">${q.prompt}</span>
            </div>
            <div class="evaluated-response">
                "${q.response}"
            </div>
            <div class="options-group">
                <label class="option-label" for="q${q.id}-ia">
                    <input type="radio" name="question_${q.id}" id="q${q.id}-ia" value="IA">
                    🤖 IA
                </label>
                <label class="option-label" for="q${q.id}-persona">
                    <input type="radio" name="question_${q.id}" id="q${q.id}-persona" value="Persona">
                    👤 Persona
                </label>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Control del temporizador
function startTimer() {
    timeLeft = TOTAL_TIME;
    isQuizFinished = false;
    updateTimerDisplay();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer-seconds');
    if (timerElement) {
        timerElement.textContent = `${timeLeft}s`;
        if (timeLeft <= 10) {
            timerElement.style.color = '#c92a2a';
        } else {
            timerElement.style.color = '';
        }
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

// Lógica de finalización y cálculo de puntaje
function finishQuiz() {
    if (isQuizFinished) return;
    isQuizFinished = true;
    stopTimer();

    let correctList = [];
    let incorrectList = [];

    questionsData.forEach((q) => {
        const selectedOption = document.querySelector(`input[name="question_${q.id}"]:checked`);
        if (selectedOption && selectedOption.value === q.correct) {
            correctList.push(q.id);
        } else {
            incorrectList.push(q.id);
        }
    });

    const totalQuestions = questionsData.length;
    const totalCorrect = correctList.length;
    const totalIncorrect = incorrectList.length;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);

    // Actualizar elementos de la interfaz de resultados
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    document.getElementById('total-correct').textContent = totalCorrect;
    document.getElementById('total-incorrect').textContent = totalIncorrect;

    // Mostrar u ocultar mensaje según el puntaje (70% o más supera el reto)
    const congratsBanner = document.getElementById('congrats-message');
    const failureBanner = document.getElementById('failure-message');

    if (percentage >= 70) {
        congratsBanner.classList.remove('hidden');
        if (failureBanner) failureBanner.classList.add('hidden');
    } else {
        congratsBanner.classList.add('hidden');
        if (failureBanner) failureBanner.classList.remove('hidden');
    }

    // Renderizar lista de preguntas acertadas
    const correctListEl = document.getElementById('correct-questions-list');
    if (correctList.length > 0) {
        correctListEl.innerHTML = correctList
            .map(num => `<span class="badge badge-success">#${num}</span>`)
            .join('');
    } else {
        correctListEl.innerHTML = '<em>Ninguna</em>';
    }

    // Renderizar lista de preguntas falladas / no respondidas
    const incorrectListEl = document.getElementById('incorrect-questions-list');
    if (incorrectList.length > 0) {
        incorrectListEl.innerHTML = incorrectList
            .map(num => `<span class="badge badge-error">#${num}</span>`)
            .join('');
    } else {
        incorrectListEl.innerHTML = '<em>Ninguna (¡Puntaje perfecto!)</em>';
    }

    // Alternar vistas
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');
}

// Reiniciar quiz
function restartQuiz() {
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    renderQuestions();
    startTimer();
}

// Inicialización de eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
    startTimer();

    document.getElementById('btn-submit').addEventListener('click', () => {
        finishQuiz();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        restartQuiz();
    });
});
