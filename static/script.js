// Global Variables Definition

const CONSTANTS = {
    MIN_POS_NEG_AFINN: -20,
    MAX_POS_NEG_AFINN: 20,
    MAX_POS_NEG_VADER:1,
    MIN_POS_NEG_VADER:-1,
    MIN_FORMALITY: -5,
    MAX_FORMALITY: 5,
    FORMALITY_THRESHOLD: 0.55,
    NEUTRAL_THRESHOLD: 0.45,
    POS_NEG_THR: 0.1
};


function submitForm() {
    // Gather the form data
    const formData = new FormData(document.getElementById('input_form'));

    // Store selected lexicon and method before submission

    localStorage.setItem('selectedLexiconVal', selectedLex.value);
    localStorage.setItem('selectedMethodVal', selectedMethod.value);

    fetch('/process_input', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Expect a JSON response
    .then(data => {
        
        // const pred_class = data['pred_class']
        // const introText = data['intro_text'];
        // const bodyText = data['body_text'];
        // const conclusionText = data['conclusion_text'];

        const score = data['score'];
        const entireText = data['entire_text'];
        const scoresByWord = data['scores_by_word'];
        const processedText = data['processed_tokens'];
        const method = data['method']
        const lexicon =  data['lexicon']
        
        let colors;


        // const inputProcessed = processString(introText, bodyText, conclusionText);
        // document.getElementById('output').value = score;
        // document.getElementById('email_output').innerHTML = coloredText  // Display colored text
        colors = generateRedAndBlueShades(scoresByWord)
        
          
        
        feedbackContent.style.display = 'flex'; // Temporarily show the content to measure it
        const contentHeight = feedbackContent.scrollHeight;

        // Apply the calculated height to the button
        feedbackButton.style.height = `${contentHeight}px`;
        feedbackButton.style.padding = '10px 15px'; // Add padding
        feedbackButton.classList.add('active'); // Mark as active
        
        displayColoredText(entireText,processedText , colors);
        // updateOutputImage(method);
        updateResultCard(score,method,lexicon);

    })
    .catch(error => console.error('Error fetching data:', error));
}


function selectLexicon(value) {
    // Update the hidden input with the selected lexicon value
    document.getElementById('lex_name').value = value;
    const lexiconButtons = document.querySelectorAll('.lexicon-btn');

    // Remove active class from all lexicon buttons
    lexiconButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to the clicked lexicon button
    const clickedLexiconButton = Array.from(lexiconButtons).find(button => button.textContent.trim() === value);
    if (clickedLexiconButton) {
        clickedLexiconButton.classList.add('active');
    }
}

function selectMethod(value) {
    // Update the hidden input with the selected method value
    document.getElementById('method_name').value = value;
    const methodButtons = document.querySelectorAll('.method-btn');

    // Remove active class from all method buttons
    methodButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to the clicked method button
    const clickedMethodButton = Array.from(methodButtons).find(button => button.textContent.trim() === value);
    if (clickedMethodButton) {
        clickedMethodButton.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve stored values from localStorage
    const initialLexVal = 'AFINN-96';
    const initialMethodVal = 'Positive-Negative';

    // Retrieve the DOM elemenst that will be used.

    selectedLex = document.getElementById('lex_name');
    selectedMethod = document.getElementById('method_name');
    thumbUpImage = document.getElementById('upper_image_slider');
    thumbDownImage = document.getElementById('lower_image_slider');
    alertInfo = document.querySelector('.alert.alert-info');
    rangeInput = document.getElementById('sentimentRange');
    emailOutput = document.getElementById("email_output");


    resultCard = document.querySelector('#unique-results-card');
    resultAlert = resultCard.querySelector('.alert');
    resultHeading = resultAlert.querySelector('h4');
    resultText = resultAlert.querySelector('p');
    

    feedbackButton = document.getElementById('feedbackButton');
    feedbackContent = document.getElementById('feedbackContent');
    

    // Set values to inputs
    selectedLex.value = initialLexVal;
    selectedMethod.value = initialMethodVal;

    // Highlight the active buttons
    selectLexicon(initialLexVal);
    selectMethod(initialMethodVal);
});



function updateResultCard(score, method,lexicon) {


    if (!resultCard) {
        console.log("Result card not found for method:", method);
        return;
    }

    console.log("Result Card HTML:", resultCard.innerHTML); // Log the HTML of the result card for debugging
    // Target the alert within the card
    console.log("Result Alert:", resultAlert);

    if (!resultAlert) {
        console.log("Alert inside the card not found.");
        return;
    }

    console.log("Result Alert HTML:", resultAlert.innerHTML); // Log the HTML of the alert for debugging

    // Target the alert heading
    
    if (!resultHeading) {
        console.log("Heading inside the alert not found.");
        return;
    }

    // Try to find a paragraph element for result text, create one if not found
    
    if (!resultText) {
        console.log("Creating a new paragraph element for the result text.");
        resultText = document.createElement('p');
        resultAlert.appendChild(resultText);
    }

    // Update the result card based on the method
    if (method === 'Formality Analysis') {

        thumbUpImage.src =  "static/images/formal.png"
        thumbDownImage.src = "static/images/informal.png"
        // Formality logic
        if (score >= CONSTANTS.FORMALITY_THRESHOLD) {
            console.log("Updating to formal style.");
            updateCardHue((score-0.5)*2)
            resultHeading.textContent = 'Formal';
            resultText.textContent = `Your text looks pretty formal with a formality score of ${score}.`;
        } else if (score > CONSTANTS.NEUTRAL_THRESHOLD) 
            
            {console.log("Updating to neutral style.");
            updateCardHue((score-0.5)*2)
            resultHeading.textContent = 'Neutral';
            resultText.textContent = `Your text looks neither formal nor informal with a formality score of ${score}.`;} 
        else {
            console.log("Updating to informal style.");
            updateCardHue((score-0.5)*2)
            resultHeading.textContent = 'Informal';
            resultText.textContent = `Your text has an informal tone with a formality score of ${score}.`;
            
        }
        updateThumbPosition(score, CONSTANTS.MIN_FORMALITY,CONSTANTS.MAX_FORMALITY)
    } else if (method === 'Positive-Negative') {

        thumbUpImage.src = "static/images/thumb_up.png"
        thumbDownImage.src = "static/images/thumb_down.png"
        // Pos-Neg logic
        if (score >= CONSTANTS.POS_NEG_THR) {
            console.log("Updating to positive style.");
            updateCardHue(score)
            resultHeading.textContent = 'Positive Sentiment';
            resultText.textContent = `Your text conveys a positive sentiment with a score of ${score}.`;
        } else if (CONSTANTS.POS_NEG_THR < score) 
            {
            console.log("Updating to neutral style.");
            updateCardHue(score)
            resultHeading.textContent = 'Neutral Sentiment';
            resultText.textContent = `Your text conveys a neutral sentiment with a score of ${score}.`;
        }
          else
        {
            console.log("Updating to negative style.");
            updateCardHue(score)
            resultHeading.textContent = 'Negative Sentiment';
            resultText.textContent = `Your text conveys a negative sentiment with a score of ${score}.`;
        }
        if (lexicon!='VADER')
            {updateThumbPosition(score, CONSTANTS.MIN_POS_NEG_AFINN ,CONSTANTS.MAX_POS_NEG_AFINN)}
        else {updateThumbPosition(score, CONSTANTS.MIN_POS_NEG_VADER ,CONSTANTS.MAX_POS_NEG_VADER)}
    } else {
        console.log("Unknown method:", method);
    }

    
}


function displayColoredText(paragraph, wordsList, colors) {
    // Define regex to match unwanted punctuation and symbols
    const punctuationRegex = /[^\w\s]/g;

    // Clean wordsList and filter corresponding colors
    const cleanedWordsAndColors = wordsList.reduce((acc, word, index) => {
        // Remove punctuation and symbols from the word
        const cleanedWord = word.replace(punctuationRegex, '');

        // Only keep words and colors if cleaned word is non-empty
        if (cleanedWord) {
            acc.words.push(cleanedWord);
            acc.colors.push(colors[index]);
        }
        return acc;
    }, { words: [], colors: [] });

    // Use the cleaned words and colors
    cleanedWordsAndColors.words.forEach((word, index) => {
        const color = cleanedWordsAndColors.colors[index % cleanedWordsAndColors.colors.length];

        // Escape special characters to create a safe regex pattern
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi'); // Use 'g' for global match

        // Replace all occurrences with highlights
        paragraph = paragraph.replace(regex, (match) => {
            return `<span style="background-color: ${color}; padding: 0 2px;">${match}</span>`;
        });
    });

    // Display the result in the <pre> element with id "email_output"
    emailOutput.innerHTML = paragraph;
}


  function generateRedAndBlueShades(numbers) {
    // Helper function for scaling numbers to RGB values
    const scaleToColorIntensity = (num, minVal, maxVal) => {
      return Math.floor(((num - minVal) / (maxVal - minVal)) * 255);
    };
  
    // Function to convert a number to a color shade
    const numberToColorShade = (num) => {
      if (num >= 0) {
        // For values between 0 and 1, generate blue shades
        const blueIntensity = scaleToColorIntensity(num, 0, 1);
        const redAndGreen = 255 - blueIntensity;
        return `rgb(${redAndGreen}, ${redAndGreen}, 255)`; // Blue shades
      } else {
        // For values between 0 and -1, generate red shades with inverted logic
        const redIntensity = scaleToColorIntensity(num, 0,-1); // Red intensity increases as num gets more negative
        const greenAndBlue = 255 - redIntensity; // Blue and Green decrease as red increases
        return `rgb(${255}, ${greenAndBlue}, ${greenAndBlue})`; // Inverted Red shades
      }
    };
  
    // Map each number in the array to its color shade
    return numbers.map(numberToColorShade);
  }


function numberToHue(value) {
    // Define the color mappings directly
    // Used for formality and pos-neg.
    if (value <= -15) {
        return "#cc0000";  
    } else if (value <= -10) {
        return "#f44336";  
    } else if (value <= 0) {
        return "#fff2cc";  
    } else if (value <= 10) {
        return "#6fa8dc";  
    } else {
        return "#215ce3"; 
    }
}


function updateCardHue(value) {

    color = numberToHue(value)
    alertInfo.style.backgroundColor = color;
}

function updateThumbPosition(value, min, max) {
    const percentage = ((value - min) / (max - min)) * 100;
    // Set the value of the range input
    rangeInput.value = percentage;
    
    // Update the thumb's background color based on the value
    if (value < 0) {
        rangeInput.style.setProperty('--thumb-color', 'red');
    } else if (value > 0) {
        rangeInput.style.setProperty('--thumb-color', 'green');
    } else {
        rangeInput.style.setProperty('--thumb-color', 'yellow');
    }
}





// function updateResultCard(formalityScore) {
//     const resultCard = document.querySelector('#unique-results-card');
//     console.log("Result Card:", resultCard); // Log resultCard for debugging

//     if (!resultCard) {
//         console.log("Result card not found.");
//         return;
//     }

//     console.log("Result Card HTML:", resultCard.innerHTML); // Log the HTML of the result card for debugging

//     const resultAlert = resultCard.querySelector('.alert'); // Target the alert within the card
//     console.log("Result Alert:", resultAlert); // Log resultAlert for debugging

//     if (!resultAlert) {
//         console.log("Alert inside the card not found.");
//         return;
//     }

//     console.log("Result Alert HTML:", resultAlert.innerHTML); // Log the HTML of the alert for debugging

//     const resultHeading = resultAlert.querySelector('h4'); // Target the alert heading
//     if (!resultHeading) {
//         console.log("Heading inside the alert not found.");
//         return;
//     }

//     let resultText = resultAlert.querySelector('p'); // Try to find a paragraph element for result text
//     if (!resultText) {
//         console.log("Creating a new paragraph element for the result text.");
//         resultText = document.createElement('p');
//         resultAlert.appendChild(resultText);
//     }

//     // Change the text and color based on the formality score
//     if (formalityScore >= 0.5) {
//         console.log("Updating to formal style.");
//         resultAlert.className = 'alert alert-success'; // Green for success messages
//         resultHeading.textContent = 'Formal';
//         resultText.textContent = `Your text looks pretty formal with a formality score of ${formalityScore}.`;
//     } else {
//         console.log("Updating to informal style.");
//         resultAlert.className = 'alert alert-warning'; // Yellow for informal
//         resultHeading.textContent = 'Informal';
//         resultText.textContent = `Your text has informal tone with a formality score of ${formalityScore}.`;
//     }
// }

// function generateBlueShades(numbers) {
//     // Find the min and max values to scale the blueness
//     const minVal = 0;
//     const maxVal = 0.03;

//     // Function to convert a number to a blueish color
//     const numberToBlueShade = (num) => {
//       // Scale the number between 0 and 255 based on min and max values
//       const blueIntensity = Math.floor(((num - minVal) / (maxVal - minVal)) * 255);
//       const redAndGreen = 255 - blueIntensity;

//       // Return the color in hexadecimal format
//       return `rgb(${redAndGreen}, ${redAndGreen}, 255)`;
//     };

//     // Map each number in the array to its blueish shade
//     return numbers.map(numberToBlueShade);
//   }

// function processString(firstStr, secondStr, thirdStr) {
//     const redFirstStr = `<span style="color: red;">${firstStr}</span>`;
//     const blueSecondStr = `<span style="color: blue;">${secondStr}</span>`;
//     const greenThirdStr = `<span style="color: green;">${thirdStr}</span>`;

//     // Use <br> for line breaks
//     const processedStr = redFirstStr + '<br>' + blueSecondStr + '<br>' + greenThirdStr;

//     return processedStr;
// }