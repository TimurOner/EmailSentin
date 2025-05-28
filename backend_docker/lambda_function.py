from flask import Flask, render_template, request, jsonify
from flask_basicauth import BasicAuth
import os
import awsgi


from rule_based.pos_neg.pos_neg_run import pos_neg_score
from lstm_based.form_inform.form_inform import form_inform_score
from lstm_based.models.model1 import model_prod as mdl1
from gensim.models import KeyedVectors

import numpy as np
from user_feedback.save_feedback import append_value


app = Flask(__name__)
app.config['BASIC_AUTH_USERNAME'] = 'tim'
app.config['BASIC_AUTH_PASSWORD'] = '1234'
basic_auth = BasicAuth(app)


# Loading trained models and instances. Defining paths.
# Paths relative to the Docker container's /app directory
path_form_inform_model = os.path.join(os.getcwd(), "lstm_based/models/model1/model_2_atn.pth")
path_save_feedback = os.path.join(os.getcwd(), "user_feedback/feedback.csv")
word2vec_instance_path = os.path.join(os.getcwd(), "lstm_based/models/model1/glove-twitter-25.model")
# nltk.download('vader_lexicon')
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')


form_inform_model = mdl1.load_model(path_form_inform_model)
word2vec_instance = KeyedVectors.load(word2vec_instance_path)


@app.route('/')
# @basic_auth.required
def home():
    return render_template('index.html')


@app.route('/process_input', methods=['POST'])
def process_input():
   
    # # Retrieve form data from the request
    # user_input = request.form['user_input']
    # lexicon = request.form['lex_name']
    # method = request.form['method_name']


    # The AWS Lambda Integrated Part
     #-----------------------
    data = request.get_json()  
    user_input = data.get("user_input")  
    lexicon = data.get("lex_name")
    method = data.get("method_name")
     #-----------------------








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
        'score':round(float(score), 1),
        'method':method,
        'lexicon':lexicon
    }

    # Return a JSON response

    
    return jsonify(resp)


@app.route('/submit_rating', methods=['POST'])
def submit_rating():
    # Still not integrated ahaha
    rating = request.form.get('rating')
    rated_method = request.form.get('rated_method')
    print(rated_method )
    append_value(path_save_feedback,rating,rated_method)
    resp = { 'feedback_rating': rating }
    return jsonify(resp)  # JSON response



def handler(event, context):
     return awsgi.response(app, event, context)


# For local testing without AWS Emulator
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)