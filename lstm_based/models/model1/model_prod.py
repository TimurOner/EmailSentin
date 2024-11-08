
# Imports
import numpy as np
import pandas as pd

# The word2vec imports
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# The LSTM imports
import torch
import torch.nn as nn



input_size = 25    # Number of features
hidden_size = 128  # Number of hidden units in LSTM
num_layers = 1     # Number of LSTM layer


class BiLSTMWithAttention(nn.Module):
    def __init__(self, embedding_dim, hidden_dim, output_dim):
        super(BiLSTMWithAttention, self).__init__()
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, bidirectional=True, batch_first=True)
        self.attention = nn.Linear(hidden_dim * 2, 1)  # Bidirectional -> 2 * hidden_dim
        self.fc = nn.Linear(hidden_dim * 2, output_dim)

    def forward(self, x):
     
        lstm_out, _ = self.lstm(x)  # Shape: (batch_size, seq_len, hidden_dim * 2)
        # Calculate attention scores
        attn_weights = torch.softmax(self.attention(lstm_out), dim=1)  # Shape: (batch_size, seq_len, 1)
        # Calculate the context vector as a weighted sum of the LSTM outputs
        context_vector = torch.sum(attn_weights * lstm_out, dim=1)  # Shape: (batch_size, hidden_dim * 2)
        # Fully connected layer for classification
        logit = self.fc(context_vector)
        # Apply softmax to the output to get probabilities
        output = torch.sigmoid(logit)
        return output,logit,attn_weights.squeeze(-1)  # Return the attention weights
    
    
def load_model(model_path):
    # Replace YourModelClass with the actual model class
    model = BiLSTMWithAttention(input_size,hidden_size,num_layers)  
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu'),weights_only=False))
    model.eval()  # Set model to evaluation mode
    return model

def convert_array_elements(obj):
    if isinstance(obj, np.ndarray):
        return obj.astype(int) if obj.dtype == np.int32 else obj.astype(float)
    elif isinstance(obj, list):
        return [convert_array_elements(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_array_elements(value) for key, value in obj.items()}
    return obj


def lstm_model_get_prediction(mail_body: str, model_instance: nn.Module, word2vec_instance) -> str:


    def preprocess_text(text, model, max_word_count=100):
         encoding_dim = model.vector_size
         # Tokenize and filter out stopwords
         tokens = word_tokenize(text)
         stop_words = set(stopwords.words('english'))
         meaningful_words = [word for word in tokens if word.lower() not in stop_words]

         # Get word vectors
         word_vectors = [model[word] for word in meaningful_words if word in model.key_to_index]

         # Pad or truncate to max_word_count
         if len(word_vectors) < max_word_count:
            padded_vectors = np.array(word_vectors + [[0] * encoding_dim] * (max_word_count - len(word_vectors)))
            seq_len = len(word_vectors)
         else:
            padded_vectors = np.array(word_vectors[:max_word_count])
            seq_len = max_word_count

          # Convert to tensor with the correct type and add a batch dimension
         return torch.tensor(padded_vectors, dtype=torch.float32).unsqueeze(0),meaningful_words,seq_len

    
    model_instance.eval()
    encoded_text,processed_tokens_str,seq_len  = preprocess_text(mail_body, word2vec_instance , max_word_count=100)
    
    with torch.no_grad():
        # Forward pass to get predictions
        output,logit,attn_weights = model_instance(encoded_text)
        attn_weights = attn_weights[:,:seq_len]
        
        
        # Interpret prediction
        if output == 1:
            return "Formal",round(logit.item(), 1),convert_array_elements(attn_weights.squeeze().numpy()),processed_tokens_str
        else:
            return "Informal",round(logit.item(), 1),convert_array_elements(attn_weights.squeeze().numpy()),processed_tokens_str


