import nltk
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords as stpwrds
import string
import re


nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess(input_text):

    def is_number(token):
        # Check if the token is a number (integer or decimal)
        return re.match(r'^\d+(\.\d+)?$', token) is not None

    stopwords = nltk.corpus.stopwords.words("english")

    # Remove White Spaces

    input_text = input_text.strip()
    input_text = " ".join(input_text.split())

    # Tokenizing the text.
    tokens = nltk.word_tokenize(input_text)
    # Lowercasing the tokes.
    lowercased_tokens = [token.lower() for token in tokens]
    # Filtering the punctuation and stop-words.
    filtered_tokens = [token for token in lowercased_tokens if (token not in string.punctuation) and (token not in stopwords)]
    # Removing numbers
    filtered_tokens = [token for token in filtered_tokens if not is_number(token)]

    preprocessed_text = filtered_tokens 
    

    return preprocessed_text






