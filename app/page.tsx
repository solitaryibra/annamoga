export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        background: "#111",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          margin: 0,
          letterSpacing: "-3px",
        }}
      >
        ANNA MOGA
      </h1>

      <p
        style={{
          fontSize: "22px",
          color: "#aaa",
          marginTop: "15px",
        }}
      >
        Turn yourself into 3D.
      </p>

      <button
        style={{
          marginTop: "30px",
          padding: "15px 30px",
          border: "none",
          background: "#d9ff3f",
          color: "#111",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Create My Figurine
      </button>

      <p
        style={{
          marginTop: "50px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        AI × 3D PRINTING · POZNAŃ, POLAND
      </p>
    </main>
  );
}
