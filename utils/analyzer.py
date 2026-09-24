"""
Utility: ML Prediction / Analysis Engine
"""

import os
import pickle
from utils.preprocessor import preprocess, split_into_clauses, generate_summary

import json

CONFIG_PATH = 'config.json'

def get_active_dataset():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'r') as f:
            return json.load(f).get('active_dataset', 'default')
    return 'default'

# Cached model store
_models = {}

def _load(name: str):
    global _models
    active = get_active_dataset()
    model_key = f"{active}_{name}"
    
    if model_key not in _models:
        path = os.path.join('models', active, f'{name}.pkl')
        if not os.path.exists(path):
            return None
        with open(path, 'rb') as f:
            _models[model_key] = pickle.load(f)
    return _models[model_key]


def models_ready() -> bool:
    """Check whether trained models exist for the active dataset."""
    active = get_active_dataset()
    model_dir = os.path.join('models', active)
    required = ['clause_classifier', 'clause_vectorizer',
                'risk_classifier', 'risk_vectorizer',
                'doc_classifier', 'doc_vectorizer']
    return all(os.path.exists(os.path.join(model_dir, f'{m}.pkl'))
               for m in required)


def load_metrics():
    """Load saved training metrics for the active dataset."""
    active = get_active_dataset()
    model_dir = os.path.join('models', active)
    names = ['clause_classifier', 'risk_classifier', 'doc_classifier']
    metrics = {}
    for n in names:
        path = os.path.join(model_dir, f'{n}_metrics.pkl')
        if os.path.exists(path):
            with open(path, 'rb') as f:
                metrics[n] = pickle.load(f)
    return metrics


# ── Risk colour mapping ───────────────────────────────────────────────────────
RISK_COLOR = {'Low': 'success', 'Medium': 'warning', 'High': 'danger'}
RISK_SCORE = {'Low': 1, 'Medium': 2, 'High': 3}

CLAUSE_ICONS = {
    'Termination': '🔴',
    'Payment': '💰',
    'Liability': '⚖️',
    'Confidentiality': '🔒',
    'Indemnity': '🛡️',
    'Dispute Resolution': '⚖️',
    'IP Rights': '©️',
    'Non-Compete': '🚫',
    'Warranty': '✅',
    'Governing Law': '📜',
    'Employment Terms': '👔',
    'Rental Terms': '🏠',
    'Force Majeure': '⚡',
}

MITIGATION_ADVICE = {
    'Termination': {
        'High': 'Ensure a "cure period" is added to allow fixing breaches before termination.',
        'Medium': 'Define "material breach" clearly to avoid ambiguous termination triggers.',
    },
    'Payment': {
        'High': 'Limit late fees to a reasonable percentage (e.g., 1-2% per month) to avoid being seen as a penalty.',
        'Medium': 'Clarify the "Net" payment term (e.g., Net 30) to avoid cash flow issues.',
    },
    'Liability': {
        'High': 'Insert a liability cap equal to the total fees paid to limit financial exposure.',
        'Medium': 'Exclude "indirect or consequential damages" to narrow the scope of liability.',
    },
    'Confidentiality': {
        'High': 'Add a "standard of care" clause (e.g., "reasonable care") to define protection efforts.',
        'Medium': 'Ensure the confidentiality period (e.g., 2-5 years) is appropriate for the data type.',
    },
    'Indemnity': {
        'High': 'Limit indemnification to "third-party claims" only and require immediate notice of claims.',
        'Medium': 'Ensure the indemnity is mutual to balance the risk between parties.',
    },
    'Non-Compete': {
        'High': 'Check if the geographic scope and duration are legally enforceable in your jurisdiction.',
        'Medium': 'Narrow the definition of "Competitor" to specific business activities.',
    },
    'IP Rights': {
        'High': 'Ensure "work-for-hire" language is present if you intend to own the final deliverables.',
        'Medium': 'Clarify usage rights for "Background IP" versus "New IP" created during the project.',
    }
}


def analyze_document(text: str) -> dict:
    """
    Full document analysis pipeline.
    Returns a dict with document type, risk summary, clauses list,
    risk distribution, clause distribution, and extractive summary.
    """
    clauses = split_into_clauses(text)
    if not clauses:
        clauses = [text[:500]] if text else ["No content found."]

    # Load models
    clause_clf = _load('clause_classifier')
    clause_vec = _load('clause_vectorizer')
    risk_clf = _load('risk_classifier')
    risk_vec = _load('risk_vectorizer')
    doc_clf = _load('doc_classifier')
    doc_vec = _load('doc_vectorizer')

    # ── Document type ──────────────────────────────────────────
    doc_processed = preprocess(text)
    doc_type = "Unknown"
    if doc_clf and doc_vec:
        doc_vec_data = doc_vec.transform([doc_processed])
        doc_type = doc_clf.predict(doc_vec_data)[0]

    # ── Clause-level analysis ──────────────────────────────────
    results = []
    risk_counts = {'Low': 0, 'Medium': 0, 'High': 0}
    clause_type_counts = {}
    total_risk_score = 0

    for clause in clauses[:50]:   # cap at 50 clauses for performance
        processed = preprocess(clause)
        if not processed.strip():
            continue

        # Clause type
        c_type = "Other"
        if clause_clf and clause_vec:
            c_vec = clause_vec.transform([processed])
            c_type = clause_clf.predict(c_vec)[0]

        # Risk level
        r_level = "Low"
        if risk_clf and risk_vec:
            r_vec = risk_vec.transform([processed])
            r_level = risk_clf.predict(r_vec)[0]

        risk_counts[r_level] = risk_counts.get(r_level, 0) + 1
        clause_type_counts[c_type] = clause_type_counts.get(c_type, 0) + 1
        total_risk_score += RISK_SCORE.get(r_level, 1)

        results.append({
            'clause': clause,
            'clause_type': c_type,
            'risk_level': r_level,
            'risk_color': RISK_COLOR.get(r_level, 'secondary'),
            'icon': CLAUSE_ICONS.get(c_type, '📄'),
            'mitigation': MITIGATION_ADVICE.get(c_type, {}).get(r_level, '')
        })

    # ── Overall risk ───────────────────────────────────────────
    n = len(results) or 1
    avg_score = total_risk_score / n
    if avg_score >= 2.5:
        overall_risk = 'High'
    elif avg_score >= 1.5:
        overall_risk = 'Medium'
    else:
        overall_risk = 'Low'

    # ── Summary ────────────────────────────────────────────────
    summary = generate_summary(text, n_sentences=5)

    return {
        'document_type': doc_type,
        'overall_risk': overall_risk,
        'overall_risk_color': RISK_COLOR.get(overall_risk, 'secondary'),
        'summary': summary,
        'clauses': results,
        'total_clauses': len(results),
        'risk_distribution': risk_counts,
        'clause_distribution': clause_type_counts,
    }
