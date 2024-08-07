document.getElementById('submit_button').addEventListener('click', function() {
    // Gather the form data
    const formData = new FormData(document.getElementById('input_form'));

    fetch('/process_input', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Expect a JSON response
    .then(data => {
        const score = data['score'];
        const introText = data['intro_text'];
        const bodyText = data['body_text'];

        const inputProcessed = processString(introText, bodyText);

        document.getElementById('output').value = score;
        document.getElementById('email_output').innerHTML = inputProcessed; // Display colored text
    })
    .catch(error => console.error('Error fetching data:', error));
});

function processString(firstStr, secondStr) {
    const redFirstStr = `<span style="color: red;">${firstStr}</span>`;
    const blueSecondStr = `<span style="color: blue;">${secondStr}</span>`;
    const processedStr = redFirstStr + blueSecondStr;

    return processedStr;
}