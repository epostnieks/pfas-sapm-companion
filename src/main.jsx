import { createRoot } from 'react-dom/client'

function ComingSoon() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: "#F5F0E8",
      padding: 40,
    }}>
      <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 4, marginBottom: 16 }}>
        SAPM PROGRAM
      </div>
      <div style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 42,
        fontWeight: 300,
        color: "rgba(255,255,255,0.9)",
        marginBottom: 12,
      }}>
        Coming Soon
      </div>
      <div style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.35)",
        maxWidth: 480,
        textAlign: "center",
        lineHeight: 1.7,
      }}>
        This dashboard is under active development and will be published shortly.
      </div>
      <div style={{
        marginTop: 48,
        fontSize: 10,
        color: "rgba(255,255,255,0.2)",
      }}>
        \u00a9 2026 Erik Postnieks
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<ComingSoon />)
