import { pipeline } from "@huggingface/transformers";

type Incoming = { type: "transcribe"; audio: Float32Array };
const createTranscriber = () => pipeline("automatic-speech-recognition", "onnx-community/whisper-tiny", {
  device: "wasm",
  dtype: "q8",
  progress_callback: (p: { status?: string; progress?: number }) => {
    if (p.status === "progress" && typeof p.progress === "number") {
      self.postMessage({ type: "progress", value: Math.round(p.progress) });
    }
  },
});
let transcriberPromise: ReturnType<typeof createTranscriber> | null = null;

async function getTranscriber() {
  if (!transcriberPromise) {
    self.postMessage({ type: "status", message: "Downloading Whisper Tiny (first run may take a while)…" });
    transcriberPromise = createTranscriber();
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
    const extractText = (value: unknown): string => {
      if (Array.isArray(value)) return value.map(extractText).join(" ");
      if (value && typeof value === "object" && "text" in value && typeof value.text === "string") return value.text;
      return "";
    };
    const text = extractText(output);
    self.postMessage({ type: "result", text: text || "" });
  } catch (error) {
    transcriberPromise = null;
    self.postMessage({ type: "error", message: error instanceof Error ? error.message : "Whisper transcription failed." });
  }
};
