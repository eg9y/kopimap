import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-wasm";
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm";

const CLASS_NAMES = ["Food & Drinks", "Menu", "Vibes"];

let model: tf.GraphModel | null = null;
let isSetupComplete = false;

async function setupWorkerAndLoadModel() {
	if (isSetupComplete) {
		console.log(
			"Worker setup and model loading already completed. Skipping initialization.",
		);
		return;
	}

	try {
		setWasmPaths(
			"https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.21.0/dist/",
		);
		await tf.setBackend("wasm");
		await tf.ready();

		console.log(
			"WASM backend set up in worker, current backend:",
			tf.getBackend(),
		);

		const simdSupported = await tf.env().getAsync("WASM_HAS_SIMD_SUPPORT");
		console.log("SIMD supported:", simdSupported);

		model = await tf.loadGraphModel(
			"https://kopimap-cdn.b-cdn.net/ml-models/best_web_model/model.json",
			{
				requestInit: {
					mode: "cors",
					credentials: "omit",
				},
			},
		);

		if (await tf.env().getAsync("WASM_HAS_MULTITHREAD_SUPPORT")) {
			console.log("Multi-threading supported");
		} else {
			console.log("Multi-threading not supported");
		}

		isSetupComplete = true;
		console.log("Worker setup completed and model loaded successfully");
		self.postMessage({ type: "modelLoaded" });
	} catch (error) {
		console.error("Error setting up worker or loading model:", error);
		self.postMessage({ type: "setupError", error: (error as Error).message });
	}
}

async function runPrediction(imageData: ImageData) {
	if (!model) {
		throw new Error("Model not loaded");
	}

	const tensor = tf.browser
		.fromPixels(imageData)
		//
		.resizeBilinear([320, 320])
		.expandDims()
		.toFloat()
		.div(255.0);

	const predictions = (await model.predict(tensor)) as tf.Tensor;
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
	if (event.data.type === "loadModel") {
		await setupWorkerAndLoadModel();
	} else if (event.data.type === "runPrediction") {
		try {
			const prediction = await runPrediction(event.data.imageData);
			self.postMessage({ type: "predictionResult", prediction });
		} catch (error) {
			console.error("Prediction error:", error);
			self.postMessage({
				type: "predictionError",
				error: (error as Error).message,
			});
		}
	}
};
