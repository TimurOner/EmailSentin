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
    return render_template('index.html')

@app.route('/process_input', methods=['POST'])
def process_input():
    user_input = request.form['user_input']
    lexicon = request.form['lex_name']
    score = str(pos_neg(user_input,lexicon))
    return score

if __name__ == '__main__':
    app.run(debug=False)