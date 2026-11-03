const textElement = document.getElementById("typed-text");
const words = ["Student ", "Developer ", "Programmer "];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeAnimation() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        // Remove characters
        textElement.textContent = currentWord.substring(0, charIndex--);
    } else {
        // Add characters
        textElement.textContent = currentWord.substring(0, charIndex++);
    }

    // Control typing speed
    const typingSpeed = isDeleting ? 125: 175 ;

    if (!isDeleting && charIndex === currentWord.length) {
        // Pause before deleting
        isDeleting = true;
        setTimeout(typeAnimation, 1000);
    } else if (isDeleting && charIndex === 0) {
        // Move to the next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeAnimation, 500);
    } else {
        setTimeout(typeAnimation, typingSpeed);
    }
}

// Start the animation
typeAnimation();
