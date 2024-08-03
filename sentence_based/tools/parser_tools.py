path_greetings = r'C:\Users\timur\Documents\GitHub\EmailSentin\sentence_based\text_files\intros.txt'
import pandas as pd

path_greetings = r"C:\\Users\\timur\Documents\\GitHub\\EmailSentin\\sentence_based\\text_files\\intros.txt"
path_endings = r"C:\\Users\\timur\Documents\\GitHub\\EmailSentin\sentence_based\\text_files\\endings.txt"

def get_greeting(email_text: str, path_greetings: str) -> str:
    # Function to parse and return the greeting of an email. Returns None if there isn't any.

    def extract_until_comma(text):
        # Ensure the text is a string
        if not isinstance(text, str):
            text = str(text)
        
        # Find the index of the first comma
        comma_index = text.find(',')
        # If a comma is found, return the substring up to that comma
        if comma_index != -1:
            return text[:comma_index]
        # If no comma is found, return the original text
        return text

    def separate_by_comma(text):
        # Split the string by commas
        substrings = text.split(',')
        # Strip any leading/trailing whitespace from each substring
        substrings = [s.strip() for s in substrings]
        return substrings

    # Read greetings from the provided path
    with open(path_greetings, 'r') as f:
        greetings = f.read().splitlines()

    # Debugging print statements
    
    extracted_str = extract_until_comma(email_text)
    separated_extracted_str = separate_by_comma(extracted_str)
    coma_sep_str = separated_extracted_str[0].split()
    

    return coma_sep_str

def split_text(email_text: str) -> str:
        # Ensure the text is a string
        if not isinstance(email_text, str):
            email_text = str(email_text)
        
        # Find the index of the first comma
        comma_index = email_text.find(',')
        # If a comma is found, return the substring up to that comma
        if comma_index != -1:
            return email_text[comma_index:],email_text[:comma_index]
        return None
       

def load_categories_to_dataframe(file_path, encoding='latin-1', delimiter=';', num_categories=5):
    # Read the file content as a string
    with open(file_path, 'r', encoding=encoding) as file:
        file_content = file.read()
    
    # Split the content using the specified delimiter
    data = file_content.split(delimiter)
    
    # Load the specified number of categories into a DataFrame
    data_frame = pd.DataFrame(data[:num_categories])
    
    return data_frame

def generate_ngrams_list(words: str, n: int) -> [str]:

    return [' '.join(words[i:i + n]) for i in range(len(words) - n + 1)]

def words_to_string(words):
    # Remove commas from each word
    cleaned_words = [word.replace(',', '') for word in words]
    # Join words with a space
    return ' '.join(cleaned_words)

def generate_ngrams(words: str, n: int) -> str:
  
    if n <= 0:
        raise ValueError("n must be a positive integer")
    
 
    words = words.split()
    ngrams = [' '.join(words[i:i + n]) for i in range(len(words) - n + 1)]
    return ngrams


def compute_valence(word_list: list, valence_lex_path: str, max_ngram: int = 3) -> int:
    # Function to compute the valence of a list of words based on a lexicon.
    valence = 0
    def search_gram_in_dataframe(data_frame: pd.DataFrame, gram: str) -> int:
     def word_in_cell(cell):
        words = cell
        return gram in [w.strip() for w in words]

     mask = data_frame.applymap(word_in_cell)
     
     row_idx, col_idx = np.where(mask)
     single_index = row_idx[0] if row_idx.size > 0 and col_idx.size > 0 else 0 
    
     return single_index
 

    # Load the valence lexicon from the provided path
    valence_lex = load_categories_to_dataframe(valence_lex_path, encoding='latin-1', delimiter=';', num_categories=5)
    
    for n in range(1,max_ngram+1 ):
      
      n_gram_list = generate_ngrams_list(word_list,n)
      
      df = valence_lex.apply(words_to_string,axis=1)
     
      df = df.apply(generate_ngrams,args=(n,))
     
      valence += sum([search_gram_in_dataframe(df.to_frame(), gram) for gram in n_gram_list])
      print(f'For n = {n} {valence}')
      

    return valence/max_ngram