import { useState } from "react";
import { ArrowRight, BadgeCheck, Check, ChevronLeft, ChevronRight, FileText, GraduationCap, Lightbulb, MapPin, Upload, X } from "lucide-react";
import "./SuggestSolution.css";

const problems = [
  { id: "IND-2026-000231", emoji: "🛣️", title: "Damaged Road", location: "Ranchi", priority: "High" },
  { id: "IND-2026-000244", emoji: "💧", title: "Contaminated handpump water", location: "Kanke", priority: "Critical" },
  { id: "IND-2026-000250", emoji: "🗑️", title: "Garbage pile-up near market", location: "Ranchi", priority: "High" },
  { id: "IND-2026-000219", emoji: "💡", title: "Frequent power cuts", location: "Namkum", priority: "Medium" },
  { id: "IND-2026-000205", emoji: "🏥", title: "Clinic short of medicines", location: "Angara", priority: "Critical" },
  { id: "IND-2026-000198", emoji: "🎓", title: "School toilet unusable", location: "Bero", priority: "Medium" },
  { id: "IND-2026-000187", emoji: "🌾", title: "Crop loss from erratic rain", location: "Mandar", priority: "High" },
  { id: "IND-2026-000176", emoji: "🌳", title: "Illegal tree felling", location: "Ranchi", priority: "Medium" },
  { id: "IND-2026-000160", emoji: "📱", title: "No mobile network coverage", location: "Lohardaga", priority: "Low" },
  { id: "IND-2026-000154", emoji: "🏙️", title: "Broken footbridge over drain", location: "Ramgarh", priority: "High" },
];

const priorityColor = { Critical: "#ff5470", High: "#ff6b57", Medium: "#ffc46b", Low: "#7ee0a5" };
const impactScale = ["Neighbourhood", "Village / Block", "District", "State / National"];
const beneficiaries = ["Farmers", "Students", "Children", "Women", "Elderly", "Local Residents", "Workers", "Businesses"];
const steps = ["Choose Problem", "Your Solution", "Review"];

const initialIndex = () => {
  const id = new URLSearchParams(window.location.search).get("problem");
  return problems.findIndex((p) => p.id === id);
};

export default function SuggestSolution({ navigate }) {
  const preselect = initialIndex();
  const [step, setStep] = useState(preselect >= 0 ? 2 : 1);
  const [selected, setSelected] = useState(preselect);
  const [data, setData] = useState({ title: "", solution: "", impact: "", scale: impactScale[1], beneficiaries: [] });
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [solId] = useState(() => `SOL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const update = (key, value) => setData({ ...data, [key]: value });
  const toggleBeneficiary = (b) => update("beneficiaries", data.beneficiaries.includes(b) ? data.beneficiaries.filter((x) => x !== b) : [...data.beneficiaries, b]);
  const problem = selected >= 0 ? problems[selected] : null;
  const canContinue = step === 1 ? selected >= 0 : step === 2 ? Boolean(data.title.trim() && data.solution.trim() && data.impact.trim()) : true;
  const next = () => { if (!canContinue) return; step < 3 ? setStep(step + 1) : setSubmitted(true); };
  const reset = () => { setSelected(-1); setData({ title: "", solution: "", impact: "", scale: impactScale[1], beneficiaries: [] }); setFiles([]); setSubmitted(false); setStep(1); navigate("/suggest"); };

  if (submitted) return <Submitted problem={problem} solId={solId} navigate={navigate} onReset={reset} />;

  return <div className="jn-wizard">
    <div className="jn-wizard-top">
      <div><span className="jn-eyebrow"><Lightbulb size={14} /> I have an idea for this problem</span><h1>Suggest a Solution</h1></div>
      <span className="jn-step-label">Step {step} of 3</span>
    </div>
    <div className="jn-stepper">{steps.map((name, index) => <button key={name} className={step >= index + 1 ? "active" : ""} onClick={() => index + 1 < step && setStep(index + 1)}><span>{step > index + 1 ? <Check size={13} /> : `0${index + 1}`}</span>{name}</button>)}</div>
    <div className="jn-wizard-card">
      {step === 1 && <>
        <span className="jn-eyebrow">Instead of only reporting — contribute</span>
        <h2>Which problem do you want to help solve?</h2>
        <p className="jn-subtitle">Choose a reported problem below. Your idea is attached to it so universities and experts can evaluate it against the real challenge.</p>
        <div className="jn-suggest-picker">{problems.map((p, i) => <button type="button" key={p.id} className={`jn-suggest-pick ${selected === i ? "selected" : ""}`} onClick={() => setSelected(i)}>
          {selected === i && <span className="jn-suggest-check"><Check size={13} /></span>}
          <span className="jn-suggest-emoji">{p.emoji}</span>
          <span className="jn-suggest-pick-body"><b>{p.title}</b><small><MapPin size={12} /> {p.location} · {p.id}</small></span>
          <i className="jn-suggest-dot" style={{ background: priorityColor[p.priority] }} title={`${p.priority} priority`} />
        </button>)}</div>
      </>}
      {step === 2 && problem && <>
        <div className="jn-suggest-selected"><span className="se">{problem.emoji}</span><div><b>Solving: {problem.title}</b><small><MapPin size={12} /> {problem.location} · {problem.id}</small></div><button type="button" className="jn-suggest-change" onClick={() => setStep(1)}>Change</button></div>
        <span className="jn-eyebrow">Your contribution</span>
        <h2>Share your solution idea.</h2>
        <p className="jn-subtitle">Describe it clearly — experts score every suggestion for feasibility, cost and community impact.</p>
        <label>Solution title <b>*</b><input maxLength="90" value={data.title} onChange={e => update("title", e.target.value)} placeholder="Example: Community rainwater recharge pits" /><small>{data.title.length} / 90</small></label>
        <label>Write your solution <b>*</b><textarea maxLength="1200" rows="6" value={data.solution} onChange={e => update("solution", e.target.value)} placeholder="Explain your idea — how it works, what is needed, and why it can work locally." /><small>{data.solution.length} / 1200</small></label>
        <label className="jn-upload"><Upload size={23} /><b>Upload supporting image or document</b><span>JPG, PNG, PDF, DOC · Max 10 MB each</span><input type="file" multiple onChange={e => setFiles([...e.target.files])} /></label>
        {files.length > 0 && <div className="jn-file-list">{files.map(file => <div key={file.name}><FileText size={16} />{file.name}<small>{(file.size / 1024).toFixed(0)} KB</small><X size={15} onClick={() => setFiles(files.filter(x => x.name !== file.name))} /></div>)}</div>}
        <label>Explain the expected impact <b>*</b><textarea maxLength="600" rows="4" value={data.impact} onChange={e => update("impact", e.target.value)} placeholder="What changes if this idea is adopted? Who benefits and how much?" /><small>{data.impact.length} / 600</small></label>
        <div className="jn-select-label">How wide is the impact?</div>
        <div className="jn-choice-grid">{impactScale.map(s => <button type="button" className={data.scale === s ? "selected" : ""} key={s} onClick={() => update("scale", s)}>{data.scale === s && <Check size={14} />}{s}</button>)}</div>
        <div className="jn-select-label">Who benefits?</div>
        <div className="jn-choice-grid">{beneficiaries.map(b => <button type="button" className={data.beneficiaries.includes(b) ? "selected" : ""} key={b} onClick={() => toggleBeneficiary(b)}>{data.beneficiaries.includes(b) && <Check size={14} />}{b}</button>)}</div>
      </>}
      {step === 3 && problem && <>
        <span className="jn-eyebrow">Review & submit</span>
        <h2>Ready to send your idea for evaluation?</h2>
        <p className="jn-subtitle">Review your suggestion before it reaches the JanSetu expert network.</p>
        <div className="jn-review-grid">
          <div><span>Problem</span><b>{problem.emoji} {problem.title}</b><p>{problem.location} · {problem.id}</p></div>
          <div><span>Your solution</span><b>{data.title}</b><p>{data.solution}</p></div>
          <div><span>Expected impact</span><b>{data.scale} · {data.beneficiaries.length ? data.beneficiaries.join(", ") : "Community"}</b><p>{data.impact}</p></div>
          <div><span>Attachments</span><b>{files.length ? `${files.length} file(s)` : "No attachments"}</b><p>All files are checked before evaluation.</p></div>
        </div>
        <label className="jn-declaration"><input type="checkbox" defaultChecked /> I confirm this is my own idea and the information is accurate.</label>
        <label className="jn-declaration"><input type="checkbox" defaultChecked /> I agree that universities, experts and authorized partners may evaluate and develop this suggestion.</label>
      </>}
    </div>
    <div className="jn-wizard-actions">
      {step > 1 && <button className="jn-back" onClick={() => setStep(step - 1)}><ChevronLeft size={17} /> Back</button>}
      <button className="jn-btn" onClick={next} disabled={!canContinue}>{step === 3 ? "Submit Solution" : "Continue"}<ChevronRight size={17} /></button>
    </div>
  </div>;
}

function Submitted({ problem, solId, navigate, onReset }) {
  return <div className="jn-success">
    <div className="jn-success-check"><BadgeCheck size={34} /></div>
    <span className="jn-eyebrow">Idea submitted for evaluation</span>
    <h1>Thank you for <em>contributing.</em></h1>
    <p>Your solution{problem ? ` for “${problem.title}”` : ""} is now with the JanSetu expert network.</p>
    <div className="jn-id-card"><span>Solution ID</span><strong>{solId}</strong><span>Status</span><b>Under evaluation</b></div>
    <div className="jn-suggest-eval"><GraduationCap size={22} /><div><b>Universities and experts will evaluate your idea</b><p>Research teams and domain experts score every suggestion for feasibility, cost and community impact. Shortlisted ideas move to prototyping with industry partners — and you are credited as the contributor.</p></div></div>
    <div className="jn-mini-timeline">{["Submitted", "Expert Evaluation", "Shortlisted", "Prototyping", "Deployed"].map((x, i) => <div className={i === 0 ? "active" : ""} key={x}><span>{i === 0 ? <Check size={12} /> : i + 1}</span><b>{x}</b></div>)}</div>
    <div className="jn-hero-actions"><button className="jn-btn" onClick={() => navigate("/explore")}>Explore more problems <ArrowRight size={16} /></button><button className="jn-btn secondary" onClick={onReset}>Suggest another <ArrowRight size={16} /></button></div>
  </div>;
}
