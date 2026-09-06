import { useState } from "react";
import { Activity, BadgeCheck, Check, Clock, Landmark, MapPin, Route, Send, Sparkles, UserCheck, Wrench } from "lucide-react";
import "./TrackProblem.css";

const stages = [
  { key: "submitted", label: "Submitted", icon: Send, note: "Your report was received and logged in the system." },
  { key: "ai", label: "AI Analyzed", icon: Sparkles, note: "Our AI checked the details, category and possible duplicates." },
  { key: "verification", label: "Government Verification", icon: Landmark, note: "Forwarded to the concerned department for verification." },
  { key: "assigned", label: "Assigned", icon: UserCheck, note: "A field officer or work team was assigned to your case." },
  { key: "progress", label: "In Progress", icon: Wrench, note: "Repair or action work has begun on site." },
  { key: "resolved", label: "Resolved", icon: BadgeCheck, note: "The issue was fixed, verified and your report closed." },
];

const reports = [
  { id: "#1042", emoji: "🛣️", title: "Road Damage", location: "Ranchi", submitted: "05 Sep 2026", current: 4, dates: ["05 Sep", "05 Sep", "06 Sep", "06 Sep", "07 Sep", ""], update: "A road-repair crew is on site filling the potholes and re-laying the damaged stretch.", eta: "Expected to resolve by 12 Sep 2026" },
  { id: "#1038", emoji: "💧", title: "Water Logging", location: "Kanke", submitted: "06 Sep 2026", current: 2, dates: ["06 Sep", "06 Sep", "", "", "", ""], update: "Your report is with the Municipal Corporation and a site inspection is being scheduled.", eta: "Next update expected by 10 Sep 2026" },
  { id: "#0997", emoji: "💡", title: "Streetlight Fault", location: "Namkum", submitted: "22 Aug 2026", current: 6, dates: ["22 Aug", "22 Aug", "23 Aug", "24 Aug", "25 Aug", "27 Aug"], update: "All faulty streetlights were replaced and tested. Thank you for reporting!", eta: "Closed on 27 Aug 2026" },
];

const stageState = (i, current) => (i < current ? "done" : i === current ? "active" : "pending");

export default function TrackProblem() {
  const [selected, setSelected] = useState(0);
  const report = reports[selected];
  const done = Math.min(report.current, stages.length);
  const pct = Math.round((done / stages.length) * 100);
  const activeStage = stages[Math.min(report.current, stages.length - 1)];
  const resolved = report.current >= stages.length;

  return <>
    <section className="jn-inner-hero">
      <span className="jn-eyebrow"><Route size={14} /> Live complaint tracking</span>
      <h1>Track my problem</h1>
      <p>Follow your complaint step by step — from the moment you submit it to the day it's resolved — so you always know exactly what happened.</p>
    </section>
    <main className="jn-page-content">
      <div className="jn-track-tabs">{reports.map((r, i) => <button key={r.id} className={`jn-track-tab ${i === selected ? "active" : ""}`} onClick={() => setSelected(i)}><span>{r.emoji}</span>{r.title} <b>{r.id}</b></button>)}</div>

      <div className="jn-track-hero">
        <div className="jn-track-hero-left">
          <div className="jn-track-hero-emoji">{report.emoji}</div>
          <div>
            <h2>{report.title} <b>{report.id}</b></h2>
            <div className="jn-track-hero-sub">
              <span><MapPin size={13} /> {report.location}</span>
              <span><Clock size={13} /> Submitted {report.submitted}</span>
            </div>
          </div>
        </div>
        <div className="jn-track-badge">{resolved ? <BadgeCheck size={15} /> : <Activity size={15} />} {resolved ? "Resolved" : activeStage.label}</div>
      </div>

      <div className="jn-track-progress">
        <div className="jn-track-progress-head"><span>Step {Math.min(report.current + 1, stages.length)} of {stages.length}</span><span>{pct}% complete</span></div>
        <div className="jn-track-bar"><i style={{ width: `${pct}%` }} /></div>
      </div>

      <ol className="jn-track-steps">
        {stages.map((s, i) => {
          const state = stageState(i, report.current);
          const Icon = s.icon;
          return <li key={s.key} className={`jn-track-step ${state}`}>
            <span className="jn-track-node">{state === "done" ? <Check size={16} /> : <Icon size={17} />}</span>
            <span className="jn-track-text"><b className="jn-track-label">{s.label}</b><small className="jn-track-date">{report.dates[i] || (state === "pending" ? "Pending" : state === "active" ? "Ongoing" : "—")}</small></span>
          </li>;
        })}
      </ol>

      <div className="jn-track-now">
        {resolved ? <BadgeCheck size={20} /> : <Activity size={20} />}
        <div>
          <h3>{resolved ? "This problem is resolved" : `What's happening now — ${activeStage.label}`}</h3>
          <p>{report.update}</p>
          <span className="jn-track-eta"><Clock size={14} /> {report.eta}</span>
        </div>
      </div>
    </main>
  </>;
}
