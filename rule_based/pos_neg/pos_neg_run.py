import sys,os
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk



nltk.download('vader_lexicon')
                

from rule_based.pos_neg.preprocessing.preprocess import preprocess 
from rule_based.pos_neg.lexicons.lex_loader import load_lexicon  
from data.data_loader import load_data


def pos_neg_score(input_text,lex_name):

   # For now possible lexicons: AFINN-111 and AFINN-96


   if lex_name!='VADER':
  
      lexicon = load_lexicon(lex_name)
      output  = preprocess(input_text)
      score = sum(map(lambda word: lexicon.get(word, 0), output))

   else: 

      sid = SentimentIntensityAnalyzer()
      processed_output = sid.polarity_scores(input_text)
      score = processed_output['compound']
  
   return score
