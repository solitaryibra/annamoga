"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const VitruvianPreview = dynamic(() => import("../../components/VitruvianPreview"), { ssr: false });
const M01RebuiltViewer = dynamic(() => import("../../components/M01RebuiltViewer"), { ssr: false });
const Head3DViewer = dynamic(() => import("../../components/Head3DViewer"), { ssr: false });
const AnatomicalPreview = dynamic(() => import("../../components/AnatomicalPreview"), { ssr: false });

type Preset = { id: string; name: string; group: string; face: number; jaw: number; chin: number; nose: number; eyes: number };
const presets: Preset[] = [
  { id: "M01", name: "Oval", group: "Masculine", face: 50, jaw: 45, chin: 50, nose: 52, eyes: 50 },
  { id: "M02", name: "Square", group: "Masculine", face: 73, jaw: 80, chin: 66, nose: 57, eyes: 48 },
  { id: "M03", name: "Long", group: "Masculine", face: 35, jaw: 42, chin: 55, nose: 60, eyes: 50 },
  { id: "F01", name: "Oval", group: "Feminine", face: 47, jaw: 35, chin: 43, nose: 45, eyes: 55 },
  { id: "F02", name: "Heart", group: "Feminine", face: 64, jaw: 25, chin: 28, nose: 42, eyes: 58 },
  { id: "F03", name: "Round", group: "Feminine", face: 72, jaw: 46, chin: 48, nose: 45, eyes: 55 },
];
const skins = ["#f1d5c1", "#e8bda1", "#d9a17c", "#bb815f", "#9b674b", "#754a36", "#563726", "#37251e"];
type Design = { preset: string; face: number; jaw: number; chin: number; nose: number; eyes: number; skin: string };
const initial: Design = { ...presets[0], preset: "M01", skin: skins[2] };
function fromPreset(p: Preset, skin: string): Design {
  return { preset: p.id, face: p.face, jaw: p.jaw, chin: p.chin, nose: p.nose, eyes: p.eyes, skin };
}
export default function CustomizationPage() {
  const [design, setDesign] = useState<Design>(initial);
  const [saved, setSaved] = useState(false);
  const [viewer, setViewer] = useState<"vitruvian" | "rebuilt" | "anatomical" | "prototype">("vitruvian");
  const [tab, setTab] = useState<"shape" | "skin">("shape");
  useEffect(() => {
    try {
      const s = localStorage.getItem("annamoga-face-draft");
      if (!s) return;
      const d = JSON.parse(s) as Design;
      if (presets.some((p) => p.id === d.preset) && skins.includes(d.skin) &&
        ["face", "jaw", "chin", "nose", "eyes"].every((k) => typeof d[k as keyof Design] === "number")) setDesign(d);
    } catch { /* Ignore invalid drafts */ }
  }, []);
  function change<K extends keyof Design>(key: K, value: Design[K]) {
    setDesign((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }
  function save() {
    try {
      localStorage.setItem("annamoga-face-draft", JSON.stringify(design));
      setSaved(true);
    } catch { setSaved(false); }
  }
  const slider = (key: "face" | "jaw" | "chin" | "nose" | "eyes", label: string) => (
    <label key={key} style={{ display: "block", marginBottom: 18, fontSize: 14 }}>
      <span style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
        <span>{label}</span><strong>{design[key]}%</strong>
      </span>
      <input aria-label={label} style={{ width: "100%", accentColor: "#2563eb" }}
        type="range" min="0" max="100" step="1" value={design[key]}
        onChange={(e) => change(key, Number(e.target.value))} />
    </label>
  );
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 18px 90px" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: ".15em" }}>ANNA MOGA / STUDIO</p>
      <h1 style={{ margin: "12px 0", fontSize: "clamp(2rem, 5vw, 3.3rem)", fontWeight: 750 }}>Customize your character</h1>
      <p style={{ color: "#64748b", maxWidth: 680, lineHeight: 1.65 }}>Choose a semi-realistic head preset, then refine the face and skin. Clothing and poses will follow in later versions.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "24px 0" }}>
        {["01 · Face & skin", "02 · Clothing (later)", "03 · Pose (later)"].map((x, i) => (
          <span key={x} style={{ border: "1px solid #cbd5e1", borderRadius: 30, padding: "9px 14px", fontSize: 12, opacity: i === 0 ? 1 : .55, fontWeight: i === 0 ? 700 : 400 }}>{x}</span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: 26, alignItems: "start" }}>
        <section style={{ border: "1px solid #cbd5e1", borderRadius: 20, overflow: "hidden", background: "#f3f5f8" }}>
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <strong>3D face preview</strong><span style={{ fontSize: 12, color: "#475569" }}>Vitruvian · CC0 trial</span>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "0 16px 8px", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setViewer("vitruvian")} aria-pressed={viewer === "vitruvian"} style={{ borderRadius: 9, padding: "8px 12px", cursor: "pointer", border: viewer === "vitruvian" ? "2px solid #2563eb" : "1px solid #94a3b8", color: "#1e293b", background: viewer === "vitruvian" ? "#dbeafe" : "white" }}>Vitruvian trial</button>
            <button type="button" onClick={() => setViewer("rebuilt")} aria-pressed={viewer === "rebuilt"} style={{ borderRadius: 9, padding: "8px 12px", cursor: "pointer", border: viewer === "rebuilt" ? "2px solid #2563eb" : "1px solid #94a3b8", color: "#1e293b", background: viewer === "rebuilt" ? "#dbeafe" : "white" }}>New M01</button>
            <button type="button" onClick={() => setViewer("anatomical")} aria-pressed={viewer === "anatomical"} style={{ borderRadius: 9, padding: "8px 12px", cursor: "pointer", border: viewer === "anatomical" ? "2px solid #2563eb" : "1px solid #94a3b8", color: "#1e293b", background: viewer === "anatomical" ? "#dbeafe" : "white" }}>Anatomical mesh</button>
            <button type="button" onClick={() => setViewer("prototype")} aria-pressed={viewer === "prototype"} style={{ borderRadius: 9, padding: "8px 12px", cursor: "pointer", border: viewer === "prototype" ? "2px solid #2563eb" : "1px solid #94a3b8", color: "#1e293b", background: viewer === "prototype" ? "#dbeafe" : "white" }}>Previous prototype</button>
          </div>
          <div style={{ padding: 14 }}>{viewer === "vitruvian" ? <VitruvianPreview design={design}/> : viewer === "rebuilt" ? <M01RebuiltViewer design={design}/> : viewer === "anatomical" ? <AnatomicalPreview design={design}/> : <Head3DViewer design={design}/>}</div>
          <div style={{ padding: "14px 20px", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>Drag to rotate, pinch or scroll to zoom. Vitruvian trial loads an external CC0 GLB. Rotation and zoom work; facial shape sliders do not yet change the Vitruvian mesh. Select New M01 for working prototype sliders.</div>
        </section>
        <section style={{ border: "1px solid #cbd5e1", borderRadius: 20, padding: 22 }}>
          <h2 style={{ fontSize: 21, fontWeight: 700, marginBottom: 15 }}>Choose a head preset</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
            {presets.map((p) => <button type="button" key={p.id}
              aria-pressed={design.preset === p.id}
              onClick={() => { setDesign(fromPreset(p, design.skin)); setSaved(false); }}
              style={{ padding: "14px 6px", textAlign: "center", borderRadius: 11, cursor: "pointer", background: design.preset === p.id ? "#dbeafe" : "transparent", border: design.preset === p.id ? "2px solid #2563eb" : "1px solid #cbd5e1", color: "inherit" }}>
              <strong style={{ display: "block", fontSize: 14 }}>{p.id}</strong>
              <span style={{ display: "block", fontSize: 12 }}>{p.name}</span>
              <span style={{ display: "block", fontSize: 10, opacity: .65 }}>{p.group}</span>
            </button>)}
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 10, borderBottom: "1px solid #cbd5e1", paddingBottom: 10 }}>
            <button type="button" onClick={() => setTab("shape")} aria-pressed={tab === "shape"} style={{ background: "none", border: 0, fontWeight: tab === "shape" ? 700 : 400, color: tab === "shape" ? "#2563eb" : "inherit", cursor: "pointer" }}>Facial proportions</button>
            <button type="button" onClick={() => setTab("skin")} aria-pressed={tab === "skin"} style={{ background: "none", border: 0, fontWeight: tab === "skin" ? 700 : 400, color: tab === "skin" ? "#2563eb" : "inherit", cursor: "pointer" }}>Skin tones</button>
          </div>
          <div style={{ paddingTop: 20 }}>
            {tab === "shape" ? <>
              {slider("face", "Face width")}
              {slider("jaw", "Jaw width")}
              {slider("chin", "Chin width")}
              {slider("nose", "Nose width")}
              {slider("eyes", "Eye spacing")}
            </> : <>
              <p style={{ fontSize: 14, marginBottom: 14 }}>Select a skin tone</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {skins.map((s) => <button type="button" key={s} aria-label={`Skin tone ${s}`} aria-pressed={design.skin === s}
                  onClick={() => change("skin", s)} style={{ width: 40, height: 40, borderRadius: "50%", cursor: "pointer", background: s, border: design.skin === s ? "3px solid #2563eb" : "1px solid #64748b", outline: design.skin === s ? "2px solid white" : "none" }}/>)}
              </div>
            </>}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            <button type="button" onClick={save} style={{ background: "#2563eb", border: 0, color: "white", padding: "13px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>Save draft on this device</button>
            <button type="button" onClick={() => { setDesign(initial); setSaved(false); }} style={{ background: "transparent", border: "1px solid #94a3b8", color: "inherit", padding: "13px 20px", borderRadius: 10, cursor: "pointer" }}>Reset</button>
          </div>
          <p role="status" style={{ minHeight: 24, marginTop: 12, fontSize: 12, color: "#475569" }}>{saved ? "Draft saved in this browser. It is not yet linked to your account." : "Changes appear immediately in the preview."}</p>
        </section>
      </div>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginTop: 22 }}>Vitruvian is a trial of a more anatomical 3D head from the open-source VitruvianGodot project. The model currently loads from a public CDN, not Anna Moga storage. Existing facial sliders do not alter this imported GLB yet; mapping blendshapes and validating the model for production remain future work.</p>
    </main>
  );
}
