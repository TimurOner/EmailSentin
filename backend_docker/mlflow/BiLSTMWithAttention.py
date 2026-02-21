
import torch
import torch.nn as nn

class BiLSTMWithAttention(nn.Module):
    def __init__(self, embedding_dim, hidden_dim, output_dim):
        super(BiLSTMWithAttention, self).__init__()
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, bidirectional=True, batch_first=True)
        self.attention = nn.Linear(hidden_dim * 2, 1)
        self.fc = nn.Linear(hidden_dim * 2, output_dim)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        attn_weights = torch.softmax(self.attention(lstm_out), dim=1)
        context_vector = torch.sum(attn_weights * lstm_out, dim=1)
        logit = self.fc(context_vector)
        output = torch.sigmoid(logit)
        return output, logit, attn_weights.squeeze(-1)
