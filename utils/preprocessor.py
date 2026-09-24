"""
Utility: NLP Preprocessing pipeline
"""

import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import WordNetLemmatizer

# Ensure resources available
for res in ['punkt', 'punkt_tab', 'stopwords', 'wordnet', 'omw-1.4']:
    try:
        nltk.data.find(f'tokenizers/{res}' if 'punkt' in res else f'corpora/{res}')
    except LookupError:
        nltk.download(res, quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
# Keep legally meaningful words
keep_words = {'no', 'not', 'nor', 'without', 'any', 'all', 'shall', 'must',
              'will', 'may', 'cannot', 'never', 'always'}
stop_words = stop_words - keep_words


def preprocess(text: str) -> str:
    """Full NLP pipeline: lowercase → clean → tokenize → filter → lemmatize."""
    if not isinstance(text, str) or not text.strip():
        return ""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(t) for t in tokens
              if t not in stop_words and len(t) > 2 and t.isalpha()]
    return ' '.join(tokens)


def split_into_clauses(text: str):
    """Split document text into individual clauses/sentences."""
    # Try sentence splitting
    sentences = sent_tokenize(text)
    clauses = []
    for sent in sentences:
        sent = sent.strip()
        if len(sent.split()) >= 5:   # keep meaningful sentences only
            clauses.append(sent)
    return clauses


def generate_summary(text: str, n_sentences: int = 5) -> str:
    """Extractive summary: pick top-N sentences by TF-IDF weight."""
    from sklearn.feature_extraction.text import TfidfVectorizer
    import numpy as np

    sentences = split_into_clauses(text)
    if not sentences:
        return text[:500] if text else "No summary available."
    if len(sentences) <= n_sentences:
        return ' '.join(sentences)

    processed = [preprocess(s) for s in sentences]
    try:
        vec = TfidfVectorizer()
        tfidf = vec.fit_transform(processed)
        scores = np.array(tfidf.sum(axis=1)).flatten()
        top_idx = scores.argsort()[::-1][:n_sentences]
        top_idx_sorted = sorted(top_idx)
        summary = ' '.join(sentences[i] for i in top_idx_sorted)
        return summary
    except Exception:
        return ' '.join(sentences[:n_sentences])
