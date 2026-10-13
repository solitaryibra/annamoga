import { pipeline } from "@huggingface/transformers";

type Incoming = { type: "transcribe"; audio: Float32Array };
let transcriberPromise: ReturnType<typeof pipeline> | null = null;

async function getTranscriber() {
  if (!transcriberPromise) {
    self.postMessage({ type: "status", message: "Downloading Whisper Tiny (first run may take a while)…" });
    transcriberPromise = pipeline("automatic-speech-recognition", "onnx-community/whisper-tiny", {
      device: "wasm",
      dtype: "q8",
      progress_callback: (p: { status?: string; progress?: number }) => {
        if (p.status === "progress" && typeof p.progress === "number") {
          self.postMessage({ type: "progress", value: Math.round(p.progress) });
        }
      },
    });
  }
  return transcriberPromise;
}

self.onmessage = async (event: MessageEvent<Incoming>) => {
  if (event.data.type !== "transcribe") return;
  try {
    const transcriber = await getTranscriber();
    self.postMessage({ type: "status", message: "Transcribing on this device…" });
    const output = await transcriber(event.data.audio, {
      task: "transcribe",
      chunk_length_s: 30,
    });
    const text = Array.isArray(output) ? output.map((x) => x.text).join(" ") : output.text;
    self.postMessage({ type: "result", text: text || "" });
  } catch (error) {
    transcriberPromise = null;
    self.postMessage({ type: "error", message: error instanceof Error ? error.message : "Whisper transcription failed." });
  }
};
