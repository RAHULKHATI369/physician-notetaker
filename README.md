🧠 Physician Notetaker – AI-Powered Medical NLP System
🚀 Project Overview

Physician Notetaker is an AI-driven medical transcription and NLP analysis system that processes doctor–patient conversations to automatically extract clinical insights, summarize key medical details, and generate structured reports.
Built using Python, spaCy, and Transformers, the system performs Named Entity Recognition (NER), Sentiment & Intent Analysis, and SOAP Note Generation — turning raw medical transcripts into actionable clinical documentation.

⚙️ Key Features
🩺 1. Medical NLP Summarization

Extracts Symptoms, Diagnosis, Treatment, and Prognosis from transcribed doctor–patient dialogues.

Generates structured medical summaries in JSON format using spaCy and BERT-based models.

Performs keyword extraction to highlight crucial phrases like “whiplash injury” and “physiotherapy sessions.”

😊 2. Sentiment & Intent Analysis

Uses a fine-tuned DistilBERT model to analyze patient emotions.

Classifies patient tone as Anxious, Neutral, or Reassured.

Detects conversational intent — such as “Seeking reassurance”, “Reporting symptoms”, or “Expressing gratitude.”

📋 3. SOAP Note Generation (Bonus)

Converts the entire transcript into a structured SOAP note:

Subjective: Patient complaints and history.

Objective: Physician observations and exam results.

Assessment: Diagnosis and progress evaluation.

Plan: Treatment advice and follow-up recommendations.

Uses a hybrid rule-based + NLP approach for clinical accuracy.

🧩 Tech Stack

Language: Python 3.11

Frameworks/Libraries: spaCy, Transformers (BERT/DistilBERT), scikit-learn, pandas, nltk

NLP Models: en_core_web_md, distilbert-base-uncased

Interface: Jupyter Notebook / Streamlit (for UI-based demo)

Output Format: Structured JSON + Readable text reports

🏗️ System Workflow

Transcript Input: User uploads or pastes a doctor–patient conversation.

NER Extraction: spaCy identifies entities like symptoms, treatments, and diagnoses.

Summarization: The pipeline generates a concise clinical summary.

Sentiment Analysis: Transformer-based model evaluates patient emotional state.

SOAP Generation: AI converts findings into a formal clinical note structure.

Export: Full output saved or downloaded as JSON or text.

📊 Sample Output
{
  "Patient_Name": "Ms. Jones",
  "Symptoms": ["Neck pain", "Back pain", "Head impact"],
  "Diagnosis": "Whiplash injury",
  "Treatment": ["Painkillers", "10 physiotherapy sessions"],
  "Current_Status": "Occasional backache",
  "Prognosis": "Full recovery expected within six months"
}

🧪 AI Engineering Highlights

Developed a custom medical NER pipeline combining rule-based and Transformer embeddings.

Implemented sentiment fine-tuning using small healthcare datasets (MedDialog, i2b2).

Created SOAP mapping logic using contextual keyword matching and semantic similarity scoring.

Achieved high interpretability and clinical relevance for summarization and sentiment results.

💡 Project Goal

To demonstrate how AI can support healthcare professionals by reducing documentation time, improving transcription accuracy, and enhancing patient communication insights.

🧰 Installation & Setup (VS Code / Local Machine)
# Step 1: Clone the repository
git clone https://github.com/<your-username>/physician-notetaker.git
cd physician-notetaker

# Step 2: Create and activate virtual environment
python -m venv venv
source venv/bin/activate    # (Linux/Mac)
venv\Scripts\activate       # (Windows)

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Download spaCy model
python -m spacy download en_core_web_md

# Step 5: Run the notebook or app
jupyter notebook Physician_Notetaker.ipynb
# or
streamlit run app.py

🧑‍⚕️ Use Case
Designed for AI in Healthcare Engineering — this project automates the entire process of converting unstructured physician–patient dialogues into structured medical documentation, ready for EHR systems or analytics pipelines.

Designed for AI in Healthcare Engineering — this project automates the entire process of converting unstructured physician–patient dialogues into structured medical documentation, ready for EHR systems or analytics pipelines.
