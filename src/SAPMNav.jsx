import { useState } from "react";

const SITES = [
  { title: "Program Hub (PPT)", url: "https://ppt-companion.vercel.app", beta: null, highlight: true },
  { title: "C-Adjusted GDP", url: "https://c-adjusted-gdp.vercel.app", beta: null, highlight: true },
  { title: "PFAS / Forever Chemicals", url: "https://pfas-sapm-companion.vercel.app", beta: 35.2 },
  { title: "Gene Drive Deployment", url: "https://sapm-gene-drives.vercel.app", beta: 12.4 },
  { title: "Opioid Ecosystem", url: "https://sapm-opioids.vercel.app", beta: 10.2 },
  { title: "Industrial Monoculture", url: "https://monoculture-sapm-companion.vercel.app", beta: 8.6 },
  { title: "Commercial Real Estate", url: "https://sapm-cre-urban-hollowing.vercel.app", beta: 8.4 },
  { title: "Persistent Organic Pollutants", url: "https://sapm-pops-beyond-pfas.vercel.app", beta: 8.4 },
  { title: "Big Tech Platform Monopoly", url: "https://sapm-big-tech-platform-monopoly.vercel.app", beta: 7.4 },
  { title: "Hollow Win Theorem", url: "https://hw-companion.vercel.app", beta: null },
  { title: "Tobacco", url: "https://sapm-tobacco.vercel.app", beta: 6.5 },
  { title: "Student Loan Securitization", url: "https://sapm-student-loans-forprofit.vercel.app", beta: 6.3 },
  { title: "Commercial Gambling", url: "https://sapm-gambling.vercel.app", beta: 6.3 },
  { title: "Pharmacy Benefit Mgmt", url: "https://sapm-pbm-rebate.vercel.app", beta: 6.3 },
  { title: "Oil & Gas Extraction", url: "https://sapm-oil-gas.vercel.app", beta: 6.2 },
  { title: "Palm Oil", url: "https://sapm-palm-oil.vercel.app", beta: 6.2 },
  { title: "Ultra-Processed Food", url: "https://sapm-upf-full.vercel.app", beta: 6.2 },
  { title: "UPF Impossibility Frontier", url: "https://sapm-upf-no-impossibility.vercel.app", beta: null },
  { title: "Global Coal Combustion", url: "https://sapm-coal.vercel.app", beta: 6.1 },
  { title: "Bitcoin PoW", url: "https://bitcoin-sapm-companion.vercel.app", beta: 5.0 },
  { title: "Proof of Stake Protocols", url: "https://pos-sapm-companion.vercel.app", beta: null },
  { title: "Global Fisheries", url: "https://sapm-fisheries-no-impossibility.vercel.app", beta: 4.72 },
  { title: "Deep-Sea Mining", url: "https://sapm-dsm-abyssal-recovery-floor.vercel.app", beta: 4.7 },
  { title: "Aviation Emissions", url: "https://sapm-aviation-emissions.vercel.app", beta: 4.6 },
  { title: "Topsoil Erosion", url: "https://sapm-topsoil-erosion.vercel.app", beta: 4.3 },
  { title: "Algorithmic Pricing", url: "https://sapm-algorithmic-pricing.vercel.app", beta: 4.2 },
  { title: "Gig Economy Platforms", url: "https://sapm-gig-economy.vercel.app", beta: 4.2 },
  { title: "Water Privatization", url: "https://sapm-water-privatization.vercel.app", beta: 4.2 },
  { title: "WMD Capability Diffusion", url: "https://sapm-wmd-capability-diffusion-ceili.vercel.app", beta: 3.0 },
  { title: "International Arms Exports", url: "https://sapm-arms-exports.vercel.app", beta: 2.4 },
  { title: "Orbital Debris & LEO", url: "https://sapm-orbital-debris.vercel.app", beta: null },
  { title: "Cement Calcination", url: "https://sapm-cement-calcination-floor.vercel.app", beta: 1.35 },
  { title: "Nuclear Fission", url: "https://nuclear-sapm-companion.vercel.app", beta: 0.53 },
];

const bc = (b) => {
  if (b === null) return "#667";
  if (b >= 10) return "#DC2626";
  if (b >= 6) return "#E85D3A";
  if (b >= 4) return "#F59E0B";
  if (b >= 2) return "#3B82F6";
  return "#059669";
};

export default function SAPMNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 9999,
          width: 48, height: 48, borderRadius: "50%",
          background: open ? "#F59E0B" : "rgba(245,158,11,0.15)",
          border: "1px solid rgba(245,158,11,0.3)",
          color: open ? "#0A0A0F" : "#F59E0B",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", letterSpacing: 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#F59E0B"; e.currentTarget.style.color = "#0A0A0F"; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = "rgba(245,158,11,0.15)"; e.currentTarget.style.color = "#F59E0B"; }}}
      >
        {open ? "✕" : "≡"}
      </button>

      {open && (
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 380, zIndex: 9998,
          background: "#0A0A0F", borderLeft: "1px solid rgba(245,158,11,0.15)",
          overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}>
          <div style={{ padding: "24px 20px 12px" }}>
            <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3, marginBottom: 8 }}>SAPM PROGRAM</div>
            <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 18, color: "rgba(255,255,255,0.9)", fontWeight: 300 }}>
              All Dashboards
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
              Postnieks Impossibility Program · 2025–2026
            </div>
          </div>

          <div style={{ padding: "8px 0" }}>
            {SITES.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 20px", textDecoration: "none",
                  borderLeft: s.highlight ? "3px solid #F59E0B" : "3px solid transparent",
                  background: s.highlight ? "rgba(245,158,11,0.04)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = s.highlight ? "rgba(245,158,11,0.04)" : "transparent"}
              >
                {s.beta !== null && (
                  <span style={{ fontSize: 10, color: bc(s.beta), width: 32, flexShrink: 0, textAlign: "right" }}>
                    {s.beta}
                  </span>
                )}
                {s.beta === null && (
                  <span style={{ width: 32, flexShrink: 0 }} />
                )}
                <span style={{
                  fontSize: 11, color: s.highlight ? "#F59E0B" : "rgba(255,255,255,0.65)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {s.title}
                </span>
              </a>
            ))}
          </div>

          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              © 2026 Erik Postnieks
            </div>
          </div>
        </div>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 380, bottom: 0,
            background: "rgba(0,0,0,0.3)", zIndex: 9997,
          }}
        />
      )}
    </>
  );
}
