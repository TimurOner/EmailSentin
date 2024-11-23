from flask import Flask, render_template, request, jsonify
from flask_basicauth import BasicAuth


from rule_based.pos_neg.pos_neg_run import pos_neg_score
from lstm_based.form_inform.form_inform import form_inform_score
from lstm_based.models.model1 import model_prod as mdl1
from gensim.models import KeyedVectors

import numpy as np


app = Flask(__name__)
app.config['BASIC_AUTH_USERNAME'] = 'tim'
app.config['BASIC_AUTH_PASSWORD'] = '1234'
basic_auth = BasicAuth(app)


# Loading trained models and instances
path_form_inform_model = r"C:\Users\timur\Documents\GitHub\EmailSentin\lstm_based\models\model1\model_2_atn.pth"

form_inform_model = mdl1.load_model(path_form_inform_model)
word2vec_instance = KeyedVectors.load(r"C:\Users\timur\Documents\GitHub\EmailSentin\lstm_based\models\model1\glove-twitter-25.model")


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


    if method == 'Positive-Negative':
     score,attention_weights,processed_tokens = pos_neg_score(user_input, lexicon)
     scores_by_word = attention_weights
     # Positivity score between -1 and 1 -1 being most negative and 1 being most positive (for VADER).
     # Positivity score unbounded but in general between -20 and 20 (for AFINN-96 AND AFINN-111)

    elif method == 'Formality Analysis':
     score,attention_weights,processed_tokens = form_inform_score(user_input,form_inform_model,word2vec_instance) 
     scores_by_word =  attention_weights*np.sign(score)*3
     # Formality score between -5 and 5 -5 being most informal and 5 being most formal.
     

    # For now the parsing feature is paused.
    # intro_text,body_text,conclusion_text =  get_email_components(user_input)  # Assuming split_text is defined elsewhere
    
    
    intro_text = ''
    body_text = ''
    conclusion_text = ''
    entire_text = user_input
    


  

    


    # Create the response dictionary
    resp = {
        #-----------------------
        'intro_text': intro_text,
        'body_text': body_text,
        'conclusion_text':conclusion_text,
        #-----------------------

        'scores_by_word':list(scores_by_word),
        'processed_tokens':processed_tokens,
        'entire_text':entire_text,
        'score':round(float(score), 1), # Pass the rounded score
        'method':method,
        'lexicon':lexicon
    }

    # Return a JSON response
    return jsonify(resp)

if __name__ == '__main__':
    app.run(debug=False)