from flask import Flask, render_template, request
from flask_basicauth import BasicAuth
import os,sys

sys.path.append(os.path.abspath('rule_based'))


from pos_neg import pos_neg

app = Flask(__name__)

app.config['BASIC_AUTH_USERNAME'] = 'tim'
app.config['BASIC_AUTH_PASSWORD'] = '1234'

basic_auth = BasicAuth(app)

@app.route('/')
# @basic_auth.required
def home():
    return render_template('home.html')

@app.route('/process_input', methods=['POST'])
def process_input():
    user_input = request.form['user_input']
    # Process user_input (e.g., perform operations, calculations, etc.)
    # For now only simple Rule Based sentiment analysis.
    lexicon = request.form['lex_name']

    if lexicon!='VADER':
      processed_output = str(pos_neg(user_input,lexicon))

    else:
      from nltk.sentiment.vader import SentimentIntensityAnalyzer
      import nltk
      nltk.download('vader_lexicon')
      sid = SentimentIntensityAnalyzer()
      processed_output = str(sid.polarity_scores(user_input))

    # Optionally, you can send the processed output to a frontend template
    return processed_output

if __name__ == '__main__':
    app.run(debug=False)