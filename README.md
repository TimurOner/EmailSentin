## 📝 Project Intro

I am happy to present a simple Flask based web-application for analysis of sentiment of text. This application is very useful for fast and surface level sentiment analysis of e-mails, passages and paragraphs. One of main reasons for developing this web application is to demonstrate that even basic and lightweight machine learning models can perform quite well for certain tasks without need to load and finetune LLMs that usually require either expensive hardware or API subscription to utilize. The light-weight application has 2 main functionalities as of July 2025: performing a sentiment analysis of the text by its polarity (whether the text conveys positive or negative sentiment) using a lexicon-based approach utilizing lexicons like VADER and AFINN and performing an analysis of the formality level of a given text and highlighting the words with colour that changes its hue based on their contribution to the final formality assessment. The formality score is calculated based on bidirectional LSTM that was trained on the ENRON mail dataset. Because lexicon based models don’t require any training procedure, we discussed training pipeline only for the BiLSTM based formality classifier. A manual labelling procedure was called for since ENRON dataset that is used to train the formality classifier doesn’t include labels for formality. 3 independent labellers made sure that the annotations for the samples in the training set are as objective as possible.

## 📄 Dataset Preparation & Overview

The training set is based on the publicly available ENRON email corpus, which contains over 500,000 emails from the ENRON company prior to its collapse in 2001. This corpus is widely used in natural language processing studies for email research due to its authenticity in reflecting corporate communication patterns.

Emails were included in partitions to ensure diversity in content and a balanced representation of formal and informal classes. Messages containing only links, spam, or mostly numerical/graphical content were excluded from selection.

Annotation Methodology

Labeling the entire corpus was not feasible, so we applied a systematic sampling approach:

10 balanced splits of 150 messages each, totaling 1,500 labeled messages.

Each message was evaluated independently by three human annotators and labeled as either formal or informal.

Disagreements were resolved through consensus-building sessions to ensure quality annotations.

Sampling maintained variance in formality levels and balanced class distribution across all partitions.

Emails that contained predominantly links, spam, or numerical/graphical content were systematically rejected to focus on meaningful text communication.

Data Preprocessing

Threaded conversations in emails posed challenges due to varying levels of formality, which can create ambiguous supervision signals. To address this:

Individual messages were isolated, removing threads with mixed formality patterns to provide cleaner training signals.

Preprocessing steps included:

Tokenization: Using nltk.word_tokenize to split text into tokens.

Stopword Removal: Common English stopwords were removed.

Embedding: Each token converted into a 25-dimensional vector using the glove-twitter-25 embedding model. Inputs were clipped to 100 tokens.

A lightweight embedding model was chosen over larger (200+ dimensional) embeddings due to limited data and computational resources..

## 🏗️ The Architecture

## 📊 Performance of the Sentiment Analyzer

## 🧪 Testing / Simulation Results


## ⚡ Points for Improvement
User star-rating system: A feedback mechanism where users can rate the assesments made by the application is planned for future versions. This can reveal not only the content on which the model gave the least satisfactory performance but also ways to finetune and improve the user satisfaction.
More sentiment types, multimodal capabilities: New sentiment analysis types and multimodal capabilities are planned for future releases.
