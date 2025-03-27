// Simple Psychology of Design Jeopardy Game
document.addEventListener('DOMContentLoaded', function() {
    // Game data - questions and answers
    const questions = {
        "Information": {
            100: {
                question: "This principle states that more options leads to harder decisions",
                answer: "Hick's Law",
                options: ["Cognitive Load", "Hick's Law", "Priming", "Anchoring Bias"]
            },
            200: {
                question: "This cognitive bias occurs when people look for evidence that confirms what they already think",
                answer: "Confirmation Bias",
                options: ["Confirmation Bias", "Attentional Bias", "Empathy Gap", "Expectations Bias"]
            },
            300: {
                question: "This visual principle states that large and close elements are easier to interact with",
                answer: "Fitts's Law",
                options: ["Law of Proximity", "Visual Hierarchy", "Fitts's Law", "Signifiers"]
            },
            400: {
                question: "When users tune out stuff they get repeatedly exposed to, this phenomenon is called",
                answer: "Banner Blindness",
                options: ["Banner Blindness", "Selective Attention", "Juxtaposition", "Contrast"]
            },
            500: {
                question: "This law states that if you simplify too much, you'll transfer some complexity to the users",
                answer: "Tesler's Law",
                options: ["Framing", "Aesthetic-Usability Effect", "Tesler's Law", "Progressive Disclosure"]
            }
        },
        "Meaning": {
            100: {
                question: "This principle describes how users adapt their behaviors based on what others do",
                answer: "Social Proof",
                options: ["Authority Bias", "Social Proof", "Familiarity Bias", "Unit Bias"]
            },
            200: {
                question: "When people value things more when they're in limited supply, this is known as",
                answer: "Scarcity",
                options: ["Scarcity", "Group Attractiveness Effect", "Singularity Effect", "Curiosity Gap"]
            },
            300: {
                question: "When users have a preconceived opinion of how things work, this is called a",
                answer: "Mental Model",
                options: ["Flow State", "Mental Model", "Halo Effect", "Skeuomorphism"]
            },
            400: {
                question: "When people judge things based on their feelings towards one trait, this is known as",
                answer: "Halo Effect",
                options: ["Pseudo-Set Framing", "Halo Effect", "Variable Reward", "Reciprocity"]
            },
            500: {
                question: "This principle states that users can only keep 5±2 items in their working memory",
                answer: "Miller's Law",
                options: ["Miller's Law", "Curse of Knowledge", "Aha! moment", "Self-Initiated Triggers"]
            }
        },
        "Time": {
            100: {
                question: "This principle describes when users are more likely to take action if the effort is small",
                answer: "Spark Effect",
                options: ["Weber's Law", "Hyperbolic Discounting", "Spark Effect", "Default Bias"]
            },
            200: {
                question: "When people prefer to avoid losses more than earning equivalent gains, this is called",
                answer: "Loss Aversion",
                options: ["Decision Fatigue", "Loss Aversion", "Sunk Cost Effect", "Investment Loops"]
            },
            300: {
                question: "This effect occurs when people are reluctant to pull out of something they're invested in",
                answer: "Sunk Cost Effect",
                options: ["Sunk Cost Effect", "Commitment & Consistency", "Reactance", "Chronoception"]
            },
            400: {
                question: "When people tend to prioritize immediate benefits over bigger future gains, this is called",
                answer: "Hyperbolic Discounting",
                options: ["Hyperbolic Discounting", "Planning Fallacy", "Affect Heuristic", "Law of the Instrument"]
            },
            500: {
                question: "The principle that roughly 80% of the effects come from 20% of the causes is known as",
                answer: "Pareto Principle",
                options: ["Observer-Expectancy Effect", "Barnum-Forer Effect", "Pareto Principle", "Dunning-Kruger Effect"]
            }
        },
        "Memory": {
            100: {
                question: "This rule states that people judge an experience by its peak and how it ends",
                answer: "Peak-End Rule",
                options: ["Serial Position Effect", "Peak-End Rule", "Method of Loci", "Recognition Over Recall"]
            },
            200: {
                question: "When people remember incomplete tasks better than completed ones, this is known as",
                answer: "Zeigarnik Effect",
                options: ["Zeigarnik Effect", "Chunking", "Spacing Effect", "Delighters"]
            },
            300: {
                question: "This effect describes when people remember pictures better than words",
                answer: "Picture Superiority Effect",
                options: ["Endowment Effect", "Picture Superiority Effect", "Sensory Appeal", "Storytelling Effect"]
            },
            400: {
                question: "When users value something more if they feel it's theirs, this is called",
                answer: "Endowment Effect",
                options: ["Internal Trigger", "Negativity Bias", "Endowment Effect", "Availability Heuristic"]
            },
            500: {
                question: "When people recall negative events more than positive ones, this is known as",
                answer: "Negativity Bias",
                options: ["Shaping", "Provide Exit Points", "Negativity Bias", "Availability Heuristic"]
            }
        }
    };

    // Game variables
    var score = 0;
    var answeredQuestions = 0;
    var correctAnswers = 0;
    var totalQuestions = 20;
    var timeRemaining = 30;
    var timerInterval;
    var currentQuestion = null;
    var currentValue = 0;

    // DOM Elements
    var questionElements = document.querySelectorAll('.question');
    var scoreElement = document.getElementById('score');
    var questionModal = document.getElementById('question-modal');
    var gameOverModal = document.getElementById('game-over-modal');
    var modalTitle = document.getElementById('modal-title');
    var modalQuestion = document.getElementById('modal-question');
    var multipleChoiceContainer = document.getElementById('multiple-choice-container');
    var passButton = document.getElementById('pass-question');
    var feedbackElement = document.getElementById('feedback');
    var timerElement = document.getElementById('timer');
    var finalScoreElement = document.getElementById('final-score');
    var restartButton = document.getElementById('restart-game');
    var accessibilityButton = document.getElementById('toggle-accessibility');
    var questionsAnsweredElement = document.getElementById('questions-answered');
    var correctAnswersElement = document.getElementById('correct-answers');
    var scoreMessageElement = document.querySelector('.score-message');
    var shareButton = document.getElementById('share-score');

    // Initialize the game
    function initGame() {
        // Reset score and counters
        score = 0;
        answeredQuestions = 0;
        correctAnswers = 0;
        updateScore();

        // Set up question clicks
        for (var i = 0; i < questionElements.length; i++) {
            questionElements[i].addEventListener('click', handleQuestionClick);
            questionElements[i].classList.remove('answered');
        }

        // Set up pass button
        passButton.addEventListener('click', function() {
            clearInterval(timerInterval);
            var category = currentQuestion.dataset.category;
            var value = currentValue;
            showFeedback(false, questions[category][value].answer);
        });

        // Set up restart button
        restartButton.addEventListener('click', function() {
            gameOverModal.style.display = 'none';
            
            // Reset questions
            for (var i = 0; i < questionElements.length; i++) {
                questionElements[i].classList.remove('answered');
                questionElements[i].textContent = '$' + questionElements[i].dataset.value;
            }
            
            // Reset game state
            score = 0;
            answeredQuestions = 0;
            correctAnswers = 0;
            updateScore();
        });

        // Set up accessibility buttons
        accessibilityButton.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
        });

        // Set up share button
        if (shareButton) {
            shareButton.addEventListener('click', function() {
                alert("Your score: " + score);
            });
        }
    }

    // Update score display
    function updateScore() {
        scoreElement.textContent = score;
    }

    // Handle question click
    function handleQuestionClick(event) {
        // Skip if already answered
        if (event.target.classList.contains('answered')) {
            return;
        }

        currentQuestion = event.target;
        currentValue = parseInt(currentQuestion.dataset.value);
        
        // Get question data
        var category = currentQuestion.dataset.category;
        var value = currentValue;
        
        // Check if category and value exist
        if (!questions[category] || !questions[category][value]) {
            console.error("Question not found!");
            return;
        }
        
        var questionData = questions[category][value];

        // Update modal
        modalTitle.textContent = category + " - $" + value;
        modalQuestion.textContent = questionData.question;
        
        // Clear and create choice buttons
        multipleChoiceContainer.innerHTML = '';
        
        // Create shuffled options
        var options = questionData.options.slice();
        shuffleArray(options);
        
        // Add options as buttons
        for (var i = 0; i < options.length; i++) {
            var button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = options[i];
            
            // Use closure to keep the option value
            (function(option) {
                button.addEventListener('click', function() {
                    checkAnswer(option);
                });
            })(options[i]);
            
            multipleChoiceContainer.appendChild(button);
        }
        
        // Show the modal
        questionModal.style.display = 'flex';
        feedbackElement.classList.add('hidden');
        
        // Start timer
        timeRemaining = 30;
        timerElement.textContent = timeRemaining;
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Shuffle array
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    // Update timer
    function updateTimer() {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            var category = currentQuestion.dataset.category;
            var value = currentValue;
            showFeedback(false, questions[category][value].answer);
        }
    }

    // Check answer
    function checkAnswer(selectedOption) {
        clearInterval(timerInterval);
        
        var category = currentQuestion.dataset.category;
        var value = currentValue;
        var correctAnswer = questions[category][value].answer;
        
        // Check if correct
        var isCorrect = (selectedOption === correctAnswer);
        
        // Update score
        if (isCorrect) {
            score += parseInt(value);
            correctAnswers++;
        } else {
            score -= parseInt(value);
        }
        
        updateScore();
        
        // Disable buttons and highlight correct/incorrect
        var buttons = multipleChoiceContainer.querySelectorAll('.choice-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
            
            if (buttons[i].textContent === correctAnswer) {
                buttons[i].style.backgroundColor = 'var(--correct-color)';
            } else if (buttons[i].textContent === selectedOption && !isCorrect) {
                buttons[i].style.backgroundColor = 'var(--incorrect-color)';
            }
        }
        
        showFeedback(isCorrect, correctAnswer);
    }

    // Show feedback
    function showFeedback(isCorrect, correctAnswer) {
        feedbackElement.classList.remove('hidden', 'correct', 'incorrect');
        feedbackElement.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        if (isCorrect) {
            feedbackElement.innerHTML = "<p>Correct!</p>";
        } else {
            feedbackElement.innerHTML = "<p>Sorry, the correct answer is: \"" + correctAnswer + "\"</p>";
        }
        
        // Mark question as answered
        currentQuestion.classList.add('answered');
        currentQuestion.textContent = '';
        answeredQuestions++;
        
        // Close modal after delay
        setTimeout(function() {
            questionModal.style.display = 'none';
            feedbackElement.classList.add('hidden');
            
            // Check if game is over
            if (answeredQuestions >= totalQuestions) {
                // Show game over screen
                finalScoreElement.textContent = score;
                questionsAnsweredElement.textContent = answeredQuestions;
                correctAnswersElement.textContent = correctAnswers;
                
                // Set score message
                if (scoreMessageElement) {
                    if (score <= 0) {
                        scoreMessageElement.textContent = "Better luck next time!";
                    } else {
                        scoreMessageElement.textContent = "Great job!";
                    }
                }
                
                gameOverModal.style.display = 'flex';
            }
        }, 2000);
    }

    // Start the game
    initGame();
});
