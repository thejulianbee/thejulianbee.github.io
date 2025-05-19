// js/me.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DEFINE DATA ---
    // Arrays of options for each swappable element
    const options = {
        // Slot 0: Hero Images (image paths relative to the HTML file)
        slot0: [
            'assets/images/me1.png',
            'assets/images/me2.PNG',
            'assets/images/me3.png',
            'assets/images/me4.png'
        ],
        // Slot 1: Age/Description
        slot1: [
            'TWENTY FOUR YEARS OLD',
            'FIVE FOOT SEVEN',
            'ABOUT 170 LBS',
            'MALE',
            'SINGLE'
        ],
        // Slot 2: Location/Time
        slot2: [
            'CALIFORNIA',
            'AMERICA',
            'THE BAY AREA',
            'HIS YOUTH',
            'THE BEST ERA OF HIS LIFE'
        ],
        // Slot 3: Favorite Thing (pairs: [Category, Item])
        slot3: [
            { category: 'BAND', item: 'SIMPLE PLAN' },
            { category: 'VIDEO GAME', item: 'SUPER MARIO 64' },
            { category: 'COLOR', item: 'PURPLE' },
            { category: 'DAY', item: 'FRIDAY' },
            { category: 'ANIMAL', item: 'DOG' },
            { category: 'FOOD', item: 'CHILAQUILES' },
            { category: 'MUSICAL', item: 'COMPANY' },
            { category: 'SHOW', item: 'BREAKING BAD' }
        ],
        // Slot 4: Good At
        slot4: [
            'IMPROV',
            'MATH',
            'SUPER MARIO WORLD',
            'STATISTICS',
            'TALKING'
        ],
        // Slot 5: Wants to improve at
        slot5: [
            'GUITAR',
            'BLENDER',
            'ML' // Machine Learning
        ],
        // Slot 6: He likes to make people
        slot6: [
          "LAUGH",
          "THINK",
          "FRIGHTENED",
          "HAPPY",
          "HIS TOOLS"
        ]
    };

    // --- 2. CURRENT STATE TRACKERS ---
    // Object to store the current index for each slot
    const currentIndices = {
        slot0: 0,
        slot1: 0,
        slot2: 0,
        slot3: 0,
        slot4: 0,
        slot5: 0,
        slot6: 0
    };

    // --- 3. GET DOM ELEMENTS ---
    const heroImageElement = document.getElementById('heroImage');
    const textSlot1Element = document.getElementById('textSlot1');
    const textSlot2Element = document.getElementById('textSlot2');
    const textSlot3aElement = document.getElementById('textSlot3a'); // Category part
    const textSlot3bElement = document.getElementById('textSlot3b'); // Item part
    const textSlot4Element = document.getElementById('textSlot4');
    const textSlot5Element = document.getElementById('textSlot5');
    const textSlot6Element = document.getElementById('textSlot6');
    const dieButton = document.getElementById('dieButton');

    // Group all swappable elements for easier event listener attachment
    const swappableElements = document.querySelectorAll('.swappable-element');

    // --- 4. UPDATE FUNCTIONS ---

    // Function to update the hero image
    function updateHeroImage() {
        if (heroImageElement) {
            // Add a class for a brief fade effect (optional)
            heroImageElement.classList.add('fade-out');
            setTimeout(() => {
                heroImageElement.src = options.slot0[currentIndices.slot0];
                heroImageElement.alt = `Julian Bee - Image ${currentIndices.slot0 + 1}`; // Update alt text
                heroImageElement.classList.remove('fade-out');
            }, 150); // Match this duration to your CSS transition for opacity
        }
    }

    // Function to update a single text slot (includes the "typing" effect)
    function updateTextElement(element, slotKey, isCategoryPart = false) {
        if (element) {
            let newText;
            if (slotKey === 'slot3') {
                newText = isCategoryPart ? options.slot3[currentIndices.slot3].category : options.slot3[currentIndices.slot3].item;
            } else {
                newText = options[slotKey][currentIndices[slotKey]];
            }

            // "Typing" animation (simple version)
            element.textContent = ''; // Clear current text
            let i = 0;
            function typeCharacter() {
                if (i < newText.length) {
                    element.textContent += newText.charAt(i);
                    i++;
                    setTimeout(typeCharacter, 50); // Adjust typing speed (milliseconds)
                }
            }
            typeCharacter();
        }
    }

    // Function to update all display elements based on currentIndices
    function updateAllElements() {
        updateHeroImage();
        updateTextElement(textSlot1Element, 'slot1');
        updateTextElement(textSlot2Element, 'slot2');
        updateTextElement(textSlot3aElement, 'slot3', true); // true for category part
        updateTextElement(textSlot3bElement, 'slot3', false); // false for item part
        updateTextElement(textSlot4Element, 'slot4');
        updateTextElement(textSlot5Element, 'slot5');
        updateTextElement(textSlot6Element, 'slot6');
    }

    // --- 5. EVENT HANDLERS ---

    // Function to handle click on a swappable element (cycle to next)
    function handleSwapClick(event) {
        const clickedElement = event.currentTarget; // Use currentTarget for dynamically added listeners
        const slot = clickedElement.dataset.slot;

        if (!slot) return; // Should not happen if dataset.slot is set

        if (slot === '0') { // Hero Image
            currentIndices.slot0 = (currentIndices.slot0 + 1) % options.slot0.length;
            updateHeroImage();
        } else if (slot === '3a' || slot === '3b') { // Special handling for paired slot 3
            currentIndices.slot3 = (currentIndices.slot3 + 1) % options.slot3.length;
            updateTextElement(textSlot3aElement, 'slot3', true);
            updateTextElement(textSlot3bElement, 'slot3', false);
        } else { // Regular text slots (1, 2, 4, 5)
            const slotKey = `slot${slot}`; // e.g., "slot1", "slot2"
            if (options[slotKey]) {
                currentIndices[slotKey] = (currentIndices[slotKey] + 1) % options[slotKey].length;
                // Determine the correct DOM element for this slotKey
                let targetElement;
                if (slotKey === 'slot1') targetElement = textSlot1Element;
                else if (slotKey === 'slot2') targetElement = textSlot2Element;
                else if (slotKey === 'slot4') targetElement = textSlot4Element;
                else if (slotKey === 'slot5') targetElement = textSlot5Element;
                else if (slotKey === 'slot6') targetElement = textSlot6Element;
                updateTextElement(targetElement, slotKey);
            }
        }
    }

    // Function to randomize all slots
    function randomizeAll() {
        for (const slotKey in currentIndices) { // e.g., slotKey is "slot0", "slot1"
            if (options[slotKey]) { // Check if options exist for this slot (e.g. slot0, slot1, slot3 etc.)
                currentIndices[slotKey] = Math.floor(Math.random() * options[slotKey].length);
            }
        }
        updateAllElements(); // Update display with new random indices
    }

    // --- 6. ATTACH EVENT LISTENERS ---
    swappableElements.forEach(element => {
        // Check if it's the die button, which has a separate handler
        if (element.id === 'dieButton') {
            element.addEventListener('click', randomizeAll);
        } else {
            element.addEventListener('click', handleSwapClick);
        }
    });


    // --- 7. INITIAL PAGE LOAD ---
    // Set initial content (first item from each list)
    updateAllElements();

    // Add a CSS class for hero image fade effect (optional)
    // Ensure this class is defined in your me.css
    if (heroImageElement) {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `#heroImage.fade-out { opacity: 0.3; transition: opacity 0.15s ease-in-out; }`;
        document.head.appendChild(styleSheet);
    }

});