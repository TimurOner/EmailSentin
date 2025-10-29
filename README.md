## 📝 Project Intro

I am happy to present a simple Flask based web-application for analysis of sentiment of text. This application is very useful for fast and surface level sentiment analysis of e-mails, passages and paragraphs. One of main reasons for developing this web application is to demonstrate that even basic and lightweight machine learning models can perform quite well for certain tasks without need to load and finetune LLMs that usually require either expensive hardware or API subscription to utilize. The light-weight application has 2 main functionalities as of July 2025: performing a sentiment analysis of the text by its polarity (whether the text conveys positive or negative sentiment) using a lexicon-based approach utilizing lexicons like VADER and AFINN and performing an analysis of the formality level of a given text and highlighting the words with colour that changes its hue based on their contribution to the final formality assessment. The formality score is calculated based on bidirectional LSTM that was trained on the ENRON mail dataset. Because lexicon based models don’t require any training procedure, we discussed training pipeline only for the BiLSTM based formality classifier. A manual labelling procedure was called for since ENRON dataset that is used to train the formality classifier doesn’t include labels for formality. 3 independent labellers made sure that the annotations for the samples in the training set are as objective as possible.

## 📄 Dataset Preparation & Overview

The model is trained on a subset of the publicly available ENRON email corpus, which contains over 500,000 authentic corporate emails. A total of 1,500 messages were annotated for formality using a systematic sampling approach: 10 balanced splits of 150 emails each, labeled as formal or informal by three human annotators. Disagreements were resolved through consensus sessions. Emails consisting mostly of links, spam, or numerical/graphical content were excluded to ensure meaningful textual data.

Preprocessing:

Emails were split into individual messages to avoid ambiguity in threads with mixed formality.

Tokenization using NLTK’s word tokenizer.

Stopwords removal.

## 🏗️ The Architecture

## 📊 Performance of the Sentiment Analyzer

## 🧪 Testing / Simulation Results

## ⚡ Points for Improvement
