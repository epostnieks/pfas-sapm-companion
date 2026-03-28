// PFASSAPMCompanion.jsx
// Erik Postnieks © 2026 — SAPM Companion Dashboard
// Bloomberg terminal aesthetic: JetBrains Mono + Newsreader, navy/gold/crimson/green
// Drop into Next.js: pages/dashboards/PFASSAPMCompanion.jsx  (or app/dashboards/PFASSAPMCompanion/page.jsx)
// Dependencies: none (pure React + inline styles)

import { useState } from 'react';
import SAPMNav from "./SAPMNav";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell, Label } from 'recharts';

// ─── Data ─────────────────────────────────────────────────────────────────
const META = {
  title: "Molecular Persistence (PFAS / MPs / POPs)",
  subtitle: "Measuring the System Welfare Cost of PFAS, Microplastics, and Persistent Organic Pollutants",
  beta: "35.2",
  ci: "28.4–42.1",
  pi: "$186.7B",
  psa: "-$6,400B/yr",
  mu: "0.028 (2.8%)",
  kappa: "0.87",
  type: "Molecular Persistence Floor (Theorem) | Floor β ≈ 2.5 | Open-Release Commodity Chemistry",
  companion: "",
};

const CHANNELS = [
  { id:1, name:"Water remediation — EPA NPDWR compliance", beta:"0.49", value:"$4.8B/yr", weight:"~5%" },
  { id:2, name:"Healthcare & endocrine disruption (Lancet)", beta:"8.4", value:"$1,563B/yr", weight:"~48%" },
  { id:3, name:"Agricultural contamination — biosolid pathways", beta:"0.26", value:"$20B/yr", weight:"~12%" },
  { id:4, name:"Regulatory transition costs (TSCA/REACH/DOD)", beta:"0.07", value:"$12.5B/yr", weight:"~3%" },
  { id:5, name:"Environmental release — aggregate operational", beta:"35.2", value:"$6,580B/yr", weight:"~32%" },
];

const CHANNEL_DATA_FULL = [
  { name: "Water Remediation", shortName: "Water", beta: 0.49, weight: 0.05, welfare: 4.8, color: "#D4A843", severity: "LATENT", note: "EPA NPDWR 4.0 ppt MCL; $140\u2013$170B total liability" },
  { name: "Healthcare & Endocrine", shortName: "Health", beta: 8.4, weight: 0.48, welfare: 1563, color: "#E85D3A", severity: "ACUTE", note: "Lancet $1.5T (3 chemicals, 38 countries); cross-validated WHO/OECD/Nordic" },
  { name: "Agricultural Contamination", shortName: "Agri", beta: 0.26, weight: 0.12, welfare: 20, color: "#6B8E23", severity: "STRUCTURAL", note: "70M acres contaminated via biosolids; 20\u201330% property devaluation" },
  { name: "Bioaccumulation", shortName: "Bio", beta: 471, weight: 0, welfare: 88000, color: "#8B5CF6", severity: "EXCLUDED", note: "Structural bound only; 100% placentas positive; brain MPs +50% in 8 yrs" },
  { name: "Regulatory Transition", shortName: "Reg", beta: 0.07, weight: 0.03, welfare: 12.5, color: "#D4A843", severity: "LATENT", note: "TSCA $843M; REACH 74 derogations; DOD $9.3B FY2025+" },
  { name: "Environmental Release", shortName: "Release", beta: 35.2, weight: 0.32, welfare: 6580, color: "#DC2626", severity: "SEVERE", note: "Aggregate operational \u03b2; 475 Mt/yr plastic production" },
];

const CROSS_DOMAIN = [
  { domain:"Algorithmic Pricing", beta:"5.28", type:"Institutional", pi:"$39.5B", key:"sapm-algorithmic-pricing" },
  { domain:"Arms Exports", beta:"2.54", type:"Institutional", pi:"$293B", key:"sapm-arms-exports" },
  { domain:"Aviation Emissions", beta:"4.91", type:"Institutional", pi:"$1.007T", key:"sapm-aviation-emissions" },
  { domain:"Big Tech Monopoly", beta:"9.60", type:"Institutional", pi:"$158B", key:"sapm-big-tech-platform-monopoly" },
  { domain:"Cement (Calcination Floor)", beta:"6.55", type:"Impossibility", pi:"$330B", key:"sapm-cement-calcination-floor" },
  { domain:"Coal Combustion", beta:"6.96", type:"Institutional", pi:"$990B", key:"sapm-coal" },
  { domain:"CRE Urban Hollowing", beta:"11.0", type:"Institutional", pi:"$13.5B", key:"sapm-cre-urban-hollowing" },
  { domain:"Deep-Sea Mining (Abyssal Floor)", beta:"8.45", type:"Impossibility", pi:"$4.8B", key:"sapm-dsm-abyssal-recovery-floor" },
  { domain:"Global Fisheries", beta:"4.77", type:"Institutional", pi:"$37.6B", key:"sapm-fisheries-no-impossibility" },
  { domain:"Gambling Industry", beta:"7.19", type:"Institutional", pi:"$44.2B", key:"sapm-gambling" },
  { domain:"Gene Drives (Ecological Ratchet)", beta:"42.5", type:"Impossibility", pi:"$2.8B", key:"sapm-gene-drives" },
  { domain:"Gig Economy", beta:"4.56", type:"Institutional", pi:"$62.0B", key:"sapm-gig-economy" },
  { domain:"Mol. Persistence (PFAS/MPs/POPs)", beta:"35.2", type:"Impossibility", pi:"$186.7B", key:"pfas-sapm-companion" },
  { domain:"Oil & Gas Extraction", beta:"6.58", type:"Institutional", pi:"$3.50T", key:"sapm-oil-gas" },
  { domain:"Opioid Industry", beta:"12.5", type:"Institutional", pi:"$24.0B", key:"sapm-opioids" },
  { domain:"Orbital Debris (Kessler Ceiling)", beta:"5,066", type:"Impossibility", pi:"$293B", key:"sapm-orbital-debris" },
  { domain:"Palm Oil Deforestation", beta:"8.86", type:"Institutional", pi:"$67B", key:"sapm-palm-oil" },
  { domain:"Pharmacy Benefit Managers", beta:"35.4", type:"Institutional", pi:"$27.6B", key:"sapm-pbm-rebate" },
  { domain:"POPs Beyond PFAS (Inheritance Floor)", beta:"6.08", type:"Impossibility", pi:"$70B", key:"sapm-pops-beyond-pfas" },
  { domain:"For-Profit Student Loans", beta:"4.80", type:"Institutional", pi:"$46.8B", key:"sapm-student-loans-forprofit" },
  { domain:"Tobacco Industry", beta:"6.80", type:"Institutional", pi:"$965B", key:"sapm-tobacco" },
  { domain:"Topsoil Erosion (Pedogenesis Floor)", beta:"5.52", type:"Impossibility", pi:"$380B", key:"sapm-topsoil-erosion" },
  { domain:"Ultra-Processed Food", beta:"6.11", type:"Institutional", pi:"$293B", key:"sapm-upf-full" },
  { domain:"Ultra-Processed Food (No Impossibility)", beta:"6.11", type:"Institutional", pi:"$293B", key:"sapm-upf-no-impossibility" },
  { domain:"Water Privatization", beta:"3.16", type:"Institutional", pi:"$246B", key:"sapm-water-privatization" },
  { domain:"WMD/LAWS (Capability Diffusion Ceiling)", beta:"79,512", type:"Impossibility", pi:"$85B", key:"sapm-wmd-capability-diffusion-ceiling" },
];

const HIGHLIGHTS = [
  "\u03b2_W = 35.2 for molecular persistence economy. Floor \u03b2 \u2248 2.5 \u2014 no market mechanism can reduce below this for open-release commodity chemistry.",
  "Molecular Persistence Floor: the collection cost of dispersed PFAS is thermodynamically irreducible. C-F bond energy: 485 kJ/mol. Second Law guarantee.",
  "Shadow Price Duality (Proposition 16): \u03bc* = 1/\u03b2_W = 0.028. At any \u03bc > 0.028 the molecular persistence economy is welfare-destroying.",
  "Healthcare channel alone \u03b2 = 8.4: Lancet $1.5T across 3 chemicals, 38 countries. Cross-validated WHO/OECD/Nordic.",
  "Bioaccumulation structural bound: \u03b2 = 471 (excluded from operational aggregate). 100% placentas positive for PFAS; brain microplastics +50% in 8 years.",
  "Under simultaneously conservative assumptions \u2014 healthcare 10\u00d7 lower, premium doubled, max \u03a0_C, bioaccumulation excluded \u2014 floor \u03b2 > 4.5, MC confirmation 100%.",
];

const PSF_PARAMS = {pi_c:25,pi_p:186.7,w_c:6570,kappa:0.87};
const PSF_DATA = [{pi:2.5,w:6500},{pi:15,w:6550},{pi:25,w:6570},{pi:40,w:6520},{pi:60,w:6400},{pi:80,w:6200},{pi:100,w:5900},{pi:120,w:5500},{pi:140,w:4900},{pi:160,w:4100},{pi:180,w:3000},{pi:186.7,w:2600},{pi:200,w:1500},{pi:220,w:-200},{pi:240,w:-2200},{pi:260,w:-4500},{pi:280,w:-7100}];

const MC_HIST = [{bin:"24.0",count:45},{bin:"26.0",count:120},{bin:"28.0",count:280},{bin:"28.4",count:350},{bin:"30.0",count:520},{bin:"31.0",count:610},{bin:"32.0",count:720},{bin:"33.0",count:810},{bin:"34.0",count:890},{bin:"35.0",count:940},{bin:"35.2",count:960},{bin:"36.0",count:900},{bin:"37.0",count:830},{bin:"38.0",count:720},{bin:"39.0",count:600},{bin:"40.0",count:480},{bin:"41.0",count:370},{bin:"42.0",count:280},{bin:"42.1",count:260},{bin:"43.0",count:190},{bin:"44.0",count:130},{bin:"45.0",count:80},{bin:"46.0",count:50},{bin:"47.0",count:30},{bin:"48.0",count:15}];
const MC_STATS = {mean:35.80,median:35.20,ci_lo:28.40,ci_hi:42.10,pct_hw:100.0,pct_above_3:100.0,pct_above_5:100.0,min:23.80,max:48.50,n_draws:10000,seed:42};
const MC_CHANNELS = [
  {name:"Water remediation",mean:4.8,p5:2.1,p50:4.6,p95:8.2,share:0.05},
  {name:"Healthcare & endocrine",mean:1563,p5:780,p50:1500,p95:2400,share:0.48},
  {name:"Agricultural contamination",mean:20,p5:8,p50:19,p95:35,share:0.12},
  {name:"Regulatory transition",mean:12.5,p5:5,p50:12,p95:22,share:0.03},
  {name:"Environmental release",mean:6580,p5:3200,p50:6400,p95:10500,share:0.32},
];
const MC_WELFARE = {mean:6570,ci_lo:5200,ci_hi:8100};

const THRESHOLDS = [
  {domain:"Blood microplastics detection",year:2025,confidence:"Very Low",status:"Likely crossed \u2014 Marfella et al. (2024, NEJM)",crossed:true},
  {domain:"U.S. water PFAS detection (45%+)",year:2030,confidence:"Low",status:"USGS 2023: 45% of tap water positive",crossed:false},
  {domain:"U.S. water MCL compliance",year:2055,confidence:"Low",status:"~8% above 4.0 ppt EPA NPDWR",crossed:false},
  {domain:"PFAS remediation infrastructure",year:2075,confidence:"Low\u2013Very Low",status:"Nascent \u2014 RO/IX at scale",crossed:false},
  {domain:"Semiconductor mfg. background contamination",year:2055,confidence:"Low",status:"Rising background PFAS in cleanroom supply chains",crossed:false},
  {domain:"Ocean microplastics (regional PNR)",year:2075,confidence:"Very Low",status:"Hotspots 2\u00d7 baseline (Isobe et al. 2019)",crossed:false},
  {domain:"Ocean microplastics (global PNR)",year:2100,confidence:"Very Low",status:"Hotspots 100\u00d7 baseline",crossed:false},
];

const AXIOMS = {type:"impossibility",items:[
  {id:"A1",name:"Functional Necessity",description:"The persistent molecular property (C-F bond stability, polymer durability) is required for the product\u2019s primary function. PTFE oil contact angle 50\u00b0 vs. alternatives 0\u00b0. No non-persistent substitute at cost/performance parity across all 9 sectors."},
  {id:"A2",name:"Open-Release Architecture",description:"The product is used where environmental release is structurally inevitable during or after the lifecycle. Textiles shed microfibers; food packaging leaches; AFFF is sprayed directly into groundwater. Capture rate \u22480% for open-release sectors."},
  {id:"A3",name:"Environmental Non-Degradability",description:"The material does not degrade in any natural process on human-relevant timescales. C-F bond dissociation energy: 485 kJ/mol. No known biological pathway cleaves perfluorinated chains. Second Law of Thermodynamics guarantee: collection cost of dispersed PFAS is irreducible."},
]};

const METHODS_DATA = {
  welfare_function: "W estimated from cross-validated epidemiological studies (Lancet Countdown 2025, Obsekov & Kahn 2022), EPA remediation cost models (NPDWR 2024), agricultural contamination surveys (USGS 2023), and environmental release assessments. Healthcare channel dominates at ~48% weight; environmental release channel provides aggregate operational \u03b2.",
  cooperative_baseline: "Contained-use fluorochemistry (semiconductors, medical devices, aerospace, laboratory equipment) generating $7.36B/yr with >99% capture rate and \u03b2 \u2248 2.5 at the molecular persistence floor. This represents the welfare-maximizing extraction level where persistent chemistry is used only where no functional alternative exists and environmental release is negligible.",
  falsification: [
    "F1: Total welfare cost < $186.7B \u2014 requires Lancet wrong by 10\u00d7 and EPA remediation estimates simultaneously incorrect.",
    "F2: Market internalizes $140\u2013$170B water remediation liability voluntarily without regulation.",
    "F3: Non-persistent alternative at cost/performance parity across all 9 sectors identified.",
    "F4: C-F bonds degrade naturally on human timescales \u2014 contradicts Wackett (2024) and thermodynamic first principles.",
  ],
  key_sources: [
    "EPA NPDWR (2024) \u00b7 Lancet Countdown (2025) \u00b7 Obsekov & Kahn (2022)",
    "Marfella et al. (2024, NEJM) \u00b7 Milliman (2024) \u00b7 ChemSec (2025)",
    "Wackett (2024) \u00b7 3M/Chemours/Daikin filings \u00b7 Stockholm Convention",
    "USGS (2023) \u00b7 Kim et al. (2024) \u00b7 Isobe et al. (2019, Nat. Commun.)",
  ],
};

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

const BIFURCATION = {
  contained: { revenue: "$7.36B/yr", beta: "\u2248 2.5", sectors: "Semiconductors, medical devices, aerospace, lab equipment", capture: ">99%", regulation: "Strict containment; EU REACH 13.5\u201320 yr derogation" },
  openRelease: { revenue: "$13.65B/yr", beta: "> 50", sectors: "Textiles, food packaging, AFFF, cosmetics", capture: "~0%", regulation: "Ban; require non-fluorinated alternatives" },
};

const SENSITIVITY = [
  { baseline: "$7.4B", gap: "$179.3B", margBeta: 73.5, welfareBeta: 36.8, classification: "Slow HW" },
  { baseline: "$25B", gap: "$161.7B", margBeta: 81.5, welfareBeta: 35.2, classification: "Slow HW" },
  { baseline: "$35B", gap: "$151.7B", margBeta: 86.9, welfareBeta: 43.5, classification: "Slow HW" },
  { baseline: "$50B", gap: "$136.7B", margBeta: 96.6, welfareBeta: 48.3, classification: "Slow HW" },
];

const DISAGGREGATION = [
  { cls: "PFAS", betaRange: "6\u20138", welfare: "~$270B/yr", dominant: "Water + PFAS healthcare", color: "#D4A843" },
  { cls: "Microplastics", betaRange: "28\u201332", welfare: "~$5,800B/yr", dominant: "Lancet healthcare + release", color: "#E85D3A" },
  { cls: "POPs", betaRange: "2\u20134", welfare: "~$510B/yr", dominant: "Stockholm Convention legacy", color: "#6B8E23" },
];

const CROSS_DOMAIN_COMPARISON = [
  { name: "Bitcoin", beta: 5.0, mu: 0.56, type: "Fast Hollow Win", reversibility: "Partial", tStar: "Years", color: "#F59E0B" },
  { name: "Mol. Persistence", beta: 35.2, mu: 0.028, type: "Slow Hollow Win", reversibility: "Irreversible", tStar: "Decades\u2013Centuries", color: "#DC2626" },
  { name: "Ethereum", beta: 2.4, mu: 0.42, type: "Moderate HW", reversibility: "Largely reversed", tStar: "Months", color: "#8B5CF6" },
  { name: "VW Dieselgate", beta: 6.8, mu: 0.31, type: "Fast HW (resolved)", reversibility: "Resolved", tStar: "Years", color: "#6B8E23" },
  { name: "ERCOT 2021", beta: 2053, mu: 0.001, type: "Catastrophic HW", reversibility: "Fully reversed", tStar: "Days", color: "#D4A843" },
];

// ─── Color palette ───────────────────────────────────────────────────────────
const C = {
  bg:      '#0D0D0D',
  panel:   '#1A1A1A',
  border:  'rgba(255,255,255,0.08)',
  navy:    '#1A1A1A',
  gold:    '#F59E0B',
  crimson: '#EF4444',
  green:   '#22C55E',
  text:    '#F5F0E8',
  muted:   'rgba(255,255,255,0.4)',
  thead:   '#141414',
  mono:    "'JetBrains Mono', 'Fira Code', monospace",
  serif:   "'Newsreader', 'Georgia', serif",
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function Metric({ label, value, sub, color }) {
  return (
    <div style={{flex:1,minWidth:140,background:C.panel,border:`1px solid ${C.border}`,borderRadius:3,padding:'12px 16px'}}>
      <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,letterSpacing:1,marginBottom:4}}>{label}</div>
      <div style={{fontFamily:C.mono,fontSize:28,fontWeight:700,color:color||C.gold,lineHeight:1}}>{value}</div>
      {sub && <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{fontFamily:C.mono,fontSize:12,color:C.muted,letterSpacing:2,borderBottom:`1px solid ${C.border}`,paddingBottom:6,marginBottom:12,marginTop:20,textTransform:'uppercase'}}>
      {children}
    </div>
  );
}

function BetaBar({ beta, max }) {
  const pct = Math.min(100, (parseFloat(beta)||0) / (max||15) * 100);
  const color = pct > 80 ? C.crimson : pct > 50 ? '#D97706' : C.gold;
  return (
    <div style={{background:'rgba(255,255,255,0.04)',borderRadius:2,height:8,flex:1,margin:'0 8px'}}>
      <div style={{width:`${pct}%`,height:'100%',background:color,borderRadius:2,transition:'width 0.4s'}} />
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily:C.mono, fontSize:12, letterSpacing:1,
      padding:'6px 14px', border:'none', cursor:'pointer',
      background: active ? C.gold : 'transparent',
      color: active ? '#000' : C.muted,
      borderBottom: active ? `2px solid ${C.gold}` : '2px solid transparent',
      textTransform:'uppercase',
    }}>{label}</button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PFASSAPMCompanion() {
  const [tab, setTab] = useState('overview');
  const maxBeta = Math.max(...CROSS_DOMAIN.map(d => parseFloat(d.beta)||0), parseFloat(META.beta)||0, 10);

  return (
    <div style={{background:C.bg,minHeight:'100vh',padding:'0',fontFamily:C.mono,color:C.text}}>

      {/* Header */}
      <div style={{background:C.panel,borderBottom:`2px solid ${C.gold}`,padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,letterSpacing:2,marginBottom:4}}>ERIK POSTNIEKS · SAPM</div>
          <div style={{fontFamily:C.serif,fontSize:24,fontWeight:700,color:C.text}}>{META.title}</div>
          {META.subtitle && <div style={{fontFamily:C.serif,fontSize:15,color:C.muted,marginTop:2,fontStyle:'italic'}}>{META.subtitle}</div>}
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,letterSpacing:1}}>SYSTEM BETA</div>
          <div style={{fontFamily:C.mono,fontSize:36,fontWeight:700,color:C.gold,lineHeight:1}}>&beta;<sub>W</sub> = {META.beta}</div>
          {META.ci && <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>90% CI [{META.ci}]</div>}
        </div>
      </div>

      {/* PST badge + type */}
      <div style={{background:'rgba(245,158,11,0.06)',padding:'8px 24px',display:'flex',gap:10,alignItems:'center',borderBottom:`1px solid ${C.border}`}}>
        <span style={{background:'#7b1a1a',color:'#ffdddd',fontSize:12,padding:'4px 10px',borderRadius:2,fontFamily:'JetBrains Mono,monospace',letterSpacing:0.5}}>IMPOSSIBILITY THEOREM</span>
        <span style={{fontFamily:C.mono,fontSize:12,color:C.muted}}>{META.type}</span>
        {META.companion && <a href={META.companion} target="_blank" rel="noreferrer" style={{marginLeft:'auto',fontFamily:C.mono,fontSize:11,color:C.gold,textDecoration:'none'}}>&uarr; Companion Dashboard</a>}
      </div>

      {/* Tab bar */}
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:'0 24px',display:'flex',gap:4,flexWrap:'wrap'}}>
        {['overview','channels','psf','monte-carlo','thresholds','cross-domain','methods','highlights','shadow-price','bifurcation','disaggregation','sensitivity'].map(t => (
          <Tab key={t} label={t} active={tab===t} onClick={()=>setTab(t)} />
        ))}
      </div>

      <div style={{padding:'20px 24px',maxWidth:1100}}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            {/* Key metrics row */}
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
              <Metric label={<>&beta;<sub>W</sub>  (System Beta)</>} value={META.beta} sub={META.ci ? `90% CI [${META.ci}]` : 'Headline estimate'} color={C.gold} />
              {META.pi && <Metric label="Private Payoff &Pi;" value={META.pi+'/yr'} sub="Persistence premium extraction" color={C.text} />}
              {META.psa && <Metric label={<>System-Adj. Payoff &Pi;<sub>SA</sub></>} value={META.psa} sub={<>&beta;<sub>W</sub> &middot; &Pi; &minus; W</>} color={C.crimson} />}
              {META.mu && <Metric label="Break-Even &mu;*" value={META.mu} sub="Welfare neutrality threshold" color={'#22C55E'} />}
              {META.kappa && <Metric label="PSF Curvature &kappa;" value={META.kappa} sub="Pareto shortfall index" color={C.muted} />}
            </div>

            {/* Theorem Statement */}
            <div style={{background:'#1A1A1A',border:'2px solid #F59E0B',borderRadius:4,padding:'16px 20px',marginBottom:16}}>
              <div style={{fontFamily:'Newsreader,serif',fontSize:11,color:'#aabbcc',marginBottom:6,letterSpacing:1}}>THEOREM STATEMENT</div>
              <div style={{fontFamily:'Newsreader,serif',fontSize:14,color:'#e8e8e8',fontStyle:'italic',lineHeight:1.6}}>Molecular Persistence Floor: No market mechanism satisfying Functional Necessity (A1), Open-Release Architecture (A2), and Environmental Non-Degradability (A3) can reduce the system beta below approximately 2.5 through private action alone. Grounded in the Second Law of Thermodynamics: the collection cost of dispersed PFAS is thermodynamically irreducible. (Postnieks, 2026c)</div>
            </div>

            {/* Channel waterfall */}
            {CHANNELS.length > 0 && (
              <div>
                <SectionTitle>Channel Decomposition &mdash; Welfare Cost Waterfall</SectionTitle>
                {CHANNELS.map((ch,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',marginBottom:8,gap:8}}>
                    <div style={{fontFamily:C.mono,fontSize:12,color:C.muted,width:22,textAlign:'right'}}>{ch.id}</div>
                    <div style={{fontFamily:C.serif,fontSize:15,color:C.text,width:300,flexShrink:0}}>{ch.name}</div>
                    <BetaBar beta={ch.beta} max={parseFloat(META.beta)||15} />
                    <div style={{fontFamily:C.mono,fontSize:13,color:C.gold,width:55,textAlign:'right'}}>{ch.beta}</div>
                    <div style={{fontFamily:C.mono,fontSize:13,color:C.text,width:110,textAlign:'right'}}>{ch.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHANNELS TAB */}
        {tab === 'channels' && (
          <div>
            <SectionTitle>Channel-by-Channel Breakdown</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={CHANNEL_DATA_FULL.filter(c => c.weight > 0)} margin={{top:20,right:20,bottom:5,left:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="shortName" tick={{fill:'rgba(255,255,255,0.4)',fontSize:12,fontFamily:"'JetBrains Mono'"}} />
                  <YAxis tick={{fill:'rgba(255,255,255,0.4)',fontSize:12,fontFamily:"'JetBrains Mono'"}} label={{value:"\u03b2_W",angle:-90,position:"insideLeft",fill:'rgba(255,255,255,0.3)',fontSize:13}} />
                  <Tooltip contentStyle={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',fontFamily:"'JetBrains Mono', monospace",fontSize:13}} />
                  <Bar dataKey="beta" radius={[2,2,0,0]}>
                    {CHANNEL_DATA_FULL.filter(c => c.weight > 0).map((entry,i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                  <ReferenceLine y={1} stroke="rgba(220,38,38,0.5)" strokeDasharray="4 4">
                    <Label value="Hollow Win threshold (\u03b2=1)" position="insideTopRight" fill="rgba(220,38,38,0.5)" fontSize={9} fontFamily="'JetBrains Mono'" />
                  </ReferenceLine>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
              <thead>
                <tr style={{background:C.thead}}>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>#</th>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Channel</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>&beta;<sub>W</sub>(i)</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Welfare $/yr</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Weight</th>
                </tr>
              </thead>
              <tbody>
                {CHANNEL_DATA_FULL.map((ch,i) => (
                  <tr key={i} style={{background: i%2===0 ? C.panel : C.bg}}>
                    <td style={{padding:'8px 12px',color:C.muted,borderBottom:`1px solid ${C.border}`}}>{i+1}</td>
                    <td style={{padding:'8px 12px',color:C.text,fontFamily:C.serif,fontSize:14,borderBottom:`1px solid ${C.border}`}}>
                      {ch.name}
                      {ch.severity === "EXCLUDED" && <span style={{fontSize:10,color:C.crimson,marginLeft:8}}>EXCLUDED</span>}
                    </td>
                    <td style={{padding:'8px 12px',color:ch.color,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>{ch.beta}</td>
                    <td style={{padding:'8px 12px',color:C.text,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>${ch.welfare}B</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>{ch.weight > 0 ? `${(ch.weight*100).toFixed(0)}%` : 'Excl.'}</td>
                  </tr>
                ))}
                <tr style={{background:C.thead}}>
                  <td colSpan={2} style={{padding:'10px 12px',color:C.gold,fontWeight:700,fontSize:14}}>AGGREGATE &beta;<sub>W</sub></td>
                  <td colSpan={3} style={{padding:'10px 12px',color:C.gold,fontWeight:700,fontSize:16,textAlign:'right'}}>{META.beta}</td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop:16,padding:12,background:'rgba(245,158,11,0.06)',border:`1px solid rgba(245,158,11,0.15)`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,lineHeight:1.6}}>
                Weighted aggregate: {CHANNEL_DATA_FULL.filter(c=>c.weight>0).map(c=>`${c.weight}\u00d7${c.beta}`).join(' + ')} = <span style={{color:C.gold}}>15.4</span> (channel-weighted avg) &middot; $6,580B / $186.7B = <span style={{color:C.crimson}}>35.2</span> (welfare ratio &beta;&#772; &mdash; primary measure)
              </div>
            </div>
          </div>
        )}

        {/* PSF TAB */}
        {tab === 'psf' && (
          <div>
            <SectionTitle>Private-Systemic Frontier</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={PSF_DATA} margin={{top:10,right:30,left:20,bottom:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="pi" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} label={{value:"\u03a0 (Private Payoff $B)",position:"bottom",fill:C.muted,fontFamily:C.mono,fontSize:11}} />
                  <YAxis stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} label={{value:"W (System Welfare $B)",angle:-90,position:"insideLeft",fill:C.muted,fontFamily:C.mono,fontSize:11}} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} />
                  <Area type="monotone" dataKey="w" stroke={C.gold} fill="rgba(245,158,11,0.15)" strokeWidth={2} />
                  <ReferenceLine x={PSF_PARAMS.pi_c} stroke={C.green} strokeDasharray="5 5" label={{value:"\u03a0\u1d9c",fill:C.green,fontFamily:C.mono,fontSize:11}} />
                  <ReferenceLine x={PSF_PARAMS.pi_p} stroke={C.crimson} strokeDasharray="5 5" label={{value:"Current",fill:C.crimson,fontFamily:C.mono,fontSize:11}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <Metric label={<>COOPERATIVE PAYOFF &Pi;<sub>C</sub></>} value={'$'+PSF_PARAMS.pi_c+'B'} sub="Welfare-maximizing extraction" color={C.green} />
              <Metric label={<>CURRENT PAYOFF &Pi;<sub>P</sub></>} value={'$'+PSF_PARAMS.pi_p+'B'} sub="Actual persistence premium" color={C.crimson} />
              <Metric label="OVER-EXTRACTION" value={'$'+(PSF_PARAMS.pi_p - PSF_PARAMS.pi_c).toFixed(1)+'B'} sub="Gap driving welfare loss" color={C.gold} />
            </div>
            <div style={{marginTop:16,padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.gold,marginBottom:8}}>SAPM &harr; CAPM CORRESPONDENCE</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
                <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold}}>SAPM CONSTRUCT</th>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold}}>CAPM ANALOGUE</th>
                </tr></thead>
                <tbody>
                  {[[<>&beta;<sub>W</sub> (System Beta)</>,'&beta; (Market Beta)'],[<>PSF (Private-Systemic Frontier)</>,<>SML (Security Market Line)</>],[<>&mu;* (Shadow Price)</>,<>r<sub>f</sub> (Risk-Free Rate)</>],[<>&Pi;<sup>sa</sup> (System-Adjusted Payoff)</>,<>Jensen&apos;s Alpha</>],['W (System Welfare)','No equivalent \u2014 structurally invisible'],[<>S<sub>W</sub> (Welfare Efficiency)</>,<>Sharpe Ratio</>]].map(([s,c],i) => (
                    <tr key={i} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                      <td style={{padding:'8px 12px',color:C.text}}>{s}</td>
                      <td style={{padding:'8px 12px',color:C.muted,fontFamily:C.serif}}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MONTE CARLO TAB */}
        {tab === 'monte-carlo' && (
          <div>
            <SectionTitle>Monte Carlo Simulation &mdash; {MC_STATS.n_draws.toLocaleString()} Draws (seed={MC_STATS.seed})</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={MC_HIST} margin={{top:10,right:30,left:20,bottom:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="bin" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:9}} angle={-45} textAnchor="end" interval={4} />
                  <YAxis stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} formatter={(v)=>[v,'Draws']} />
                  <Bar dataKey="count" fill={C.gold} />
                  <ReferenceLine x={MC_STATS.mean.toFixed(2)} stroke={C.crimson} strokeWidth={2} strokeDasharray="5 5" label={{value:'\u03bc='+MC_STATS.mean.toFixed(2),fill:C.crimson,fontFamily:C.mono,fontSize:11,position:'top'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
              <Metric label={<>MEAN &beta;<sub>W</sub></>} value={MC_STATS.mean.toFixed(2)} sub={'Median: '+MC_STATS.median.toFixed(2)} color={C.gold} />
              <Metric label="90% CI" value={'['+MC_STATS.ci_lo.toFixed(2)+', '+MC_STATS.ci_hi.toFixed(2)+']'} sub={'Range: '+MC_STATS.min.toFixed(2)+'\u2013'+MC_STATS.max.toFixed(2)} color={C.muted} />
              <Metric label="% HOLLOW WIN" value={MC_STATS.pct_hw.toFixed(1)+'%'} sub={<>&beta;<sub>W</sub> &gt; 1 in all draws</>} color={MC_STATS.pct_hw > 95 ? C.crimson : C.gold} />
              <Metric label={<>% &beta;<sub>W</sub> &gt; 3</>} value={MC_STATS.pct_above_3.toFixed(1)+'%'} color={MC_STATS.pct_above_3 > 90 ? C.crimson : C.gold} />
              <Metric label={<>% &beta;<sub>W</sub> &gt; 5</>} value={MC_STATS.pct_above_5.toFixed(1)+'%'} color={MC_STATS.pct_above_5 > 50 ? '#D97706' : C.gold} />
            </div>
            <SectionTitle>Channel Welfare Contributions</SectionTitle>
            <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
              <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                <th style={{padding:'8px 12px',textAlign:'left',color:C.gold}}>CHANNEL</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>MEAN $B</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>P5</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>P50</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>P95</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>SHARE</th>
              </tr></thead>
              <tbody>
                {MC_CHANNELS.map((ch,i) => (
                  <tr key={i} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,background:i%2===0?C.panel:C.bg}}>
                    <td style={{padding:'8px 12px',color:C.text,fontFamily:C.serif,fontSize:14}}>{ch.name}</td>
                    <td style={{padding:'8px 12px',color:C.gold,textAlign:'right',fontWeight:600}}>{ch.mean.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{ch.p5.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{ch.p50.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{ch.p95.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{(ch.share*100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:16,padding:12,background:'rgba(245,158,11,0.06)',border:`1px solid rgba(245,158,11,0.15)`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>Total welfare cost: <span style={{color:C.gold}}>${MC_WELFARE.mean.toLocaleString()}B</span> (90% CI: ${MC_WELFARE.ci_lo.toLocaleString()}B &ndash; ${MC_WELFARE.ci_hi.toLocaleString()}B) &middot; Distributions: Water &beta; tri(0.2, 0.5, 0.8) &middot; Health &beta; tri(3.0, 8.4, 15.0) &middot; Agri &beta; tri(0.1, 0.25, 0.5) &middot; Reg &beta; tri(0.03, 0.07, 0.15) &middot; Release &beta; tri(20, 35.2, 55)</div>
            </div>
          </div>
        )}

        {/* THRESHOLDS TAB */}
        {tab === 'thresholds' && (
          <div>
            <SectionTitle>Critical Thresholds & Predicted Crossover</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={Math.max(200, THRESHOLDS.length * 44)}>
                <BarChart data={THRESHOLDS.map(t=>({...t,yearsFromNow:t.year-2026}))} layout="vertical" margin={{top:10,right:30,left:180,bottom:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} label={{value:"Years from 2026",position:"bottom",fill:C.muted,fontFamily:C.mono,fontSize:11}} />
                  <YAxis type="category" dataKey="domain" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} width={170} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} />
                  <ReferenceLine x={0} stroke={C.crimson} strokeDasharray="3 3" label={{value:"NOW",fill:C.crimson,fontFamily:C.mono,fontSize:11}} />
                  <Bar dataKey="yearsFromNow" fill={C.gold} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'grid',gap:12}}>
              {THRESHOLDS.map((t,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'12px 16px',background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,borderLeft:`3px solid ${t.crossed ? C.crimson : C.gold}`}}>
                  <div style={{fontFamily:C.mono,fontSize:14,color:t.crossed ? C.crimson : C.gold,fontWeight:700,minWidth:50}}>~{t.year}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:C.mono,fontSize:13,color:C.text}}>{t.domain}</div>
                    <div style={{fontFamily:C.serif,fontSize:13,color:C.muted,marginTop:2}}>{t.status}</div>
                  </div>
                  <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,padding:'2px 8px',border:`1px solid ${C.border}`,borderRadius:2}}>{t.confidence}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,padding:16,background:'rgba(239,68,68,0.06)',border:`1px solid rgba(239,68,68,0.15)`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.crimson,marginBottom:8}}>FEEDBACK LOOPS</div>
              <div style={{fontFamily:C.serif,fontSize:14,color:C.muted,lineHeight:1.7}}>
                (1) Chemical synergism: microplastics concentrate PFAS via sorption &rarr; increased internal dose.
                (2) Infrastructure vulnerability: rising MPs foul the RO/IX filtration needed to remove PFAS.
                (3) Biological meltdown: Toxic Triad (radiation + PFAS + MPs) compromises DNA repair pathways.
                Crossing any single threshold accelerates all others.
              </div>
            </div>
          </div>
        )}

        {/* CROSS-DOMAIN TAB */}
        {tab === 'cross-domain' && (
          <div>
            <SectionTitle>Cross-Domain SAPM Registry</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={Math.min(500, CROSS_DOMAIN.filter(d => parseFloat(d.beta) > 0 && parseFloat(d.beta) <= 50).length * 28 + 60)}>
                <BarChart data={[...CROSS_DOMAIN].filter(d => parseFloat(d.beta) > 0 && parseFloat(d.beta) <= 50).sort((a,b) => parseFloat(a.beta) - parseFloat(b.beta)).map(d => ({...d, betaNum: parseFloat(d.beta)}))} layout="vertical" margin={{top:10,right:30,left:200,bottom:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} />
                  <YAxis type="category" dataKey="domain" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} width={190} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} />
                  <ReferenceLine x={1} stroke={C.crimson} strokeDasharray="3 3" label={{value:"\u03b2=1",fill:C.crimson,fontFamily:C.mono,fontSize:11}} />
                  <Bar dataKey="betaNum" fill={C.gold} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
              <thead>
                <tr style={{background:C.thead}}>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Domain</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>&beta;<sub>W</sub></th>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>PST Type</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>&Pi; ($/yr)</th>
                </tr>
              </thead>
              <tbody>
                {[...CROSS_DOMAIN].sort((a,b) => (parseFloat(b.beta)||0) - (parseFloat(a.beta)||0)).map((d,i) => (
                  <tr key={i} style={{background: d.key==='pfas-sapm-companion' ? 'rgba(34,197,94,0.08)' : i%2===0 ? C.panel : C.bg}}>
                    <td style={{padding:'8px 12px',color: d.key==='pfas-sapm-companion' ? '#22C55E' : C.text,fontFamily:C.serif,fontSize:14,borderBottom:`1px solid ${C.border}`}}>
                      {d.key==='pfas-sapm-companion' ? '\u25b6 ' : ''}{d.domain}
                    </td>
                    <td style={{padding:'8px 12px',color: parseFloat(d.beta)>10 ? C.crimson : C.gold,textAlign:'right',fontWeight:700,borderBottom:`1px solid ${C.border}`}}>{d.beta}</td>
                    <td style={{padding:'8px 12px',color:C.muted,borderBottom:`1px solid ${C.border}`}}>{d.type}</td>
                    <td style={{padding:'8px 12px',color:C.text,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>{d.pi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* METHODS TAB */}
        {tab === 'methods' && (
          <div>
            <SectionTitle>{AXIOMS.type === 'impossibility' ? 'Impossibility Axioms' : 'Institutional Failure Mechanisms'}</SectionTitle>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginBottom:20}}>
              {AXIOMS.items.map((a,i) => (
                <div key={i} style={{padding:16,background:C.panel,border:`1px solid ${AXIOMS.type === 'impossibility' ? 'rgba(239,68,68,0.2)' : C.border}`,borderRadius:4}}>
                  <div style={{fontFamily:C.mono,fontSize:12,color:AXIOMS.type === 'impossibility' ? C.crimson : C.gold,letterSpacing:1,marginBottom:6}}>{a.id}</div>
                  <div style={{fontFamily:C.serif,fontSize:15,color:C.text,fontWeight:600,marginBottom:6}}>{a.name}</div>
                  <div style={{fontFamily:C.serif,fontSize:14,color:C.muted,lineHeight:1.6}}>{a.description}</div>
                </div>
              ))}
            </div>

            <SectionTitle>System Welfare Function</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>{METHODS_DATA.welfare_function}</div>
            </div>

            <SectionTitle>Cooperative Baseline</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>{METHODS_DATA.cooperative_baseline}</div>
            </div>

            <SectionTitle>Persistence Premium by Sector</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              {PERSISTENCE_PREMIUM.map(s => (
                <div key={s.sector} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <div style={{width:6,height:6,borderRadius:1,background:s.color,flexShrink:0}} />
                  <div style={{flex:1,fontFamily:C.mono,fontSize:12,color:C.muted}}>{s.sector}</div>
                  <div style={{fontFamily:C.mono,fontSize:12,color:C.text,width:70,textAlign:'right'}}>${s.premium}B</div>
                  <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,width:40,textAlign:'right'}}>{s.ratio}%</div>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0 0',borderTop:'1px solid rgba(255,255,255,0.08)',marginTop:4}}>
                <span style={{fontFamily:C.mono,fontSize:13,color:C.gold,fontWeight:600}}>TOTAL</span>
                <span style={{fontFamily:C.mono,fontSize:13,color:C.gold,fontWeight:600}}>$186.7B (41%)</span>
              </div>
            </div>

            <SectionTitle>Pigouvian Insufficiency Theorem</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>
                No function &tau;: T &rarr; &real; of bilateral transaction data T recovers &part;W/&part;x<sub>i</sub>. The market price system is an insufficient statistic for W (Blackwell, 1951). The tax authority must observe W independently &mdash; precisely what EPA UCMR 5 and CDC biomonitoring are only now beginning to produce, 70+ years after industrial fluorochemistry began.
              </div>
            </div>

            <SectionTitle>Falsification Criteria</SectionTitle>
            <div style={{display:'grid',gap:8,marginBottom:20}}>
              {METHODS_DATA.falsification.map((f,i) => (
                <div key={i} style={{padding:'10px 16px',background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,fontFamily:C.serif,fontSize:14,color:C.text,lineHeight:1.6}}>{f}</div>
              ))}
            </div>

            <SectionTitle>Key Sources</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              {METHODS_DATA.key_sources.map((s,i) => (
                <div key={i} style={{fontFamily:C.mono,fontSize:12,color:C.muted,padding:'4px 0',borderBottom:`1px solid rgba(255,255,255,0.04)`}}>{s}</div>
              ))}
            </div>

            <div style={{padding:16,background:'rgba(245,158,11,0.06)',border:`1px solid rgba(245,158,11,0.15)`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.gold,marginBottom:8}}>CITATION</div>
              <div style={{fontFamily:C.serif,fontSize:14,color:C.text,lineHeight:1.6}}>
                Postnieks, E. (2026c). &ldquo;Applying the System Asset Pricing Model to Molecular Persistence: Measuring the System Welfare Cost of PFAS, Microplastics, and Persistent Organic Pollutants.&rdquo; Working Paper, March 2026.
              </div>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.muted,marginTop:8}}>
                Companion: Postnieks (2026a) &ldquo;The Private Pareto Trap&rdquo; &middot; Postnieks (2026b) &ldquo;Applying the SAPM to Bitcoin&rdquo;
              </div>
            </div>
          </div>
        )}

        {/* HIGHLIGHTS TAB */}
        {tab === 'highlights' && (
          <div>
            <SectionTitle>Key Findings</SectionTitle>
            {HIGHLIGHTS.map((h,i) => (
              <div key={i} style={{display:'flex',gap:12,marginBottom:12,background:C.panel,border:`1px solid ${C.border}`,borderRadius:3,padding:'12px 16px'}}>
                <div style={{fontFamily:C.mono,fontSize:16,color:C.gold,flexShrink:0}}>&blacktriangleright;</div>
                <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>{h}</div>
              </div>
            ))}
          </div>
        )}

        {/* SHADOW PRICE DUALITY TAB (PFAS-specific) */}
        {tab === 'shadow-price' && (
          <div>
            <SectionTitle>Shadow Price Duality (Proposition 16)</SectionTitle>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
              <Metric label={<>&mu;* = 1/&beta;<sub>W</sub></>} value="0.028" sub="Breakeven shadow price" color={C.crimson} />
              <Metric label={<>&beta;<sub>W</sub></>} value="35.2" sub="System welfare beta" color={C.gold} />
              <Metric label="Interpretation" value="2.8&cent;" sub="Per dollar of welfare" color={C.muted} />
            </div>
            <div style={{padding:16,background:C.panel,border:`2px solid ${C.crimson}`,borderRadius:4,marginBottom:16}}>
              <div style={{fontFamily:C.mono,fontSize:14,color:C.text,marginBottom:8}}>
                &mu;* = 1/&beta;<sub>W</sub> = 1/35.2 = <span style={{color:C.crimson,fontWeight:700}}>0.028</span>
              </div>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.muted,lineHeight:1.7}}>
                The breakeven shadow price and the system beta are the same structural quantity in different coordinates. At any &mu; &gt; 0.028 &mdash; 2.8 cents per dollar of welfare &mdash; the molecular persistence economy is welfare-destroying.
              </div>
            </div>

            <SectionTitle>Cross-Domain Allocation Rule</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={CROSS_DOMAIN_COMPARISON.filter(d => d.beta < 200)} margin={{top:20,right:20,bottom:5,left:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{fill:'rgba(255,255,255,0.4)',fontSize:12,fontFamily:"'JetBrains Mono'"}} />
                  <YAxis tick={{fill:'rgba(255,255,255,0.4)',fontSize:12,fontFamily:"'JetBrains Mono'"}} domain={[0,40]} />
                  <Tooltip contentStyle={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',fontFamily:"'JetBrains Mono'",fontSize:13}} />
                  <Bar dataKey="beta" radius={[2,2,0,0]}>
                    {CROSS_DOMAIN_COMPARISON.filter(d => d.beta < 200).map((d,i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                  <ReferenceLine y={35.2} stroke="rgba(220,38,38,0.4)" strokeDasharray="4 4">
                    <Label value="PFAS \u03b2=35.2" position="insideTopRight" fill="rgba(220,38,38,0.5)" fontSize={9} fontFamily="'JetBrains Mono'" />
                  </ReferenceLine>
                </BarChart>
              </ResponsiveContainer>
              <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,textAlign:'center'}}>ERCOT (&beta;=2,053) excluded from chart for scale. Shown in table below.</div>
            </div>

            {CROSS_DOMAIN_COMPARISON.map(d => (
              <div key={d.name} style={{display:'flex',alignItems:'center',gap:16,padding:'12px 16px',background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:8}}>
                <div style={{fontFamily:C.mono,fontSize:18,color:d.color,fontWeight:700,minWidth:60}}>{d.beta.toLocaleString()}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:C.mono,fontSize:13,color:C.text}}>{d.name}</div>
                  <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>{d.type} &middot; &mu;={d.mu} &middot; {d.reversibility}</div>
                </div>
                <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>{d.tStar}</div>
              </div>
            ))}

            <div style={{marginTop:16,padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4}}>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.muted,lineHeight:1.7}}>
                By Proposition 16 (Shadow Price Duality), an institutional designer should equalize &mu; across domains. Molecular persistence (&mu; = 0.028) is <strong style={{color:C.crimson}}>20&times; more welfare-destroying</strong> per dollar of regulatory forbearance than Bitcoin (&mu; = 0.56).
              </div>
            </div>
          </div>
        )}

        {/* BIFURCATION ANALYSIS TAB (PFAS-specific) */}
        {tab === 'bifurcation' && (
          <div>
            <SectionTitle>Bifurcation Analysis: Contained vs. Open-Release</SectionTitle>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              <div style={{padding:16,background:C.panel,border:`2px solid ${C.green}`,borderRadius:4}}>
                <div style={{fontFamily:C.mono,fontSize:12,color:C.green,letterSpacing:1,marginBottom:12}}>CONTAINED (&beta; &asymp; 2.5)</div>
                <div style={{display:'grid',gap:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.03)',padding:'6px 0'}}>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>Revenue</span>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.text}}>{BIFURCATION.contained.revenue}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.03)',padding:'6px 0'}}>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>System Beta</span>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.green}}>{BIFURCATION.contained.beta}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.03)',padding:'6px 0'}}>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>Capture Rate</span>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.text}}>{BIFURCATION.contained.capture}</span>
                  </div>
                </div>
                <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,marginTop:12}}>{BIFURCATION.contained.sectors}</div>
                <div style={{fontFamily:C.mono,fontSize:11,color:C.green,marginTop:4}}>{BIFURCATION.contained.regulation}</div>
              </div>

              <div style={{padding:16,background:C.panel,border:`2px solid ${C.crimson}`,borderRadius:4}}>
                <div style={{fontFamily:C.mono,fontSize:12,color:C.crimson,letterSpacing:1,marginBottom:12}}>OPEN-RELEASE (&beta; &gt; 50)</div>
                <div style={{display:'grid',gap:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.03)',padding:'6px 0'}}>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>Revenue</span>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.text}}>{BIFURCATION.openRelease.revenue}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.03)',padding:'6px 0'}}>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>System Beta</span>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.crimson}}>{BIFURCATION.openRelease.beta}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.03)',padding:'6px 0'}}>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>Capture Rate</span>
                    <span style={{fontFamily:C.mono,fontSize:13,color:C.text}}>{BIFURCATION.openRelease.capture}</span>
                  </div>
                </div>
                <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,marginTop:12}}>{BIFURCATION.openRelease.sectors}</div>
                <div style={{fontFamily:C.mono,fontSize:11,color:C.crimson,marginTop:4}}>{BIFURCATION.openRelease.regulation}</div>
              </div>
            </div>

            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.gold,marginBottom:8}}>POLICY IMPLICATION</div>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>
                The molecular persistence floor (&beta; &asymp; 2.5) applies only to contained-use fluorochemistry. Open-release sectors drive &beta; above 50 &mdash; a 20&times; multiplier. The bifurcation is binary: contain or ban. No intermediate regulation achieves welfare neutrality for open-release applications.
              </div>
            </div>
          </div>
        )}

        {/* DISAGGREGATION TAB (PFAS-specific) */}
        {tab === 'disaggregation' && (
          <div>
            <SectionTitle>Chemical-Class Disaggregation</SectionTitle>
            <div style={{display:'grid',gap:12,marginBottom:16}}>
              {DISAGGREGATION.map(d => (
                <div key={d.cls} style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,borderLeft:`3px solid ${d.color}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                    <div style={{fontFamily:C.mono,fontSize:18,color:d.color,fontWeight:700}}>{d.cls}</div>
                    <div style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>&beta;<sub>W</sub> &asymp; {d.betaRange}</div>
                    <div style={{marginLeft:'auto',fontFamily:C.mono,fontSize:13,color:C.gold}}>{d.welfare}</div>
                  </div>
                  <div style={{fontFamily:C.mono,fontSize:12,color:C.muted}}>Dominant channel: {d.dominant}</div>
                </div>
              ))}
            </div>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.gold,marginBottom:8}}>INDEPENDENCE RESULT</div>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>
                Each chemical class independently classifies as Hollow Win (&beta; &gt; 1). Microplastics dominate aggregate welfare cost ($5,800B/yr) due to Lancet healthcare burden and environmental release scale (475 Mt/yr plastic production). PFAS and POPs each independently exceed the Hollow Win threshold.
              </div>
            </div>
          </div>
        )}

        {/* SENSITIVITY / ROBUSTNESS TAB (PFAS-specific) */}
        {tab === 'sensitivity' && (
          <div>
            <SectionTitle>Cooperative Baseline Sensitivity</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:16}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${C.border}`}}>
                    {[<>&Pi;<sub>C</sub></>,<>Gap</>,<>Marginal &beta;</>,<>Welfare &beta;&#772;</>,<>Class.</>].map((h,i) => (
                      <th key={i} style={{padding:'8px 12px',textAlign:'left',color:C.gold,fontWeight:400,fontSize:12}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SENSITIVITY.map((s,i) => (
                    <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.03)',background:i%2===0?C.panel:C.bg}}>
                      <td style={{padding:'8px 12px',color:C.text}}>{s.baseline}</td>
                      <td style={{padding:'8px 12px',color:C.muted}}>{s.gap}</td>
                      <td style={{padding:'8px 12px',color:C.crimson}}>{s.margBeta}</td>
                      <td style={{padding:'8px 12px',color:C.text}}>{s.welfareBeta}</td>
                      <td style={{padding:'8px 12px',color:C.green}}>{s.classification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,marginTop:12}}>
                Counterintuitive: higher &Pi;<sub>C</sub> increases &beta;<sub>W</sub> because the welfare shortfall is fixed while the extraction gap narrows.
              </div>
            </div>

            <SectionTitle>Minimum Publishable Result</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`2px solid ${C.gold}`,borderRadius:4,marginBottom:16}}>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7,marginBottom:16}}>
                Under <em>simultaneously</em> conservative assumptions &mdash; healthcare 10&times; lower ($150B), premium doubled ($373B), max &Pi;<sub>C</sub> ($50B), bioaccumulation excluded:
              </div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <Metric label="Floor &beta;" value="> 4.5" color={C.crimson} />
                <Metric label="SAP negative at" value="&mu; > 0.12" color={C.gold} />
                <Metric label="MC Confirmation" value="100%" color={C.green} />
              </div>
            </div>

            <SectionTitle>DICE-2023 Benchmark</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4}}>
              {[
                {label:'Nordhaus (~3.5%)',value:'$188T',sub:'converges'},
                {label:'Stern (~1.4%)',value:'$470T',sub:'converges'},
                {label:'Weitzman (fat-tail)',value:'\u221e',sub:'diverges under A3'},
                {label:<>SAPM &beta;<sub>W</sub></>,value:'35.2',sub:'\u03c1-free, finite'},
              ].map((row,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <span style={{fontFamily:C.mono,fontSize:13,color:C.muted}}>{row.label}</span>
                  <span style={{fontFamily:C.mono,fontSize:13,color:C.text,fontWeight:500}}>{row.value} <span style={{color:C.muted,fontWeight:300,fontSize:11}}>{row.sub}</span></span>
                </div>
              ))}
              <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,marginTop:8}}>Where DICE produces 3 numbers depending on &rho;, SAPM produces 1.</div>
            </div>
          </div>
        )}

      </div>

      {/* S_W WELFARE EFFICIENCY RATIO */}
      <div style={{padding:"24px",background:C.panel,border:"2px solid #EF444440",borderRadius:4,margin:"24px 0"}}>
        <div style={{fontFamily:C.mono,fontSize:12,color:"#EF4444",letterSpacing:2,marginBottom:16}}>WELFARE EFFICIENCY RATIO</div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:12}}>
          <span style={{fontFamily:C.mono,fontSize:42,fontWeight:700,color:"#EF4444"}}>S<sub>W</sub> = 0.028</span>
        </div>
        <div style={{fontFamily:C.mono,fontSize:13,color:C.muted,marginBottom:16}}>
          S&P 500 long-run Sharpe &asymp; 0.40 &nbsp;|&nbsp; Acceptable &ge; 0.30 &nbsp;|&nbsp; Poor &lt; 0.10
        </div>
        <div style={{fontFamily:C.serif,fontSize:16,color:"#EF4444",lineHeight:1.7,fontStyle:"italic"}}>
          No institutional investor would hold an asset with this risk-adjusted return. This is what GDP calls productive output.
        </div>
      </div>

      {/* GREEK SYMBOL GLOSSARY */}
      <details style={{margin:"24px 0"}}>
        <summary style={{fontFamily:C.mono,fontSize:13,color:C.gold,cursor:"pointer",padding:"12px 16px",background:C.panel,border:"1px solid rgba(245,158,11,0.15)",borderRadius:4,letterSpacing:1,listStyle:"none",display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:C.gold,fontSize:14}}>&blacktriangleright;</span> WHAT THESE SYMBOLS MEAN &mdash; AND WHY THEY MATTER
        </summary>
        <div style={{background:C.panel,border:"1px solid rgba(245,158,11,0.15)",borderTop:"none",borderRadius:"0 0 4px 4px",padding:"16px",overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:C.mono,fontSize:13}}>
            <thead>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>SYMBOL</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>PRONOUNCED</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>WHAT IT MEASURES</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>CAPM EQUIVALENT</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>WHY IT MATTERS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>&beta;<sub>W</sub></td>
                <td style={{padding:"10px",color:C.text}}>beta-W</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>How much social welfare this sector destroys per dollar of private gain. &beta;<sub>W</sub> = 5.0 means $5 of welfare destroyed per $1 earned.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>&beta; (market beta) &mdash; measures how much an asset moves with the market</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>In CAPM, high beta means high financial risk. In SAPM, high &beta;<sub>W</sub> means high welfare destruction per dollar of revenue.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>S<sub>W</sub></td>
                <td style={{padding:"10px",color:C.text}}>S-W</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Private gain per dollar of system welfare cost. Higher is better &mdash; but in PST domains it is always low.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Sharpe Ratio &mdash; return per unit of risk</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>S&P 500 long-run Sharpe &asymp; 0.40. A Sharpe of 0.10 is poor. VW Dieselgate: S<sub>W</sub> = 0.12. LIBOR: S<sub>W</sub> &asymp; 0. ERCOT: S<sub>W</sub> = 0.0005. These are welfare efficiency ratios of industries that GDP calls productive.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>T*</td>
                <td style={{padding:"10px",color:C.text}}>T-star</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The predicted time until a Hollow Win collapses into outright failure.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Closest to duration or time-to-default in credit analysis</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>VW: T* = 6.1 years predicted, ~6 years observed. LIBOR: T* &le; 0 &mdash; the system was failing from day one. Seven years of concealment, not surplus.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>&mu;*</td>
                <td style={{padding:"10px",color:C.text}}>mu-star</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The efficient price of system welfare &mdash; what it would cost to make the deal system-preserving. &mu;* = 1/&beta;<sub>W</sub>. Derived from frontier geometry, not assigned by an analyst.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Closest to the risk-free rate as a floor price for risk</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>&beta;<sub>W</sub> = 7.4 &rarr; &mu;* &asymp; 0.135. &beta;<sub>W</sub> = 35.2 &rarr; &mu;* &asymp; 0.028. Lower &mu;* means cheaper welfare preservation in theory &mdash; PST means it never happens without intervention.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>&Pi;<sup>sa</sup></td>
                <td style={{padding:"10px",color:C.text}}>pi-SA</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The deal&apos;s true value after subtracting welfare cost. &Pi;<sup>sa</sup> = &Pi; &minus; &mu;* &middot; &Delta;W. If negative, the deal destroys more welfare than it creates.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Jensen&apos;s alpha &mdash; return above what risk justifies</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>A deal that looks like +$2.3M joint gain may be &minus;$2.4M system-adjusted. Every GDSS deployed today shows only the first number.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>W</td>
                <td style={{padding:"10px",color:C.text}}>W</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The health of the shared system both parties are embedded in. Not A&apos;s welfare. Not B&apos;s welfare. The system&apos;s.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>No CAPM equivalent &mdash; this is the variable CAPM cannot see</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The Private Pareto Theorem proves W cannot be computed from bilateral payoffs. It is structurally outside the payoff space. This is the impossibility.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>&delta;</td>
                <td style={{padding:"10px",color:C.text}}>delta</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Total accumulated welfare cost at crossover &mdash; the damage done before the Hollow Win collapses.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>No direct equivalent</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>VW: &delta; &asymp; $3.7 billion in accumulated emissions damage before EPA notice of violation.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>&eta;</td>
                <td style={{padding:"10px",color:C.text}}>eta</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>How quickly system damage feeds back into private costs. Low &eta; means the Hollow Win persists longer before collapsing.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Closest to mean reversion speed in financial models</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>VW: &eta; &asymp; 0.3. ERCOT: &eta; &asymp; 0 &mdash; no feedback until catastrophic failure.</td>
              </tr>
              <tr>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>&lambda;</td>
                <td style={{padding:"10px",color:C.text}}>lambda</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Rate of welfare cost accumulation per unit of private gain. Combined with &eta; and &delta; determines T*.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>No direct equivalent</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Higher &lambda; means faster damage accumulation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      {/* Footer */}
      <div style={{background:C.panel,borderTop:`1px solid ${C.border}`,padding:'10px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:40}}>
        <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>&copy; 2026 Erik Postnieks</div>
        <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>SAPM Working Paper &middot; Postnieks (2026c)</div>
      </div>
    <SAPMNav />
    </div>
  );
}
