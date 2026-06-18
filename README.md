# LingoLift - AI-Powered Language Learning Partner

LingoLift is a modern, responsive, and premium web application designed to act as an interactive English tutor. Users can improve grammar, translate between languages, practice English conversation, find synonyms & antonyms, learn advanced vocabulary, and get pronunciation assistance.

---

## 🌟 Key Features

1. **Vocabulary Learning**: Interactive vocabulary coaching with pronunciation, definitions, parts of speech, usage tips, and memory tricks.
2. **Grammar Correction**: Detailed correction rules, explaining errors, and providing natural alternative sentence forms.
3. **Translation Services**: Preserves original tone and context while translating, listing explanations and idioms.
4. **Daily Communication Phrases**: Industry and context-specific communication cheat-sheets (workplace, travel, etc.).
5. **Conversation Practice**: Simulates realistic topic-based chats, giving constructive feedback on user prompts.
6. **Pronunciation Guidance**: syllable breakdown and phonetic reading support.
7. **Synonyms & Antonyms**: Vocabulary expansions comparing differences in tone and contextual usages.
8. **Word of the Day**: Prompts a fresh daily word challenge with memory tricks.
9. **Out-of-Domain Guard**: Gracefully blocks unrelated requests (sports, programming, stock advice) and keeps the focus on language learning.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React.js (Vite template)
* **Styling**: Vanilla CSS (HIG Clean Apple Developer inspired style)
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Networking**: Axios (configured with fallbacks and timeout safeguards)

### Backend
* **Framework**: FastAPI (Python 3.10+)
* **LLM Engine**: Groq API client (`llama-3.3-70b-versatile`)
* **Environment**: python-dotenv for secrets handling

---

## 📁 Folder Structure

```
AI-CHAT BOT/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChatDemo.jsx
│   │   │   ├── ChatDemo.css
│   │   │   ├── FeaturesGrid.jsx
│   │   │   ├── FeaturesGrid.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   ├── Hero.jsx
│   │   │   ├── Hero.css
│   │   │   └── ProjectDescription.jsx
│   │   │   └── ProjectDescription.css
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx
│   │   │   └── ChatPage.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
└── backend/
    ├── app/
    │   ├── config/
    │   │   └── config.py
    │   ├── models/
    │   │   └── schemas.py
    │   ├── prompts/
    │   │   ├── master_prompt.py
    │   │   └── ... (individual prompt files)
    │   ├── services/
    │   │   ├── chatbot.py
    │   │   ├── classifier.py
    │   │   └── llm_service.py
    │   └── main.py
    ├── main.py (bridge entrypoint wrapper)
    └── .env
```

---

## 🚀 Installation & Local Setup

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside `backend/` and configure your API key:
   ```env
   GROQ_API_KEY=your_groq_api_token_here
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will boot up at `http://127.0.0.1:8000`.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `frontend/` and configure the backend endpoint URL:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend application will boot up at `http://localhost:5173`.*

---

## 🛡️ Security & Performance Enhancements

* **Exposed Secrets**: Avoided hardcoded values by moving all endpoint keys and Groq API tokens to `.env` files.
* **API Timeout Protection**: Configured a `10000ms` call timeout inside [api.js](frontend/src/services/api.js) so that network requests do not hang indefinitely.
* **Graceful Failure Fallbacks**: Implemented frontend try-catch blocks returning custom states so the React app remains online even if backend connections fail.
* **Responsive Refinements**: Added root constraints `max-width: 100%` and `overflow-x: hidden` to avoid viewport layout horizontal shifting.

---

## 🎓 Internship Compliance Checklist

* **[x] Header with Chatbot Name**: Included clean `LingoLift` branding.
* **[x] Project Description**: Detailed core mission text in a beautiful card component.
* **[x] Working Chat Interface**: Real-time chat console styled with Apple HIG aesthetics.
* **[x] Example Questions**: Clickable preset questions with ripple feedback animations.
* **[x] Out-of-Domain Block**: LLM-level classifier routing off-topic prompts to a standardized help string.
* **[x] Symmetric Responsiveness**: Responsive layout adapting to Mobile, Tablet, Laptop, and Wide Desktop devices.
