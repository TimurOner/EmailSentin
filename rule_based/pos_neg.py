import sys,os

sys.path.append(os.path.abspath('rule_based\pos_neg\preprocessing'))
sys.path.append(os.path.abspath('data'))
sys.path.append(os.path.abspath('rule_based\pos_neg\lexicons'))
                

from preprocess import preprocess 
from lex_loader import load_lexicon  
from data_loader import load_data


def pos_neg(input_text,lex_name):

  # For now possible lexicons: AFINN-111 and AFINN-96
  
  lexicon = load_lexicon(lex_name)
  output = preprocess(input_text)

  score = sum(map(lambda word: lexicon.get(word, 0), output))

  return score
