"use client";

import { Component, Suspense, type ErrorInfo, type ReactNode } from "react";
import Head3DViewer from "./Head3DViewer";
import MakeHumanHeadViewer from "./MakeHumanHeadViewer";
import type { FaceDesign3D } from "./Head3DViewer";

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Anna Moga head model failed to load", error, info.componentStack);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default function AnatomicalPreview({ design }: { design: FaceDesign3D }) {
  const fallback = (
    <div>
      <p role="status" style={{ fontSize: 13, color: "#7f1d1d", padding: "8px 16px" }}>
        The anatomical mesh could not load. Showing the previous 3D prototype instead.
      </p>
      <Head3DViewer design={design} />
    </div>
  );
  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={<div role="status" style={{ height: 410, display: "grid", placeItems: "center", color: "#475569" }}>Loading M01 anatomical model…</div>}>
        <MakeHumanHeadViewer design={design} />
      </Suspense>
    </ModelErrorBoundary>
  );
}
