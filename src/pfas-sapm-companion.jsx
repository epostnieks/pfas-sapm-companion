import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, LineChart, Line, AreaChart, Area, CartesianGrid, Legend, ReferenceLine, Label } from "recharts";

// ══════════════════════════════════════════════════════════════
// PFAS SAPM Companion — Replication & Visualization Dashboard
// Postnieks (2026c) Working Paper
// ══════════════════════════════════════════════════════════════

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500;600&display=swap');`;

// === EMBEDDED DATA ===

const CHANNEL_DATA = [
  { name: "Water Remediation", shortName: "Water", beta: 0.49, weight: 0.05, welfare: 4.8, payoff: 9.8, color: "#D4A843", severity: "LATENT", icon: "💧", note: "EPA NPDWR 4.0 ppt MCL; $140–$170B total liability" },
  { name: "Healthcare & Endocrine", shortName: "Health", beta: 8.4, weight: 0.48, welfare: 1563, payoff: 186.7, color: "#E85D3A", severity: "ACUTE", icon: "🏥", note: "Lancet $1.5T (3 chemicals, 38 countries); cross-validated WHO/OECD/Nordic" },
  { name: "Agricultural Contamination", shortName: "Agri", beta: 0.26, weight: 0.12, welfare: 20, payoff: 76.8, color: "#6B8E23", severity: "STRUCTURAL", icon: "🌾", note: "70M acres contaminated via biosolids; 20–30% property devaluation" },
  { name: "Bioaccumulation", shortName: "Bio", beta: 471, weight: 0, welfare: 88000, payoff: 186.7, color: "#8B5CF6", severity: "EXCLUDED", icon: "🧬", note: "Structural bound only; 100% placentas positive; brain MPs +50% in 8 yrs" },
  { name: "Regulatory Transition", shortName: "Reg", beta: 0.07, weight: 0.03, welfare: 12.5, payoff: 186.7, color: "#D4A843", severity: "LATENT", icon: "⚖️", note: "TSCA $843M; REACH 74 derogations; DOD $9.3B FY2025+" },
  { name: "Environmental Release", shortName: "Release", beta: 35.2, weight: 0.32, welfare: 6580, payoff: 186.7, color: "#DC2626", severity: "SEVERE", icon: "🏭", note: "Aggregate operational β; 475 Mt/yr plastic production" },
];

const OPERATIONAL_CHANNELS = CHANNEL_DATA.filter(c => c.weight > 0);

const PERSISTENCE_PREMIUM = [
  { sector: "Synthetic Textiles", revenue: 76.0, premium: 60.8, ratio: 80, color: "#E85D3A" },
  { sector: "Single-Use Plastic", revenue: 250.0, premium: 75.0, ratio: 30, color: "#DC2626" },
  { sector: "Cosmetics", revenue: 58.0, premium: 17.4, ratio: 30, color: "#D4A843" },
  { sector: "Semiconductor Chem.", revenue: 14.9, premium: 14.9, ratio: 100, color: "#D4A843" },
  { sector: "Fluoropolymer Mfg.", revenue: 10.5, premium: 9.8, ratio: 93, color: "#6B8E23" },
  { sector: "Tire Additives", revenue: 5.8, premium: 5.2, ratio: 90, color: "#8B5CF6" },
  { sector: "Food Packaging", revenue: 40.4, premium: 1.8, ratio: 4, color: "#9CA3AF" },
  { sector: "POPs", revenue: 1.5, premium: 1.4, ratio: 93, color: "#4B5563" },
  { sector: "AFFF Foam", revenue: 1.0, premium: 0.4, ratio: 40, color: "#374151" },
];

const CROSS_DOMAIN = [
  { name: "Bitcoin", beta: 5.0, ci: [3.7, 5.2], sap: -33, mu: 0.56, type: "Fast Hollow Win", reversibility: "Partial", tStar: "Years", color: "#F59E0B" },
  { name: "Mol. Persistence", beta: 35.2, ci: [28.4, 42.1], sap: -6400, mu: 0.028, type: "Slow Hollow Win", reversibility: "Irreversible", tStar: "Decades–Centuries", color: "#DC2626" },
  { name: "Ethereum", beta: 2.4, ci: null, sap: -11, mu: 0.42, type: "Moderate HW", reversibility: "Largely reversed", tStar: "Months", color: "#8B5CF6" },
  { name: "VW Dieselgate", beta: 6.8, ci: null, sap: null, mu: 0.31, type: "Fast HW (resolved)", reversibility: "Resolved", tStar: "Years", color: "#6B8E23" },
  { name: "ERCOT 2021", beta: 2053, ci: null, sap: null, mu: 0.001, type: "Catastrophic HW", reversibility: "Fully reversed", tStar: "Days", color: "#D4A843" },
];

const THRESHOLDS = [
  { domain: "Blood Microplastics", tStar: 2025, confidence: "Very Low", status: "Likely crossed", color: "#DC2626" },
  { domain: "U.S. Water (Detection)", tStar: 2030, confidence: "Low", status: "45% positive", color: "#E85D3A" },
  { domain: "U.S. Water (MCL)", tStar: 2055, confidence: "Low", status: "~8% above", color: "#D4A843" },
  { domain: "PFAS Remediation", tStar: 2075, confidence: "Low–Very Low", status: "Nascent", color: "#F59E0B" },
  { domain: "Semiconductor Mfg.", tStar: 2055, confidence: "Low", status: "Rising background", color: "#D4A843" },
  { domain: "Ocean MPs (Regional)", tStar: 2075, confidence: "Very Low", status: "2× baseline", color: "#6B8E23" },
  { domain: "Ocean MPs (Global PNR)", tStar: 2100, confidence: "Very Low", status: "Hotspots 100×", color: "#8B5CF6" },
];

const BIFURCATION = {
  contained: { revenue: 7.36, beta: 2.5, sectors: "Semiconductors, medical devices, aerospace, lab equipment", capture: ">99%", regulation: "Strict containment; EU REACH 13.5–20 yr derogation" },
  openRelease: { revenue: 13.65, beta: 50, sectors: "Textiles, food packaging, AFFF, cosmetics", capture: "~0%", regulation: "Ban; require non-fluorinated alternatives" },
};

const SENSITIVITY = [
  { baseline: "$7.4B", gap: "$179.3B", margBeta: 73.5, welfareBeta: 36.8, classification: "Slow HW ✓" },
  { baseline: "$25B", gap: "$161.7B", margBeta: 81.5, welfareBeta: 35.2, classification: "Slow HW ✓" },
  { baseline: "$35B", gap: "$151.7B", margBeta: 86.9, welfareBeta: 43.5, classification: "Slow HW ✓" },
  { baseline: "$50B", gap: "$136.7B", margBeta: 96.6, welfareBeta: 48.3, classification: "Slow HW ✓" },
];

const DISAGGREGATION = [
  { cls: "PFAS", betaRange: "6–8", welfare: "~$270B/yr", dominant: "Water + PFAS healthcare", color: "#D4A843" },
  { cls: "Microplastics", betaRange: "28–32", welfare: "~$5,800B/yr", dominant: "Lancet healthcare + release", color: "#E85D3A" },
  { cls: "POPs", betaRange: "2–4", welfare: "~$510B/yr", dominant: "Stockholm Convention legacy", color: "#6B8E23" },
];

// === HELPER COMPONENTS ===

function Stat({ label, value, sub, accent = false }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "'Newsreader', serif", fontSize: accent ? 32 : 24, fontWeight: 300, color: accent ? "#DC2626" : "#F5F0E8", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Card({ title, children, accent }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 2, padding: "20px 24px", marginBottom: 16 }}>
      {title && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: accent ? "#DC2626" : "#D4A843", marginBottom: 12, letterSpacing: "0.04em" }}>{title}</div>}
      {children}
    </div>
  );
}

function DataRow({ label, value, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F5F0E8", fontWeight: 500 }}>{value} {sub && <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 300, fontSize: 9 }}>{sub}</span>}</span>
    </div>
  );
}

// === TAB PANELS ===

function OverviewPanel() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 24, marginBottom: 32, padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Stat label="System Beta β̄" value="35.2" sub="90% CI [28.4, 42.1]" accent />
        <Stat label="Private Payoff Π" value="$186.7B" sub="per year" />
        <Stat label="Welfare Cost W" value="−$6,570B" sub="per year" />
        <Stat label="System-Adj. Payoff" value="−$6.4T" sub="at μ = 1.0" />
        <Stat label="Breakeven μ" value="0.028" sub="= 1/β_W (Prop. 16)" />
      </div>

      <Card title="THE IMPOSSIBILITY">
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 16 }}>
          <strong style={{ color: "#DC2626" }}>Molecular Persistence Floor: β_W ≥ 2.5</strong> — No market mechanism satisfying three axioms of commodity chemistry (Functional Necessity, Open-Release Architecture, Environmental Non-Degradability) can reduce the system beta below ~2.5 through private action alone. Grounded in the Second Law of Thermodynamics: the collection cost of dispersed PFAS is thermodynamically irreducible.
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
          Impossibility lineage: Arrow (1951) → Gibbard-Satterthwaite (1973/75) → Myerson-Satterthwaite (1983) → FLP (1985) → CAP (2002) → Protocol Welfare Floor (2026b) → Molecular Persistence Floor (this paper)
        </div>
      </Card>

      <Card title="SHADOW PRICE DUALITY (PROPOSITION 16)">
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F5F0E8", marginBottom: 8 }}>
          μ* = 1/β_W = 1/35.2 = <span style={{ color: "#DC2626", fontWeight: 600 }}>0.028</span>
        </div>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          The breakeven shadow price and the system beta are the same structural quantity in different coordinates. At any μ {">"} 0.028 — 2.8 cents per dollar of welfare — the molecular persistence economy is welfare-destroying.
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="CONTAINED (β ≈ 2.5)">
          <DataRow label="Revenue" value="$7.36B/yr" />
          <DataRow label="System Beta" value="≈ 2.5" sub="at floor" />
          <DataRow label="Capture Rate" value=">99%" />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>Semiconductors, medical, aerospace, lab</div>
        </Card>
        <Card title="OPEN-RELEASE (β > 50)" accent>
          <DataRow label="Revenue" value="$13.65B/yr" />
          <DataRow label="System Beta" value="> 50" sub="20× floor" />
          <DataRow label="Capture Rate" value="~0%" />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>Textiles, packaging, AFFF, cosmetics</div>
        </Card>
      </div>

      <Card title="CHEMICAL-CLASS DISAGGREGATION">
        {DISAGGREGATION.map(d => (
          <div key={d.cls} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 1, background: d.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F5F0E8" }}>{d.cls}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>β_W ≈ {d.betaRange}</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{d.welfare}</span>
          </div>
        ))}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>Each class independently classifies as Hollow Win (β {">"} 1)</div>
      </Card>
    </div>
  );
}

function ChannelsPanel() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={OPERATIONAL_CHANNELS} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="shortName" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "'JetBrains Mono'" }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "'JetBrains Mono'" }} label={{ value: "β_W", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
            <Bar dataKey="beta" radius={[2, 2, 0, 0]}>
              {OPERATIONAL_CHANNELS.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
            <ReferenceLine y={1} stroke="rgba(220,38,38,0.5)" strokeDasharray="4 4">
              <Label value="Hollow Win threshold (β=1)" position="insideTopRight" fill="rgba(220,38,38,0.5)" fontSize={9} fontFamily="'JetBrains Mono'" />
            </ReferenceLine>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {CHANNEL_DATA.map(ch => (
        <Card key={ch.name} title={`${ch.icon}  ${ch.name.toUpperCase()}`}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 8 }}>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>β_W</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, color: ch.color, fontWeight: 500 }}>{ch.beta}</div></div>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Weight</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, color: "#F5F0E8" }}>{ch.weight > 0 ? `${(ch.weight * 100).toFixed(0)}%` : "Excl."}</div></div>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Welfare</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, color: "#F5F0E8" }}>${ch.welfare}B</div></div>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Severity</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ch.color, fontWeight: 600 }}>{ch.severity}</div></div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{ch.note}</div>
        </Card>
      ))}

      <Card title="WEIGHTED AGGREGATE ARITHMETIC">
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
          {OPERATIONAL_CHANNELS.map(c => `${c.weight}×${c.beta}`).join(" + ")} = <strong style={{ color: "#F5F0E8" }}>15.4</strong> (channel-weighted avg)<br />
          $6,580B / $186.7B = <strong style={{ color: "#DC2626" }}>35.2</strong> (welfare ratio β̄ — primary measure)<br />
          2 × 0.000252 × $161.7B = <strong style={{ color: "#F5F0E8" }}>81.5</strong> (PSF marginal at current Π)
        </div>
      </Card>
    </div>
  );
}

function CrossDomainPanel() {
  const chartData = CROSS_DOMAIN.filter(d => d.beta < 100).map(d => ({ ...d, logBeta: Math.log10(d.beta) }));
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={CROSS_DOMAIN.filter(d => d.beta < 200)} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "'JetBrains Mono'" }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "'JetBrains Mono'" }} domain={[0, 40]} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'JetBrains Mono'", fontSize: 11 }} />
            <Bar dataKey="beta" radius={[2, 2, 0, 0]}>
              {CROSS_DOMAIN.filter(d => d.beta < 200).map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
            <ReferenceLine y={35.2} stroke="rgba(220,38,38,0.4)" strokeDasharray="4 4">
              <Label value="PFAS β=35.2" position="insideTopRight" fill="rgba(220,38,38,0.5)" fontSize={9} fontFamily="'JetBrains Mono'" />
            </ReferenceLine>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>ERCOT (β=2,053) excluded from chart for scale. Shown in table below.</div>
      </div>

      {CROSS_DOMAIN.map(d => (
        <Card key={d.name} title={d.name.toUpperCase()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>β_W</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, color: d.color, fontWeight: 500 }}>{d.beta.toLocaleString()}</div></div>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Breakeven μ</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: "#F5F0E8" }}>{d.mu}</div></div>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Reversibility</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{d.reversibility}</div></div>
            <div><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Classification</span><div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: d.color, fontWeight: 500 }}>{d.type}</div></div>
          </div>
        </Card>
      ))}

      <Card title="CROSS-DOMAIN ALLOCATION RULE">
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
          By Proposition 16 (Shadow Price Duality), an institutional designer should equalize μ across domains. Molecular persistence (μ = 0.028) is <strong style={{ color: "#DC2626" }}>20× more welfare-destroying</strong> per dollar of regulatory forbearance than Bitcoin (μ = 0.56).
        </div>
      </Card>
    </div>
  );
}

function ThresholdsPanel() {
  const chartData = THRESHOLDS.map(t => ({ ...t, yearsFromNow: t.tStar - 2026 }));
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, bottom: 5, left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "'JetBrains Mono'" }} label={{ value: "Years from 2026", position: "insideBottom", offset: -5, fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
            <YAxis type="category" dataKey="domain" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "'JetBrains Mono'" }} width={115} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'JetBrains Mono'", fontSize: 11 }} />
            <Bar dataKey="yearsFromNow" radius={[0, 2, 2, 0]}>
              {chartData.map((t, i) => <Cell key={i} fill={t.color} fillOpacity={0.7} />)}
            </Bar>
            <ReferenceLine x={0} stroke="rgba(220,38,38,0.6)" strokeWidth={2}>
              <Label value="NOW" position="top" fill="#DC2626" fontSize={10} fontFamily="'JetBrains Mono'" fontWeight={600} />
            </ReferenceLine>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {THRESHOLDS.map(t => (
        <div key={t.domain} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ width: 60, fontFamily: "'JetBrains Mono'", fontSize: 13, color: t.color, fontWeight: 600, textAlign: "center" }}>~{t.tStar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#F5F0E8" }}>{t.domain}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{t.status}</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.3)", padding: "2px 8px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2 }}>{t.confidence}</div>
        </div>
      ))}

      <Card title="FEEDBACK LOOPS" accent>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
          (1) Chemical synergism: microplastics concentrate PFAS via sorption → increased internal dose.
          (2) Infrastructure vulnerability: rising MPs foul the RO/IX filtration needed to remove PFAS.
          (3) Biological meltdown: Toxic Triad (radiation + PFAS + MPs) compromises DNA repair pathways.
          Crossing any single threshold accelerates all others.
        </div>
      </Card>
    </div>
  );
}

function SensitivityPanel() {
  return (
    <div>
      <Card title="COOPERATIVE BASELINE SENSITIVITY">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono'", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {["Π_C", "Gap", "Marginal β", "Welfare β̄", "Class."].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SENSITIVITY.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "8px 12px", color: "#F5F0E8" }}>{s.baseline}</td>
                  <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)" }}>{s.gap}</td>
                  <td style={{ padding: "8px 12px", color: "#DC2626" }}>{s.margBeta}</td>
                  <td style={{ padding: "8px 12px", color: "#F5F0E8" }}>{s.welfareBeta}</td>
                  <td style={{ padding: "8px 12px", color: "#6B8E23" }}>{s.classification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>
          Counterintuitive: higher Π_C increases β_W because the welfare shortfall is fixed while the extraction gap narrows.
        </div>
      </Card>

      <Card title="MONTE CARLO ROBUSTNESS (N=10,000)">
        <DataRow label="Draws" value="10,000" />
        <DataRow label="Mean β_W" value="35.8" />
        <DataRow label="90% CI" value="[28.4, 42.1]" />
        <DataRow label="Classification" value="100% Slow Hollow Win" />
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 12, lineHeight: 1.6 }}>
          Distributions: Water β tri(0.2, 0.5, 0.8) · Health β tri(3.0, 8.4, 15.0) · Agri β tri(0.1, 0.25, 0.5) · Reg β tri(0.03, 0.07, 0.15) · Release β tri(20, 35.2, 55)
        </div>
      </Card>

      <Card title="MINIMUM PUBLISHABLE RESULT">
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
          Under <em>simultaneously</em> conservative assumptions — healthcare 10× lower ($150B), premium doubled ($373B), max Π_C ($50B), bioaccumulation excluded:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
          <Stat label="Floor β" value="> 4.5" />
          <Stat label="SAP negative at" value="μ > 0.12" />
          <Stat label="MC Confirmation" value="100%" />
        </div>
      </Card>

      <Card title="DICE-2023 BENCHMARK">
        <DataRow label="Nordhaus (~3.5%)" value="$188T" sub="converges" />
        <DataRow label="Stern (~1.4%)" value="$470T" sub="converges" />
        <DataRow label="Weitzman (fat-tail)" value="∞" sub="diverges under A3" />
        <DataRow label="SAPM β_W" value="35.2" sub="ρ-free, finite" />
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>Where DICE produces 3 numbers depending on ρ, SAPM produces 1.</div>
      </Card>
    </div>
  );
}

function MethodsPanel() {
  return (
    <div>
      <Card title="PERSISTENCE PREMIUM BY SECTOR">
        {PERSISTENCE_PREMIUM.map(s => (
          <div key={s.sector} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{s.sector}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#F5F0E8", width: 70, textAlign: "right" }}>${s.premium}B</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: "rgba(255,255,255,0.3)", width: 40, textAlign: "right" }}>{s.ratio}%</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4 }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#D4A843", fontWeight: 600 }}>TOTAL</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#D4A843", fontWeight: 600 }}>$186.7B (41%)</span>
        </div>
      </Card>

      <Card title="AXIOMS OF THE IMPOSSIBILITY THEOREM">
        {[
          { ax: "A1", name: "Functional Necessity", desc: "The persistent property is required for the product's primary function. PTFE oil contact 50° vs. alternatives 0°." },
          { ax: "A2", name: "Open-Release Architecture", desc: "The product is used where environmental release is structurally inevitable during or after the lifecycle." },
          { ax: "A3", name: "Environmental Non-Degradability", desc: "The material does not degrade in any natural process on human-relevant timescales. C-F bond: 485 kJ/mol. Second Law guarantee." },
        ].map(a => (
          <div key={a.ax} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#DC2626", fontWeight: 600 }}>{a.ax}: {a.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4, lineHeight: 1.5 }}>{a.desc}</div>
          </div>
        ))}
      </Card>

      <Card title="PIGOUVIAN INSUFFICIENCY THEOREM">
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
          No function τ: T → ℝ of bilateral transaction data T recovers ∂W/∂x_i. The market price system is an insufficient statistic for W (Blackwell, 1951). The tax authority must observe W independently — precisely what EPA UCMR 5 and CDC biomonitoring are only now beginning to produce, 70+ years after industrial fluorochemistry began.
        </div>
      </Card>

      {[
        { title: "FALSIFICATION CRITERIA", items: ["F1: Total welfare < $186.7B (requires Lancet wrong by 10×)", "F2: Market internalizes $140–$170B voluntarily without regulation", "F3: Non-persistent alternative at cost/performance parity across all 9 sectors", "F4: C-F bonds degrade naturally on human timescales (contradicts Wackett 2024)"] },
        { title: "KEY SOURCES", items: ["EPA NPDWR (2024) · Lancet Countdown (2025) · Obsekov & Kahn (2022)", "Marfella et al. (2024, NEJM) · Milliman (2024) · ChemSec (2025)", "Wackett (2024) · 3M/Chemours/Daikin filings · Stockholm Convention", "USGS (2023) · Kim et al. (2024) · Isobe et al. (2019, Nat. Commun.)"] },
      ].map(section => (
        <Card key={section.title} title={section.title}>
          {section.items.map((item, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.4)", padding: "4px 0", lineHeight: 1.5 }}>{item}</div>
          ))}
        </Card>
      ))}

      <div style={{ marginTop: 32, padding: "20px 24px", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.1)", borderRadius: 2 }}>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 600, color: "#DC2626", marginBottom: 10 }}>CITATION</div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
          Postnieks, E. (2026c). "Applying the System Asset Pricing Model to Molecular Persistence: Measuring the System Welfare Cost of PFAS, Microplastics, and Persistent Organic Pollutants." Working Paper, March 2026.
        </div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 10 }}>
          Companion: Postnieks (2026a) "The Private Pareto Trap" · Postnieks (2026b) "Applying the SAPM to Bitcoin"
        </div>
      </div>
    </div>
  );
}

// === MAIN APP ===
export default function PFASSAPMCompanion() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "channels", label: "Channels" },
    { id: "crossdomain", label: "Cross-Domain" },
    { id: "thresholds", label: "Thresholds" },
    { id: "sensitivity", label: "Robustness" },
    { id: "methods", label: "Methods" },
  ];

  return (
    <div style={{ fontFamily: "'Newsreader', serif", background: "#0D0D0D", color: "#F5F0E8", minHeight: "100vh", maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
      <style>{fonts}</style>

      <header style={{ padding: "40px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: "#DC2626", marginBottom: 12, textTransform: "uppercase" }}>
          Replication & Visualization Companion
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 400, margin: 0, lineHeight: 1.25, letterSpacing: "-0.02em", color: "#F5F0E8" }}>
          Applying the System Asset Pricing Model to Molecular Persistence
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "8px 0 0", fontStyle: "italic" }}>
          Measuring the System Welfare Cost of PFAS, Microplastics, and Persistent Organic Pollutants
        </p>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
          Erik Postnieks · Working Paper — March 2026 · Postnieks (2026c)
        </div>
      </header>

      <nav style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 32, position: "sticky", top: 0, background: "#0D0D0D", zIndex: 10, paddingTop: 8 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.04em",
              color: activeTab === tab.id ? "#DC2626" : "rgba(255,255,255,0.35)",
              background: "none", border: "none", cursor: "pointer",
              padding: "12px 14px",
              borderBottom: activeTab === tab.id ? "2px solid #DC2626" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >{tab.label}</button>
        ))}
      </nav>

      <main style={{ paddingBottom: 60 }}>
        {activeTab === "overview" && <OverviewPanel />}
        {activeTab === "channels" && <ChannelsPanel />}
        {activeTab === "crossdomain" && <CrossDomainPanel />}
        {activeTab === "thresholds" && <ThresholdsPanel />}
        {activeTab === "sensitivity" && <SensitivityPanel />}
        {activeTab === "methods" && <MethodsPanel />}
      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 0", textAlign: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          © 2026 Erik Postnieks · Correspondence: erik@woosterllc.com · All rights reserved
        </div>
      </footer>
    </div>
  );
}
