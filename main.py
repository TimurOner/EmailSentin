from flask import Flask, render_template, request, jsonify
from flask_basicauth import BasicAuth


from rule_based.pos_neg.pos_neg_run import pos_neg_score
from sentence_based.tools.parser_tools import get_email_components




app = Flask(__name__)
app.config['BASIC_AUTH_USERNAME'] = 'tim'
app.config['BASIC_AUTH_PASSWORD'] = '1234'
basic_auth = BasicAuth(app)


@app.route('/')
# @basic_auth.required
def home():
    return render_template('index.html')


@app.route('/process_input', methods=['POST'])
def process_input():
    # Retrieve form data from the request
    user_input = request.form['user_input']
    lexicon = request.form['lex_name']
    method = request.form['method_name']



    score = str(pos_neg_score(user_input, lexicon))  # Convert the score to a string if needed
    intro_text,body_text,conclusion_text =  get_email_components(user_input)  # Assuming split_text is defined elsewhere


    # Create the response dictionary
    resp = {
        'intro_text': intro_text,
        'body_text': body_text,
        'conclusion_text':conclusion_text,
        'score': score
    }

    # Return a JSON response
    return jsonify(resp)

if __name__ == '__main__':
    app.run(debug=False)