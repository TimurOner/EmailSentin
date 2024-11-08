
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import numpy as np

from rule_based.pos_neg.preprocessing.preprocess import preprocess 
from rule_based.pos_neg.lexicons.lex_loader import load_lexicon  




def get_token_sentiments(tokens_to_process) -> np.array:


   sid = SentimentIntensityAnalyzer()
   valence_list = []

   for token in tokens_to_process:
      
        processed_output = sid.polarity_scores(token)
        valence_list.append(int(processed_output['compound']))


   
   valence_array = np.array(valence_list)

   return valence_array

def convert_array_elements(obj):
    if isinstance(obj, np.ndarray):
        # Convert the elements to Python's built-in int
        return obj.astype(object).tolist()  # Converts elements to Python's int
    elif isinstance(obj, list):
        return [convert_array_elements(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_array_elements(value) for key, value in obj.items()}
    return obj


def normalize_to_range(array, new_min=-1, new_max=1):
    arr_min = -5
    arr_max = 5
    normalized_array = new_min + (new_max - new_min) * (array - arr_min) / (arr_max - arr_min)
    return normalized_array

                
def pos_neg_score(input_text,lex_name):

   # For now possible lexicons: AFINN-111 and AFINN-96


   if lex_name!='VADER':
  
      lexicon = load_lexicon(lex_name)
      tokenized_text  = preprocess(input_text)
      valence_array = np.array(list(map(lambda word: lexicon.get(word, 0), tokenized_text)))

      valence_array = normalize_to_range(valence_array, -1, 1)
      score = sum(map(lambda word: lexicon.get(word, 0), tokenized_text))

   else: 

      sid = SentimentIntensityAnalyzer()
      processed_output = sid.polarity_scores(input_text)
      tokenized_text  = preprocess(input_text)

      valence_array = get_token_sentiments(tokenized_text)
      score = processed_output['compound']

   valence_array = convert_array_elements(valence_array)
  
   return score,valence_array,tokenized_text
