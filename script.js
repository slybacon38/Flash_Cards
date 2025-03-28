// Declare variables for elements globally
let currentCardIndex = 0;
let flashcards = []; // Holds the data after it's fetched
let currentTopic = ""; // To keep track of the loaded topic
let questionEl, answerEl, questionNumberEl, toggleBtn, prevBtn, nextBtn, shuffleBtn;
let loadCoreBtn, loadNetFunBtn, loadCryptoBtn, loadNetSecBtn; // Topic buttons

// --- Function Definitions ---
function displayCard(index) {
    console.log(`---> displayCard called with index: ${index}`); // ADDED LOG

    // Check if data is loaded and elements are ready
    if (flashcards.length === 0) {
         console.error("---> displayCard Error: flashcards array is empty!");
         return;
    }
    if (!questionEl || !questionNumberEl || !answerEl || !toggleBtn || !prevBtn || !nextBtn ) {
        console.error("---> displayCard Error: One or more HTML element references are missing!");
        return;
    }
    console.log("---> displayCard: Element references seem OK."); // ADDED LOG

    // Ensure index is valid
    if (index < 0 || index >= flashcards.length) {
        console.error(`---> displayCard Error: Invalid index ${index}.`);
        return;
    }

    const card = flashcards[index];
    console.log("---> displayCard: Current card object:", card); // ADDED LOG

    // Check if card has expected properties
    if (typeof card.question === 'undefined' || typeof card.answer === 'undefined') {
         console.error("---> displayCard Error: Card object missing 'question' or 'answer' property:", card);
         questionEl.textContent = "Error: Invalid card data structure in JSON file.";
         return;
    }
     console.log("---> displayCard: Card structure seems OK."); // ADDED LOG

    // Update HTML - If it fails here, it might be an issue with the elements themselves
    try {
        questionNumberEl.textContent = `Question ${index + 1} / ${flashcards.length}`;
        questionEl.textContent = card.question;
        answerEl.textContent = card.answer;
        answerEl.style.display = 'none';
        toggleBtn.textContent = 'Show Answer';

        // Update button states
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === flashcards.length - 1;
         console.log("---> displayCard: Successfully updated HTML elements."); // ADDED LOG
    } catch (error) {
        console.error("---> displayCard Error during HTML update:", error); // ADDED ERROR CATCHING
    }
}

// Function to load data for a specific topic
function loadTopicData(topicName, jsonFile) {
    console.log(`---> Attempting to load topic: ${topicName} from file: ${jsonFile}`);
    // Indicate loading state & disable buttons
    if(questionEl) questionEl.textContent = `Loading ${topicName}...`;
    if(questionNumberEl) questionNumberEl.textContent = `Topic: ${topicName}`;
    if(answerEl) answerEl.style.display = 'none';
    if(toggleBtn) toggleBtn.disabled = true;
    if(shuffleBtn) shuffleBtn.disabled = true;
    if(prevBtn) prevBtn.disabled = true;
    if(nextBtn) nextBtn.disabled = true;

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for ${jsonFile}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`---> Data fetched and parsed for ${topicName}. Number of cards: ${data.length}`);

            flashcards = data; // Replace current data
            currentTopic = topicName;

            if (flashcards.length === 0) {
                 console.error(`---> ${topicName} data loaded but is empty.`);
                 if(questionEl) questionEl.textContent = `Error: No flashcards found for ${topicName}.`;
                 return;
            }

            // Enable buttons
            if(toggleBtn) toggleBtn.disabled = false;
            if(shuffleBtn) shuffleBtn.disabled = false;
            // prev/next state set by displayCard

            // Display the first card
            currentCardIndex = 0;
            console.log(`---> loadTopicData: Calling displayCard(${currentCardIndex}) for ${topicName}.`); // ADDED LOG
            displayCard(currentCardIndex); // Call display function
            console.log(`---> loadTopicData: Finished processing ${topicName}.`); // ADDED LOG

            document.title = `Flashcards - ${topicName}`;

        })
        .catch(error => {
            console.error(`---> Error in loadTopicData for ${jsonFile}:`, error);
            if(questionEl) questionEl.textContent = `Error loading ${topicName}. Check console.`;
            // Keep buttons disabled
            if(toggleBtn) toggleBtn.disabled = true;
            if(shuffleBtn) shuffleBtn.disabled = true;
            if(prevBtn) prevBtn.disabled = true;
            if(nextBtn) nextBtn.disabled = true;
        });
}


// Other functions (toggleAnswer, nextCard, prevCard, shuffleCards) remain largely the same
function toggleAnswer() {
    if (!answerEl || !toggleBtn) return;
    const isHidden = answerEl.style.display === 'none';
    answerEl.style.display = isHidden ? 'block' : 'none';
    toggleBtn.textContent = isHidden ? 'Hide Answer' : 'Show Answer';
}

function nextCard() {
    if (flashcards.length === 0 || currentCardIndex >= flashcards.length - 1) return;
    currentCardIndex++;
    displayCard(currentCardIndex);
}

function prevCard() {
    if (flashcards.length === 0 || currentCardIndex <= 0) return;
    currentCardIndex--;
    displayCard(currentCardIndex);
}

function shuffleCards() {
    if (flashcards.length === 0) {
        console.warn("Cannot shuffle: No cards loaded.");
        return;
    }
    console.log("---> shuffleCards: Shuffling cards..."); // ADDED LOG
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentCardIndex = 0;
    displayCard(currentCardIndex);
    console.log("---> shuffleCards: Cards shuffled!");
}


// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("---> DOMContentLoaded: Assigning elements..."); // ADDED LOG
    // Assign element variables
    questionEl = document.getElementById('question');
    answerEl = document.getElementById('answer');
    questionNumberEl = document.getElementById('question-number');
    toggleBtn = document.getElementById('toggle-answer-btn');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    shuffleBtn = document.getElementById('shuffle-btn');

    // Assign Topic Button elements
    loadCoreBtn = document.getElementById('load-core-btn');
    loadNetFunBtn = document.getElementById('load-net-fun-btn');
    loadCryptoBtn = document.getElementById('load-crypto-btn');
    loadNetSecBtn = document.getElementById('load-net-sec-btn');

    // Safety check for core elements
    if (!questionEl || !answerEl || !questionNumberEl || !toggleBtn || !prevBtn || !nextBtn || !shuffleBtn) {
        console.error("Initialization failed: Core HTML elements not found! Check IDs in index.html.");
        if (questionEl) questionEl.textContent = "Error: Page elements missing.";
        return;
    }
     console.log("---> DOMContentLoaded: Core elements assigned."); // ADDED LOG

    // Attach Event Listeners for controls
    toggleBtn.addEventListener('click', toggleAnswer);
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);
    shuffleBtn.addEventListener('click', shuffleCards);
    console.log("---> DOMContentLoaded: Control listeners attached."); // ADDED LOG


    // Attach Event Listeners for Topic Buttons
    let topicButtonsFound = false;
    if(loadCoreBtn) {
        loadCoreBtn.addEventListener('click', () => loadTopicData('Core Concepts', 'core_concepts.json'));
        topicButtonsFound = true;
    } else { console.warn("---> DOMContentLoaded: Button with id 'load-core-btn' not found."); }

    if(loadNetFunBtn) {
        loadNetFunBtn.addEventListener('click', () => loadTopicData('Networking Fundamentals', 'networking_fundamentals.json'));
        topicButtonsFound = true;
    } else { console.warn("---> DOMContentLoaded: Button with id 'load-net-fun-btn' not found."); }

    if(loadCryptoBtn) {
        loadCryptoBtn.addEventListener('click', () => loadTopicData('Cryptography', 'cryptography.json'));
        topicButtonsFound = true;
    } else { console.warn("---> DOMContentLoaded: Button with id 'load-crypto-btn' not found."); }

    if(loadNetSecBtn) {
        loadNetSecBtn.addEventListener('click', () => loadTopicData('Network Security', 'network_security.json'));
        topicButtonsFound = true;
    } else { console.warn("---> DOMContentLoaded: Button with id 'load-net-sec-btn' not found."); }

    if (topicButtonsFound) {
        console.log("---> DOMContentLoaded: Topic button listeners attached."); // ADDED LOG
    } else {
        console.error("---> DOMContentLoaded: NO topic buttons found! Check IDs in index.html.");
    }


    // Set initial state (no topic loaded yet)
    questionEl.textContent = "Please select a topic to begin.";
    questionNumberEl.textContent = "No topic loaded";
    console.log("---> DOMContentLoaded: Initial state set."); // ADDED LOG

});