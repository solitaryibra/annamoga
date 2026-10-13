import { fromHub } from "parakeet.js";

type Request = { type: "transcribe"; audio: Float32Array; backend: "webgpu" | "wasm" };
let loaded: Awaited<ReturnType<typeof fromHub>> | null = null;
let loadedBackend: "webgpu" | "wasm" | null = null;

self.onmessage = async (event: MessageEvent<Request>) => {
  if (event.data.type !== "transcribe") return;
  try {
    const { audio, backend } = event.data;
    if (!loaded || loadedBackend !== backend) {
      self.postMessage({ type: "status", message: "Loading Parakeet v3 model. This is a large download; allow time and memory…" });
      loaded = await fromHub("parakeet-tdt-0.6b-v3", {
        backend,
        encoderQuant: backend === "wasm" ? "int8" : "fp32",
        decoderQuant: "int8",
        preprocessorBackend: "js",
      });
      loadedBackend = backend;
    }
    self.postMessage({ type: "status", message: "Transcribing locally with Parakeet…" });
    const result = await loaded.transcribe(audio, 16000);
    self.postMessage({ type: "result", text: result.utterance_text || "" });
  } catch (error) {
    loaded = null;
    loadedBackend = null;
    self.postMessage({ type: "error", message: error instanceof Error ? error.message : "Parakeet failed to initialize or transcribe." });
  }
};
