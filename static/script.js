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
        
        // const pred_class = data['pred_class']
        // const introText = data['intro_text'];
        // const bodyText = data['body_text'];
        // const conclusionText = data['conclusion_text'];

        const score = data['score'];
        const entireText = data['entire_text'];
        const attnList = data['attn_list'];
        const processedText = data['processed_tokens'];
        const method = data['method']
        let colors;




        // const inputProcessed = processString(introText, bodyText, conclusionText);
        // document.getElementById('output').value = score;
        // document.getElementById('email_output').innerHTML = coloredText  // Display colored text
        if (method === 'Positive-Negative') {
            colors = generateRedAndBlueShades(attnList);
          } else {
            colors = generateBlueShades(attnList);
          }
          
        
        
        displayColoredText(entireText,processedText , colors);
        updateResultCard(score,method);

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


function updateResultCard(score, method) {

    // Select the appropriate result card based on the method
    const resultCard = document.querySelector('#unique-results-card');

    if (!resultCard) {
        console.log("Result card not found for method:", method);
        return;
    }

    console.log("Result Card HTML:", resultCard.innerHTML); // Log the HTML of the result card for debugging

    // Target the alert within the card
    resultAlert = resultCard.querySelector('.alert');
    console.log("Result Alert:", resultAlert);

    if (!resultAlert) {
        console.log("Alert inside the card not found.");
        return;
    }

    console.log("Result Alert HTML:", resultAlert.innerHTML); // Log the HTML of the alert for debugging

    // Target the alert heading
    resultHeading = resultAlert.querySelector('h4');
    if (!resultHeading) {
        console.log("Heading inside the alert not found.");
        return;
    }

    // Try to find a paragraph element for result text, create one if not found
    resultText = resultAlert.querySelector('p');
    if (!resultText) {
        console.log("Creating a new paragraph element for the result text.");
        resultText = document.createElement('p');
        resultAlert.appendChild(resultText);
    }

    // Update the result card based on the method
    if (method === 'Formality Analysis') {
        // Formality logic
        if (score >= 0.5) {
            console.log("Updating to formal style.");
            resultAlert.className = 'alert alert-success'; // Green for success messages
            resultHeading.textContent = 'Formal';
            resultText.textContent = `Your text looks pretty formal with a formality score of ${score}.`;
        } else {
            console.log("Updating to informal style.");
            resultAlert.className = 'alert alert-warning'; // Yellow for informal
            resultHeading.textContent = 'Informal';
            resultText.textContent = `Your text has an informal tone with a formality score of ${score}.`;
        }
    } else if (method === 'Positive-Negative') {
        // Pos-Neg logic
        if (score >= 0) {
            console.log("Updating to positive style.");
            resultAlert.className = 'alert alert-success'; // Green for positive
            resultHeading.textContent = 'Positive Sentiment';
            resultText.textContent = `Your text conveys a positive sentiment with a score of ${score}.`;
        } else {
            console.log("Updating to negative style.");
            resultAlert.className = 'alert alert-danger'; // Red for negative
            resultHeading.textContent = 'Negative Sentiment';
            resultText.textContent = `Your text conveys a negative sentiment with a score of ${score}.`;
        }
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
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');

        // Replace only if a match is found
        paragraph = paragraph.replace(regex, (match) => {
            return match ? `<span style="background-color: ${color}; padding: 0 2px;">${match}</span>` : '';
        });
    });

    // Display the result in the <pre> element with id "email_output"
    document.getElementById("email_output").innerHTML = paragraph;
}


function generateBlueShades(numbers) {
    // Find the min and max values to scale the blueness
    const minVal = 0;
    const maxVal = 0.03;

    // Function to convert a number to a blueish color
    const numberToBlueShade = (num) => {
      // Scale the number between 0 and 255 based on min and max values
      const blueIntensity = Math.floor(((num - minVal) / (maxVal - minVal)) * 255);
      const redAndGreen = 255 - blueIntensity;

      // Return the color in hexadecimal format
      return `rgb(${redAndGreen}, ${redAndGreen}, 255)`;
    };

    // Map each number in the array to its blueish shade
    return numbers.map(numberToBlueShade);
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
        // For values between 0 and -1, generate red shades
        const redIntensity = scaleToColorIntensity(num, -1, 0);
        const greenAndBlue = 255 - redIntensity;
        return `rgb(255, ${greenAndBlue}, ${greenAndBlue})`; // Red shades
      }
    };
  
    // Map each number in the array to its color shade
    return numbers.map(numberToColorShade);
  }




