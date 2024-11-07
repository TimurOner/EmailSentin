
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import numpy as np

from rule_based.pos_neg.preprocessing.preprocess import preprocess 
from rule_based.pos_neg.lexicons.lex_loader import load_lexicon  



nltk.download('vader_lexicon')



def get_token_sentiments(tokens_to_process) -> np.array:


   sid = SentimentIntensityAnalyzer()
   valence_list = []

   for token in tokens_to_process:
        # Get sentiment score for the individual word
        processed_output = sid.polarity_scores(token)
        print(processed_output['compound'])
        # Store each word's compound score (overall sentiment intensity)
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

                



def pos_neg_score(input_text,lex_name):

   # For now possible lexicons: AFINN-111 and AFINN-96


   if lex_name!='VADER':
  
      lexicon = load_lexicon(lex_name)
      tokenized_text  = preprocess(input_text)
      valence_array = np.array(list(map(lambda word: lexicon.get(word, 0), tokenized_text)))
      print(valence_array)

      score = sum(map(lambda word: lexicon.get(word, 0), tokenized_text))

   else: 

      sid = SentimentIntensityAnalyzer()
      processed_output = sid.polarity_scores(input_text)
      score = processed_output['compound']
      tokenized_text  = preprocess(input_text)
      valence_array = get_token_sentiments(tokenized_text)
      print(valence_array)

   valence_array = convert_array_elements(valence_array)
     
  
   return score,valence_array,tokenized_text
