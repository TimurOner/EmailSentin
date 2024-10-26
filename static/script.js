function submitForm() {
    // Gather the form data
    const formData = new FormData(document.getElementById('input_form'));

    // Store selected lexicon and method before submission
    const selectedLexicon = document.getElementById('lex_name').value;
    const selectedMethod = document.getElementById('method_name').value;
    localStorage.setItem('selectedLexicon', selectedLexicon);
    localStorage.setItem('selectedMethod', selectedMethod);

    fetch('/process_input', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Expect a JSON response
    .then(data => {
        const score = data['score'];
        // const pred_class = data['pred_class']
        const introText = data['intro_text'];
        const bodyText = data['body_text'];
        const conclusionText = data['conclusion_text'];
        const entireText = data['entire_text']

        const inputProcessed = processString(introText, bodyText, conclusionText);

        // document.getElementById('output').value = score;
        document.getElementById('email_output').innerHTML = entireText; // Display colored text
        updateResultCard(score);
         
    })
    .catch(error => console.error('Error fetching data:', error));
}

function processString(firstStr, secondStr, thirdStr) {
    const redFirstStr = `<span style="color: red;">${firstStr}</span>`;
    const blueSecondStr = `<span style="color: blue;">${secondStr}</span>`;
    const greenThirdStr = `<span style="color: green;">${thirdStr}</span>`;
    
    // Use <br> for line breaks
    const processedStr = redFirstStr + '<br>' + blueSecondStr + '<br>' + greenThirdStr;
    
    return processedStr;
}

function selectLexicon(value) {
    // Update the hidden input with the selected lexicon value
    document.getElementById('lex_name').value = value;

    // Get all buttons in the lexicon group
    const lexiconButtons = document.querySelectorAll('.lexicon-btn');

    // Remove active class from all lexicon buttons
    lexiconButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to the clicked lexicon button
    const clickedLexiconButton = Array.from(lexiconButtons).find(button => button.textContent === value);
    if (clickedLexiconButton) {
        clickedLexiconButton.classList.add('active');
    }
}

function selectMethod(value) {
    // Update the hidden input with the selected method value
    document.getElementById('method_name').value = value;

    // Get all buttons in the method group
    const methodButtons = document.querySelectorAll('.method-btn');

    // Remove active class from all method buttons
    methodButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to the clicked method button
    const clickedMethodButton = Array.from(methodButtons).find(button => button.textContent === value);
    if (clickedMethodButton) {
        clickedMethodButton.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve stored values from localStorage
    const storedLexicon = localStorage.getItem('selectedLexicon');
    const storedMethod = localStorage.getItem('selectedMethod');

    // Set the values in the relevant inputs
    if (storedLexicon) {
        document.getElementById('lex_name').value = storedLexicon;
        selectLexicon(storedLexicon); // Highlight the active button
    }

    if (storedMethod) {
        document.getElementById('method_name').value = storedMethod;
        selectMethod(storedMethod); // Highlight the active button
    }
});



function updateResultCard(formalityScore) {
    const resultCard = document.querySelector('#unique-results-card');
    console.log("Result Card:", resultCard); // Log resultCard for debugging

    if (!resultCard) {
        console.log("Result card not found.");
        return;
    }

    console.log("Result Card HTML:", resultCard.innerHTML); // Log the HTML of the result card for debugging

    const resultAlert = resultCard.querySelector('.alert'); // Target the alert within the card
    console.log("Result Alert:", resultAlert); // Log resultAlert for debugging

    if (!resultAlert) {
        console.log("Alert inside the card not found.");
        return;
    }

    console.log("Result Alert HTML:", resultAlert.innerHTML); // Log the HTML of the alert for debugging

    const resultHeading = resultAlert.querySelector('h4'); // Target the alert heading
    if (!resultHeading) {
        console.log("Heading inside the alert not found.");
        return;
    }

    let resultText = resultAlert.querySelector('p'); // Try to find a paragraph element for result text
    if (!resultText) {
        console.log("Creating a new paragraph element for the result text.");
        resultText = document.createElement('p');
        resultAlert.appendChild(resultText);
    }

    // Change the text and color based on the formality score
    if (formalityScore >= 0.5) {
        console.log("Updating to formal style.");
        resultAlert.className = 'alert alert-success'; // Green for success messages
        resultHeading.textContent = 'Formal';
        resultText.textContent = `Your text looks pretty formal with a formality score of ${formalityScore}.`;
    } else {
        console.log("Updating to informal style.");
        resultAlert.className = 'alert alert-warning'; // Yellow for informal
        resultHeading.textContent = 'Informal';
        resultText.textContent = `Your text has informal tone with a formality score of ${formalityScore}.`;
    }
}

