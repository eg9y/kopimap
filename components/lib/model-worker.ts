import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

const CLASS_NAMES = ["Food & Drinks", "Menu", "Vibes"];

let model: tf.GraphModel | null = null;
let isSetupComplete = false;

async function setupWorker() {
  if (isSetupComplete) {
    console.log('Worker setup already completed. Skipping initialization.');
    return;
  }

  try {
    // Set WASM paths
    setWasmPaths('/');

    // Check for SIMD support
    const simdSupported = await tf.env().getAsync('WASM_HAS_SIMD_SUPPORT');
    console.log('SIMD supported:', simdSupported);

    // Set the backend to WASM
    await tf.setBackend('wasm');
    await tf.ready();

    // Set threads if supported
    if (await tf.env().getAsync('WASM_HAS_MULTITHREAD_SUPPORT')) {
      console.log('Multi-threading supported');
      // @ts-ignore (setThreadsCount is not in the type definitions)
      await tf.wasm.setThreadsCount(navigator.hardwareConcurrency);
    } else {
      console.log('Multi-threading not supported');
    }

    isSetupComplete = true;
    console.log('Worker setup completed');
  } catch (error) {
    console.error("Error setting up worker:", error);
    self.postMessage({ type: 'setupError', error: (error as Error).message });
  }
}

async function loadModel() {
    try {
      setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.21.0/dist/');
      await tf.setBackend('wasm');
      await tf.ready();
      console.log("WASM backend set up in worker, current backend:", tf.getBackend());
  
      // Replace this URL with the correct path to your model
      model = await tf.loadGraphModel(
        "https://map-assets.kopimap.com/last_tflite_web_model/model.json"
      );
      console.log("Model loaded successfully in worker");
      self.postMessage({ type: 'modelLoaded' });
    } catch (error) {
      console.error("Error loading the model in worker:", error);
      self.postMessage({ type: 'modelLoadError', error: (error as Error).message });
    }
  }

async function runPrediction(imageData: ImageData) {
  if (!model) {
    throw new Error("Model not loaded");
  }

  const tensor = tf.browser.fromPixels(imageData).expandDims();
  const predictions = await model.predict(tensor) as tf.Tensor;
  const probabilities = await predictions.data();
  tensor.dispose();
  predictions.dispose();

  const topPredictions = Array.from(probabilities)
    .map((prob, i) => ({ probability: prob, className: CLASS_NAMES[i] }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);

  return topPredictions;
}

self.onmessage = async (event: MessageEvent) => {
  if (event.data.type === 'loadModel') {
    await loadModel();
  } else if (event.data.type === 'runPrediction') {
    try {
      const prediction = await runPrediction(event.data.imageData);
      self.postMessage({ type: 'predictionResult', prediction });
    } catch (error) {
      console.error("Prediction error:", error);
      self.postMessage({ type: 'predictionError', error: (error as Error).message });
    }
  }
};
