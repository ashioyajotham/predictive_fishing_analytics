# Predictive Fishing Analytics

Practical, end-to-end template for a sustainable fishing analytics web app. It includes a FastAPI backend that serves a static frontend powered by TensorFlow.js and Chart.js.

## Features

- API with health check and CORS
- Static frontend with a minimal TF.js model and trend chart
- Sample dataset to align with the domain
- Python linting and formatting via Black, isort, and Flake8

## Project Structure

```
backend/
  app/
    main.py
    routers/
frontend/
  index.html
  assets/
    css/styles.css
    js/app.js
data/
  sample_training.json
``` 

## Getting Started

### Prerequisites

- Python 3.13 (virtual environment recommended)

### Setup

```bash
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open `http://localhost:8000/` to view the app. The backend serves the frontend as static files.

### Linting and Formatting

```bash
python -m pip install black isort flake8
black .
isort .
flake8
```

## Notes on the Model

The current frontend trains a tiny synthetic model at runtime so the UI works out-of-the-box and offline. Replace this with a saved model and real preprocessing for production.

## License

MIT


