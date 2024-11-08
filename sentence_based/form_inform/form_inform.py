
from sentence_based.models.model1 import model_prod as mdl1

def form_inform_score(body_text:str,model_instance,word2vec_instance) -> float:
    class_result,score,attention_weights,processed_tokens = mdl1.lstm_model_get_prediction(body_text,model_instance,word2vec_instance)
    return class_result,score,attention_weights,processed_tokens