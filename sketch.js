let input, button, outputText, connectText, connectButton, restartButton;
let speech;
let conversationHistory = [];
let initialPrompt = "You are an Oracle artifitially intelligent supercomputer at the top of the  mountian peak. you possesses infinite knowledge needed to answer the toughest questions. you are able to access people's personal memories with their permission in order to solver their greates troubles. you have been aproched by a person ready to ask you their one chosen question.  only use short responses of one or two sentences. begin right away";
let textColor = [0, 255, 255];
let searchButton;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();
    showSearchButton();
}

function showSearchButton() {
    searchButton = createButton('Connect to the Oracle');
    searchButton.position(windowWidth / 2 - 100, windowHeight / 2 - 20);
    searchButton.style('font-family', "'Courier New', Courier, monospace");
    searchButton.mousePressed(startSearch);
}

function startSearch() {
    searchButton.remove();
    showLoadingScreen();
}

function showLoadingScreen() {
    loadingText = createElement('h1', 'Connecting...');
    loadingText.position(windowWidth / 2 - 150, windowHeight / 2 - 20);
   
    loadingText.style('font-family', "'Courier New', Courier, monospace");
    setTimeout(showOracleConnection, 5000);
}

function showOracleConnection() {
    loadingText.remove();
    connectText = createElement('h1', 'You stand before the Oracle. Ask your question.');
    connectText.style('font-family', "'Courier New', Courier, monospace");
    connectText.position(windowWidth / 2 - 450, windowHeight / 2 - 50);
    connectButton = createButton('Enter the Oracle’s presence');
    connectButton.position(windowWidth / 2 - 100, windowHeight / 2 + 40);
    connectButton.mousePressed(showChatInterface);
}

function showChatInterface() {
    connectText.remove();
    connectButton.remove();

    outputText = createElement('h2', 'Awaiting your inquiry...');
    outputText.position(200, height / 2 - 50);
    outputText.style('font-family', "'Courier New', Courier, monospace");
    
    input = createInput();
    input.position(windowWidth / 2 - 150, 500);
    input.style('width', '300px');
    
    button = createButton('Ask');
    button.position(input.x + input.width + 10, input.y);
    button.mousePressed(askOracle);
    
    speech = new p5.Speech();
    
    conversationHistory.push(initialPrompt);
    askOracle(initialPrompt);

    restartButton = createButton('Restart');
    restartButton.position(windowWidth / 2 - 50, windowHeight - 60);
    restartButton.mousePressed(restartChat);
}

function askOracle(userQuery) {
    outputText.html('Loading...');
    
    if (input.value().toLowerCase().trim() === 'goodbye') {
        triggerGoodbyeMessage();
        return;
    }
    
    if (input.value()) {
        conversationHistory.push(`${input.value()}`);
        userQuery = conversationHistory.join('\n');
    }
    
    setTimeout(() => {
        fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userQuery }),
        })
        .then((response) => response.json())
        .then((data) => {
            conversationHistory.push(`${data.message}`);
            outputText.html(data.message);
            speech.speak(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        input.value('');
    }, 2000);
}

function triggerGoodbyeMessage() {
    outputText.html("The Oracle retreats into silence. Farewell.");
    speech.speak("The Oracle retreats into silence. Farewell.");
    input.value('');
}

function restartChat() {
    conversationHistory = [];
    input.remove();
    button.remove();
    outputText.remove();
    restartButton.remove();
    showSearchButton();
}