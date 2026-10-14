"use client";

import { useEffect, useRef, useState } from "react";

type WorkerMessage =
  | { type: "status"; message: string }
  | { type: "result"; text: string }
  | { type: "error"; message: string };

export default function SpeechTestPage() {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("Record 5–20 seconds, then select Transcribe.");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const blobRef = useRef<Blob | null>(null);
  const urlRef = useRef<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      workerRef.current?.terminate();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser does not support recording. Use recent Safari or Chrome over HTTPS.");
      return;
    }
    setError("");
    setTranscript("");
    blobRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setAudioUrl(null);
    setSeconds(0);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferred = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"];
      const mime = preferred.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setError("Recording failed. Please try again.");
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (!blob.size) {
          setError("No audio captured. Check your microphone permissions.");
          return;
        }
        blobRef.current = blob;
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setAudioUrl(url);
        setStatus("Recording saved locally. Tap Transcribe to run Parakeet.");
      };
      recorder.start();
      setRecording(true);
      setStatus("Recording…");
    } catch (e) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setError(e instanceof DOMException && e.name === "NotAllowedError"
        ? "Microphone permission denied. Allow access in your browser settings."
        : "Unable to access microphone. Verify HTTPS and microphone permissions.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  async function decodeTo16kHz(blob: Blob): Promise<Float32Array> {
    const bytes = await blob.arrayBuffer();
    const context = new AudioContext();
    try {
      const decoded = await context.decodeAudioData(bytes);
      const frames = Math.ceil(decoded.duration * 16000);
      const offline = new OfflineAudioContext(1, frames, 16000);
      const source = offline.createBufferSource();
      source.buffer = decoded;
      source.connect(offline.destination);
      source.start();
      const result = await offline.startRendering();
      return new Float32Array(result.getChannelData(0));
    } finally {
      await context.close();
    }
  }

  async function transcribe() {
    if (!blobRef.current || busy) return;
    setError("");
    setTranscript("");
    setBusy(true);
    setStatus("Preparing audio…");

    try {
      const audio = await decodeTo16kHz(blobRef.current);
      if (audio.length > 16000 * 30) {
        throw new Error("Please record 30 seconds or less for this first test.");
      }
      if (!workerRef.current) {
        const worker = new Worker(new URL("./parakeet.worker.ts", import.meta.url), { type: "module" });
        worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
          const data = event.data;
          if (data.type === "status") setStatus(data.message);
          if (data.type === "result") {
            setTranscript(data.text || "(No words recognized.)");
            setStatus("Transcription complete.");
            setBusy(false);
          }
          if (data.type === "error") {
            setError(data.message);
            setStatus("Transcription failed.");
            setBusy(false);
          }
        };
        worker.onerror = (event) => {
          setError(event.message || "Parakeet worker failed to initialize.");
          setBusy(false);
          worker.terminate();
          workerRef.current = null;
        };
        workerRef.current = worker;
      }
      const backend: "webgpu" | "wasm" = "gpu" in navigator ? "webgpu" : "wasm";
      setStatus(backend === "wasm" ? "WebGPU unavailable. Trying slower WASM mode…" : "Using WebGPU acceleration…");
      workerRef.current.postMessage({ type: "transcribe", audio, backend }, [audio.buffer]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to prepare audio.");
      setBusy(false);
    }
  }

  const buttonStyle = { border: 0, borderRadius: 10, padding: "13px 18px", color: "#fff", cursor: "pointer", fontWeight: 600 } as const;

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "56px 20px 90px" }}>
      <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em" }}>ANNA MOGA / PARAKEET LAB</p>
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", margin: "14px 0" }}>Parakeet v3 speech recognition</h1>
      <p style={{ color: "#64748b", lineHeight: 1.65 }}>
        Speak in English, Polish or Ukrainian (Arabic is not supported). NVIDIA Parakeet v3 processes your
        recording inside your browser — no paid transcription API.
      </p>
      <section style={{ border: "1px solid #cbd5e1", borderRadius: 18, padding: 24, marginTop: 28 }}>
        <p aria-live="polite" style={{ marginBottom: 16 }}>{status}</p>
          <p style={{ marginBottom: 18, fontVariantNumeric: "tabular-nums" }}>{recording ? `Recording: ${seconds}s` : "Up to 30 seconds per test"}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {recording ? (
            <button type="button" style={{ ...buttonStyle, background: "#b91c1c" }} onClick={stopRecording}>Stop recording</button>
          ) : (
            <button type="button" style={{ ...buttonStyle, background: "#1d4ed8", opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={startRecording}>Start recording</button>
          )}
          <button type="button" style={{ ...buttonStyle, background: "#0f766e", opacity: !audioUrl || busy || recording ? 0.55 : 1 }}
            disabled={!audioUrl || busy || recording} onClick={transcribe}>
            {busy ? "Processing…" : "Transcribe with Parakeet"}
          </button>
        </div>
        {audioUrl && <div style={{ marginTop: 24 }}>
          <p style={{ marginBottom: 8, fontWeight: 600 }}>Your recording</p>
          <audio controls src={audioUrl} style={{ width: "100%" }} aria-label="Recorded audio" />
        </div>}
        {error && <p role="alert" style={{ color: "#b91c1c", marginTop: 18, overflowWrap: "anywhere" }}>{error}</p>}
      </section>
      <section style={{ marginTop: 22, border: "1px solid #cbd5e1", borderRadius: 18, padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Recognized text</h2>
        <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: transcript ? "inherit" : "#64748b" }}>
          {transcript || "Your transcription will appear here."}
        </p>
      </section>
      <p style={{ marginTop: 20, color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
        First use downloads a large model (potentially hundreds of MB or more). WebGPU is preferred; WASM fallback may be slow or fail on phones with limited memory.
        Audio is not sent to Anna Moga servers, although model assets are downloaded from the model host.
        For longer recordings, use short clips for now.
      </p>
    </main>
  );
}
