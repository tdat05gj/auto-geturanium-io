past in console:

__________________________________________________________________________________________________________________________


// List of button titles
const buttonTitles = [
    'Auto Collector',    // Button 1
    'Shard Multiplier',  // Button 2
    'Conveyor Booster'   // Button 3
];

// Function to simulate a sequence of click events
function simulateClick(element) {
    if (!element) return false;

    // Check if the button is disabled
    if (element.disabled || element.classList.contains('opacity-50')) {
        console.log('Button is disabled!');
        return false;
    }

    // Create the events
    const events = [
        new Event('mouseover', { bubbles: true }),
        new Event('mousedown', { bubbles: true }),
        new Event('mouseup', { bubbles: true }),
        new Event('click', { bubbles: true })
    ];

    // Dispatch each event
    events.forEach(event => element.dispatchEvent(event));
    return true;
}

// Function to find and click a button
function clickButton(index) {
    const title = buttonTitles[index];

    // Find all buttons
    const buttons = document.querySelectorAll('button');
    let targetElement = null;

    // Loop to find the correct button
    buttons.forEach(button => {
        const h3 = button.querySelector('h3');
        if (h3 && h3.textContent === title) {
            // Try different clickable areas
            const flexDiv = button.querySelector('div.flex.items-start.gap-3');
            const flex1Div = button.querySelector('div.flex-1');
            
            // Priority: flexDiv > flex1Div > button
            targetElement = flexDiv || flex1Div || button;
        }
    });

    if (targetElement) {
        const clicked = simulateClick(targetElement);
        if (clicked) {
            console.log(`Clicked button ${index + 1}: ${title} (area: ${targetElement.className})`);
        } else {
            console.log(`Could not click button ${index + 1}: ${title} (area is disabled)`);
        }
    } else {
        console.log(`Button ${index + 1} not found: ${title}`);
    }
}

// Function to start the auto-click loop
function startAutoClick() {
    let currentIndex = 0;

    window.autoClickInterval = setInterval(() => {
        clickButton(currentIndex);
        currentIndex = (currentIndex + 1) % buttonTitles.length; // Loop through buttons
    }, 3000); // 3 seconds
}

// Start auto-clicking
startAutoClick();

// To stop, run in the console:
// clearInterval(window.autoClickInterval);


__________________________________________________________________________________________________________________________


end.
