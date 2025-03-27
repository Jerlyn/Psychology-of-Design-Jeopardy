document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        score: 0,
        answeredQuestions: 0,
        totalQuestions: 20,
        timerInterval: null,
        timeRemaining: 30,
        currentQuestion: null,
        currentValue: 0,
        highContrastMode: false,
        largerFontMode: false
    };

    // DOM Elements
    const questionElements = document.querySelectorAll('.question');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const questionModal = document.getElementById('question-modal');
    const gameOverModal = document.getElementById('game-over-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalQuestion = document.getElementById('modal-question');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-answer');
    const passButton = document.getElementById('pass-question');
    const feedbackElement = document.getElementById('feedback');
    const timerElement = document.getElementById('timer');
    const restartButton = document.getElementById('restart-game');
    const toggleAccessibilityButton = document.getElementById('toggle-accessibility');
    const toggleFontSizeButton = document.getElementById('toggle-font-size');

    // Jeopardy Questions Data
    const questions = {
        "Information": {
            100: {
                question: "This principle states that more options leads to harder decisions",
                answer: "hick's law"
            },
            200: {
                question: "This cognitive bias occurs when people look for evidence that confirms what they already think",
                answer: "confirmation bias"
            },
            300: {
                question: "This visual principle states that large and close elements are easier to interact with",
                answer: "fitts's law"
            },
            400: {
                question: "When users tune out stuff they get repeatedly exposed to, this phenomenon is called",
                answer: "banner blindness"
            },
            500: {
                question: "This law states that if you simplify too much, you'll transfer some complexity to the users",
                answer: "tesler's law"
            }
        },
        "Meaning": {
            100: {
                question: "This principle describes how users adapt their behaviors based on what others do",
                answer: "social proof"
            },
            200: {
                question: "When people value things more when they're in limited supply, this is known as",
                answer: "scarcity"
            },
            300: {
                question: "When users have a preconceived opinion of how things work, this is called a",
                answer: "mental model"
            },
            400: {
                question: "When people judge things based on their feelings towards one trait, this is known as",
                answer: "halo effect"
            },
            500: {
                question: "This principle states that users can only keep 5±2 items in their working memory",
                answer: "miller's law"
            }
        },
        "Time": {
            100: {
                question: "This principle describes when users are more likely to take action if the effort is small",
                answer: "spark effect"
            },
            200: {
                question: "When people prefer to avoid losses more than earning equivalent gains, this is called",
                answer: "loss aversion"
            },
            300: {
                question: "This effect occurs when people are reluctant to pull out of something they're invested in",
                answer: "sunk cost effect"
            },
            400: {
                question: "When people tend to prioritize immediate benefits over bigger future gains, this is called",
                answer: "hyperbolic discounting"
            },
            500: {
                question: "The principle that roughly 80% of the effects come from 20% of the causes is known as",
                answer: "pareto principle"
            }
        },
        "Memory": {
            100: {
                question: "This rule states that people judge an experience by its peak and how it ends",
                answer: "peak-end rule"
            },
            200: {
                question: "When people remember incomplete tasks better than completed ones, this is known as",
                answer: "zeigarnik effect"
            },
            300: {
                question: "This effect describes when people remember pictures better than words",
                answer: "picture superiority effect"
            },
            400: {
                question: "When users value something more if they feel it's theirs, this is called",
                answer: "endowment effect"
            },
            500: {
                question: "When people recall negative events more than positive ones, this is known as",
                answer: "negativity bias"
            }
        }
    };

    // Initialize the game
    function initGame() {
        gameState.score = 0;
        gameState.answeredQuestions = 0;
        updateScore();

        // Add click event listeners to each question
        questionElements.forEach(element => {
            element.addEventListener('click', handleQuestionClick);
            element.classList.remove('answered');
            element.innerText = `$${element.dataset.value}`;
            
            // Add keyboard support
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    element.click();
                }
            });
        });

        // Add event listeners for answer submission
        submitButton.addEventListener('click', checkAnswer);
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        // Pass question button
        passButton.addEventListener('click', () => {
            clearInterval(gameState.timerInterval);
            showFeedback(false, questions[gameState.currentQuestion.dataset.category][gameState.currentValue].answer);
        });

        // Restart game button
        restartButton.addEventListener('click', () => {
            gameOverModal.hidden = true;
            initGame();
        });

        // Accessibility toggle buttons
        toggleAccessibilityButton.addEventListener('click', toggleHighContrast);
        toggleFontSizeButton.addEventListener('click', toggleFontSize);

        // Add keyboard support for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!questionModal.hidden) {
                    clearInterval(gameState.timerInterval);
                    questionModal.hidden = true;
                    answerInput.value = '';
                    feedbackElement.classList.add('hidden');
                }
            }
        });
    }

    // Handle question click
    function handleQuestionClick(e) {
        const questionElement = e.currentTarget;
        
        // Skip if already answered
        if (questionElement.classList.contains('answered')) {
            return;
        }

        gameState.currentQuestion = questionElement;
        gameState.currentValue = parseInt(questionElement.dataset.value);
        
        // Get the question data
        const category = questionElement.dataset.category;
        const value = questionElement.dataset.value;
        const questionData = questions[category][value];

        // Update modal with question
        modalTitle.innerText = `${category} - $${value}`;
        modalQuestion.innerText = questionData.question;
        
        // Show the modal and focus on the answer input
        questionModal.hidden = false;
        answerInput.value = '';
        answerInput.focus();
        feedbackElement.classList.add('hidden');
        
        // Start the timer
        gameState.timeRemaining = 30;
        timerElement.innerText = gameState.timeRemaining;
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = setInterval(updateTimer, 1000);
    }

    // Update the timer
    function updateTimer() {
        gameState.timeRemaining--;
        timerElement.innerText = gameState.timeRemaining;
        
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            showFeedback(false, questions[gameState.currentQuestion.dataset.category][gameState.currentValue].answer);
        }
    }

    // Check the answer
    function checkAnswer() {
        clearInterval(gameState.timerInterval);
        
        const category = gameState.currentQuestion.dataset.category;
        const value = gameState.currentValue;
        const correctAnswer = questions[category][value].answer.toLowerCase();
        const userAnswer = answerInput.value.trim().toLowerCase();
        
        // Compare answers (allow for partial matches)
        const isCorrect = userAnswer.length > 0 && 
                          (correctAnswer.includes(userAnswer) || 
                           userAnswer.includes(correctAnswer) ||
                           correctAnswer === userAnswer);
        
        // Update score
        if (isCorrect) {
            gameState.score += value;
        } else {
            gameState.score -= value;
        }
        
        updateScore();
        showFeedback(isCorrect, correctAnswer);
    }

    // Show feedback after answer
    function showFeedback(isCorrect, correctAnswer) {
        feedbackElement.classList.remove('hidden', 'correct', 'incorrect');
        feedbackElement.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        feedbackElement.innerHTML = isCorrect 
            ? `<p>Correct!</p>` 
            : `<p>Sorry, the correct answer is: "${correctAnswer}"</p>`;
        
        // Mark question as answered
        gameState.currentQuestion.classList.add('answered');
        gameState.currentQuestion.innerText = '';
        gameState.answeredQuestions++;
        
        // Close modal after delay
        setTimeout(() => {
            questionModal.hidden = true;
            answerInput.value = '';
            feedbackElement.classList.add('hidden');
            
            // Check if game is over
            if (gameState.answeredQuestions >= gameState.totalQuestions) {
                finalScoreElement.innerText = gameState.score;
                gameOverModal.hidden = false;
            }
        }, 2000);
    }

    // Update score display
    function updateScore() {
        scoreElement.innerText = gameState.score;
    }

    // Toggle high contrast mode
    function toggleHighContrast() {
        gameState.highContrastMode = !gameState.highContrastMode;
        document.body.classList.toggle('high-contrast', gameState.highContrastMode);
        
        // Update button text
        toggleAccessibilityButton.innerText = gameState.highContrastMode 
            ? 'Standard Contrast Mode' 
            : 'High Contrast Mode';
    }

    // Toggle larger font mode
    function toggleFontSize() {
        gameState.largerFontMode = !gameState.largerFontMode;
        document.body.classList.toggle('larger-font', gameState.largerFontMode);
        
        // Update button text
        toggleFontSizeButton.innerText = gameState.largerFontMode 
            ? 'Standard Font Size' 
            : 'Larger Font';
    }

    // Start the game
    initGame();
});
