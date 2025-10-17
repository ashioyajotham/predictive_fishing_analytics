# Predictive Fishing Analytics

Production-ready template for a sustainable fishing analytics web app. Backend is FastAPI; frontend uses TensorFlow.js and Chart.js to provide on-device predictions and visualization.

## Features

- API server with `/health`, CORS, and static site hosting
- Frontend ML using TensorFlow.js with a working prediction flow
- Trend visualization with Chart.js
- Sample dataset aligned to the domain
- Python linting/formatting via Black, isort, Flake8 (configured in `pyproject.toml`)

## Architecture

```
[User Browser]
    |
    |  HTTP (GET /)
    v
[FastAPI]  ---- serves ---->  [/frontend static files]
    |
    |  (optional future) API endpoints
    v
[Data/Models]
```

- The backend mounts the `frontend` directory at `/` to deliver the app.
- The frontend loads TensorFlow.js from CDN and runs a compact model in the browser.

## Project Structure

```
backend/
  app/
    main.py           # FastAPI app with CORS, /health, and static mount
    routers/          # (reserved for future API endpoints)
frontend/
  index.html          # UI skeleton and CDN scripts
  assets/
    css/styles.css    # Styles (dark theme)
    js/app.js         # TF.js model + prediction + chart
data/
  sample_training.json
```

## Data Schema (sample)

`data/sample_training.json` follows the structure below and matches the domain described in the proposal:

```json
{
  "records": [
    {
      "id": "unique_id",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "location": {"lat": -4.0435, "lng": 39.6682},
      "vessel_type": "dhow",
      "fishing_method": "net",
      "catch": {"total_kg": 45.5, "species": [{"name": "tuna", "kg": 30.0}]},
      "conditions": {
        "water_temp_c": 26.5,
        "tide": "high",
        "tide_height_m": 3.2,
        "moon_phase": "waxing_gibbous",
        "wind_speed_kmh": 15,
        "wind_direction": "NE",
        "wave_height_m": 1.2,
        "visibility_km": 8,
        "cloud_cover_pct": 40
      }
    }
  ]
}
```

## Frontend ML Details

- Framework: TensorFlow.js (loaded via CDN)
- File: `frontend/assets/js/app.js`
- Implementation:
  - Trains a tiny synthetic model at runtime to enable immediate offline predictions.
  - Input fields: time of day, water temperature, tide height, wind speed, wave height.
  - Output: expected catch (kg) and a simple sustainability score (0–100).
  - Chart: rolling trend of predicted catch using Chart.js.

To replace with a real model, export a trained TF.js model and load it instead of `trainSyntheticModel()`.

## API

- `GET /health` → `{ "status": "ok" }`

Example:

```bash
curl http://localhost:8000/health
```

The backend also serves the static frontend at `/`.

## Getting Started

### Prerequisites

- Python 3.13 (Windows, macOS, or Linux)

### Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000` in your browser.

### Linting and Formatting

```bash
python -m pip install black isort flake8
black .
isort .
flake8
```

## Testing (placeholder)

- Add tests under `tests/` as endpoints and logic evolve.

## Deployment

- Any ASGI host works. Example (production):
  - Build step not required; static files are in `frontend/`.
  - Run with `uvicorn backend.app.main:app --host 0.0.0.0 --port 8080`.
  - Put a reverse proxy (e.g., Nginx) in front if needed.

## License

tldr; MIT License. See [LICENSE](LICENSE) for details.


