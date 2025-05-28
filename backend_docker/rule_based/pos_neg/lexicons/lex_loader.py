
import os


def load_lexicon(lex_name='AFINN-96'):

    # Loading the lexicons. 
    

    base_path = os.path.join(os.getcwd(), "rule_based/pos_neg/lexicons")
    file_path = os.path.join(base_path, lex_name + '.txt')
    with open(file_path, 'r', encoding='utf-8') as file:
    # Use a list comprehension to split each line and create tuples
     lexicon = dict(map(lambda kv: (kv[0], int(kv[1])), 
                     [line.strip().split('\t') for line in file]))

    return lexicon