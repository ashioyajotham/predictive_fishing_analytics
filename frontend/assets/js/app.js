/*
  Minimal predictive model placeholder using TensorFlow.js.
  This uses a tiny network trained on synthetic data at load-time so the UI works offline.
  In a production scenario, replace trainSyntheticModel with loading a saved model and real preprocessing.
*/

const state = {
  model: null,
  chart: null,
};

function normalizeInputs(inputs) {
  // Very simple scaling to [0,1] ranges based on reasonable bounds
  const time = inputs.timeOfDay / 23;
  const water = inputs.waterTemp / 35; // 0-35°C
  const tide = inputs.tideHeight / 5; // 0-5 m
  const wind = inputs.windSpeed / 60; // 0-60 km/h
  const wave = inputs.waveHeight / 5; // 0-5 m
  return [time, water, tide, wind, wave];
}

async function trainSyntheticModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [5], units: 16, activation: "relu" }),
      tf.layers.dense({ units: 8, activation: "relu" }),
      tf.layers.dense({ units: 2, activation: "linear" }), // [catchKg, sustainability]
    ],
  });

  model.compile({ optimizer: tf.train.adam(0.01), loss: "meanSquaredError" });

  // Generate synthetic samples (not realistic; placeholder for demo)
  const NUM = 512;
  const xs = [];
  const ys = [];
  for (let i = 0; i < NUM; i++) {
    const input = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    const [time, water, tide, wind, wave] = input;
    // Heuristic synthetic target: more catch with moderate wind, moderate wave, warmer water
    const catchKg = 80 * water + 20 * (1 - Math.abs(0.5 - wind) * 2) + 10 * (1 - wave) + 10 * tide + 5 * time;
    // Sustainability favors lower wind/wave and moderate tide
    const sustain = 100 * (0.6 * (1 - wind) + 0.3 * (1 - wave) + 0.1 * tide);
    xs.push(input);
    ys.push([catchKg / 150, sustain / 100]); // scale to ~[0,1]
  }

  const x = tf.tensor2d(xs);
  const y = tf.tensor2d(ys);
  await model.fit(x, y, { epochs: 30, batchSize: 32, verbose: 0 });
  x.dispose();
  y.dispose();
  return model;
}

function updateChart(chart, value) {
  const now = new Date().toLocaleTimeString();
  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(value);
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

function createTrendChart(ctx) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Predicted Catch (kg)",
          data: [],
          borderColor: "#2bb0ed",
          backgroundColor: "rgba(43,176,237,0.15)",
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { display: false },
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { labels: { color: "#e6edf3" } },
      },
    },
  });
}

async function predictFromForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const inputs = {
    timeOfDay: Number(formData.get("timeOfDay")),
    waterTemp: Number(formData.get("waterTemp")),
    tideHeight: Number(formData.get("tideHeight")),
    windSpeed: Number(formData.get("windSpeed")),
    waveHeight: Number(formData.get("waveHeight")),
  };

  const x = tf.tensor2d([normalizeInputs(inputs)]);
  const pred = state.model.predict(x);
  const [catchScaled, sustainScaled] = await pred.data();
  x.dispose();
  pred.dispose();

  const catchKg = Math.max(0, Math.round(catchScaled * 150));
  const sustain = Math.min(100, Math.max(0, Math.round(sustainScaled * 100)));
  document.getElementById("predCatch").textContent = String(catchKg);
  document.getElementById("sustainability").textContent = String(sustain);
  updateChart(state.chart, catchKg);
}

function resetForm() {
  document.getElementById("conditions-form").reset();
  document.getElementById("predCatch").textContent = "-";
  document.getElementById("sustainability").textContent = "-";
}

async function init() {
  const ctx = document.getElementById("trendChart");
  state.chart = createTrendChart(ctx);
  state.model = await trainSyntheticModel();
  document.getElementById("conditions-form").addEventListener("submit", predictFromForm);
  document.getElementById("resetBtn").addEventListener("click", resetForm);
}

window.addEventListener("DOMContentLoaded", init);


