"use client";

import { useEffect, useRef, useState } from "react";

export default function SpeechTestPage() {
  const [status, setStatus] = useState<"idle" | "recording" | "ready" | "error">("idle");
  const [message, setMessage] = useState("Record a short sample to test your phone microphone.");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  useEffect(() => {
    if (status !== "recording") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("error");
      setMessage("Your browser does not support microphone recording. Try an updated Safari or Chrome browser over HTTPS.");
      return;
    }
    try {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setAudioUrl(null);
      setSeconds(0);
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferredTypes = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"];
      const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        setStatus("error");
        setMessage("Recording failed. Please try again.");
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size === 0) {
          setStatus("error");
          setMessage("No audio was captured. Check microphone permissions.");
          return;
        }
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setAudioUrl(url);
        setStatus("ready");
        setMessage("Recording complete. Play it back to check your microphone.");
      };
      recorder.start();
      setStatus("recording");
      setMessage("Recording locally on your device…");
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setStatus("error");
      setMessage(error instanceof DOMException && error.name === "NotAllowedError"
        ? "Microphone permission was denied. Enable it in your browser settings and try again."
        : "Could not access the microphone. Check browser permissions and HTTPS.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "64px 20px 96px", minHeight: "70vh" }}>
      <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em" }}>ANNA MOGA / LAB</p>
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 700, margin: "14px 0" }}>Speech recognition test</h1>
      <p style={{ color: "#64748b", lineHeight: 1.65 }}>
        Step 1: Verify microphone access and audio playback on your phone.
        Whisper transcription will be added next.
      </p>
      <section style={{ marginTop: 32, padding: 24, border: "1px solid #cbd5e1", borderRadius: 18 }}>
        <p aria-live="polite" style={{ marginBottom: 20 }}>{message}</p>
        <p style={{ marginBottom: 20, fontVariantNumeric: "tabular-nums" }}>
          {status === "recording" ? `● Recording: ${seconds}s` : "Microphone test"}
        </p>
        {status === "recording" ? (
          <button type="button" onClick={stopRecording} style={{ background: "#b91c1c", color: "white", padding: "14px 22px", border: 0, borderRadius: 10, cursor: "pointer" }}>
            Stop recording
          </button>
        ) : (
          <button type="button" onClick={startRecording} style={{ background: "#1d4ed8", color: "white", padding: "14px 22px", border: 0, borderRadius: 10, cursor: "pointer" }}>
            Start recording
          </button>
        )}
        {audioUrl && (
          <div style={{ marginTop: 24 }}>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>Playback</p>
            <audio controls src={audioUrl} style={{ width: "100%" }} aria-label="Recorded audio playback" />
          </div>
        )}
      </section>
      <p style={{ marginTop: 22, color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
        Audio stays in this browser tab and is not uploaded. The page requires HTTPS and microphone permission.
        This is a recording test, not speech transcription yet.
      </p>
    </main>
  );
}
