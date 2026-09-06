import { useState } from "react";
import { BarChart3, CheckCircle2, Inbox, MapPin, MessageSquare, Network, Send, Sparkles, XCircle } from "lucide-react";
import { analytics, industries, problems, universities } from "../../data/jansetuMockData";
import { appendAudit, getAudit, getFirstName } from "../../services/userProfileService";
import { activeEntry, roleOf } from "../../rbac/roles";
import VerificationNotice from "../../components/VerificationNotice";
import { EmptyState, Kpis, Panel, PrivilegeButton, RoleHero, Tag } from "./dashboardBits";

const DEPARTMENTS = ["Public Works", "Water Resources", "Health Department", "Transport", "Urban Development", "Education"];
const severityTone = { Critical: "bad", High: "bad", Moderate: "warn", Medium: "warn", Low: "info" };

const INITIAL_QUEUE = problems.map((p, i) => ({
  ...p,
  aiCategory: p.domains[0],
  aiSeverity: p.priority === "High" ? "Critical" : p.priority === "Medium" ? "Moderate" : "Low",
  aiConfidence: [92, 88, 79, 84][i] || 80,
  duplicates: [3, 1, 0, 2][i] || 0,
  submittedBy: ["Citizen report", "Field officer", "Community group", "Citizen report"][i] || "Citizen report",
  status: "new", dept: "", reason: "",
}));

const STATUS_PILL = { new: ["New report", "info"], verified: ["Verified", "good"], rejected: ["Rejected", "bad"], info: ["Info requested", "warn"], assigned: ["Assigned", "good"] };

function ReviewQueue({ user, queue, setQueue, log, filter, emptyText }) {
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [assigning, setAssigning] = useState(null);
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const items = queue.filter(filter || (() => true));
  const act = (id, status, extra) => setQueue((q) => q.map((x) => (x.id === id ? { ...x, status, ...extra } : x)));
  if (!items.length) return <EmptyState icon={Inbox} title="Nothing in this queue" text={emptyText || "Reports will appear here as citizens submit them."} />;

  return <div className="jn-gov-queue">
    {items.map((r) => <article className="jn-gov-item" key={r.id}>
      <div className="jn-gov-item-main">
        <div className="jn-gov-item-top"><small>{r.id} · {r.submittedBy} · {r.date}</small>
          <Tag tone={STATUS_PILL[r.status][1]}>{STATUS_PILL[r.status][0]}</Tag></div>
        <h4>{r.title}</h4>
        <p className="jn-report-loc"><MapPin size={13} /> {r.location}</p>
        <div className="jn-gov-ai">
          <span className="jn-gov-ai-title"><Sparkles size={13} /> AI Analysis</span>
          <Tag tone="info">Category: {r.aiCategory}</Tag>
          <Tag tone={severityTone[r.aiSeverity]}>Severity: {r.aiSeverity}</Tag>
          <Tag tone="muted">Confidence {r.aiConfidence}%</Tag>
          <Tag tone={r.duplicates ? "warn" : "muted"}>{r.duplicates} duplicate{r.duplicates === 1 ? "" : "s"}</Tag>
        </div>
        {r.status === "assigned" && <p className="jn-gov-assigned"><Network size={13} /> Assigned to <b>{r.dept}</b></p>}
        {r.status === "rejected" && r.reason && <p className="jn-gov-assigned"><XCircle size={13} /> Reason: {r.reason}</p>}
      </div>

      <div className="jn-gov-item-actions">
        {r.status === "new" && <>
          <PrivilegeButton user={user} perm="report:verify" onClick={() => { act(r.id, "verified"); log({ action: "Verified report", target: r.id, detail: r.title }); }}><CheckCircle2 size={14} /> Verify</PrivilegeButton>
          <PrivilegeButton user={user} perm="report:reject" secondary onClick={() => { setRejecting(r.id); setReason(""); }}><XCircle size={14} /> Reject</PrivilegeButton>
          <PrivilegeButton user={user} perm="report:request-info" secondary onClick={() => { act(r.id, "info"); log({ action: "Requested information", target: r.id, detail: r.title }); }}><MessageSquare size={14} /> Request info</PrivilegeButton>
        </>}
        {(r.status === "verified" || r.status === "new") &&
          <PrivilegeButton user={user} perm="report:assign" onClick={() => { setAssigning(r.id); }}><Network size={14} /> Assign department</PrivilegeButton>}

        {rejecting === r.id && <div className="jn-gov-inline">
          <label>Reason for rejection <b>*</b>
            <textarea rows="2" value={reason} placeholder="Explain why this report is being rejected..." onChange={(e) => setReason(e.target.value)} /></label>
          <div className="jn-gov-inline-actions">
            <PrivilegeButton user={user} perm="report:reject" label="Confirm rejection" onClick={() => { act(r.id, "rejected", { reason: reason.trim() || "Not specified" }); log({ action: "Rejected report", target: r.id, detail: `${reason.trim() || "No reason"} · ${r.title}` }); setRejecting(null); }} />
            <button type="button" className="jn-back" onClick={() => setRejecting(null)}>Cancel</button>
          </div>
        </div>}

        {assigning === r.id && <div className="jn-gov-inline">
          <label>Assign to department <b>*</b>
            <select value={dept} onChange={(e) => setDept(e.target.value)}>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select></label>
          <div className="jn-gov-inline-actions">
            <PrivilegeButton user={user} perm="report:assign" label="Confirm assignment" onClick={() => { act(r.id, "assigned", { dept }); log({ action: "Assigned department", target: r.id, detail: `${dept} · ${r.title}` }); setAssigning(null); }} />
            <button type="button" className="jn-back" onClick={() => setAssigning(null)}>Cancel</button>
          </div>
        </div>}
      </div>
    </article>)}
  </div>;
}

export default function GovernmentDashboard({ user, navigate, path, onApproveVerification }) {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [audit, setAudit] = useState(getAudit());
  const tab = (path.split("?tab=")[1] || "overview").split("&")[0];
  const org = (activeEntry(user) || {}).org || "Government authority";
  const log = (entry) => setAudit(appendAudit({ ...entry, by: `${getFirstName(user)} · ${org}`, role: roleOf(user) }));
  const counts = { new: queue.filter((r) => r.status === "new").length, verified: queue.filter((r) => r.status === "verified").length, assigned: queue.filter((r) => r.status === "assigned").length };

  const queuePane = (filter, emptyText) => <Panel eyebrow="Review queue" title="Citizen reports awaiting action">
    <ReviewQueue user={user} queue={queue} setQueue={setQueue} log={log} filter={filter} emptyText={emptyText} /></Panel>;

  const body = () => {
    switch (tab) {
      case "new-reports": return queuePane((r) => r.status === "new", "No new reports. Everything has been triaged.");
      case "verification": return queuePane((r) => r.status === "new" || r.status === "info", "No reports pending verification.");
      case "priority": return queuePane((r) => r.aiSeverity === "Critical", "No critical-priority problems right now.");
      case "assign": return queuePane((r) => r.status === "verified", "Verify a report before assigning it to a department.");
      case "request": return queuePane((r) => r.status === "info", "No outstanding information requests.");
      case "ai": return <Panel eyebrow="AI Analysis" title="Automated triage of incoming reports">
        <div className="jn-gov-ai-table">{queue.map((r) => <div className="jn-gov-ai-row" key={r.id}>
          <b>{r.title}</b>
          <div className="jn-gov-ai"><Tag tone="info">{r.aiCategory}</Tag><Tag tone={severityTone[r.aiSeverity]}>{r.aiSeverity}</Tag>
            <Tag tone="muted">{r.aiConfidence}%</Tag><Tag tone={r.duplicates ? "warn" : "muted"}>{r.duplicates} dup</Tag></div>
        </div>)}</div></Panel>;
      case "resolution": return <Panel eyebrow="Resolution tracking" title="Problems moving toward closure">
        <div className="jn-role-list">{queue.filter((r) => r.status === "assigned").map((r) =>
          <div className="jn-role-list-item" key={r.id}><CheckCircle2 size={16} className="jn-role-list-icon" />
            <div><b>{r.title}</b><span>{r.dept} · in progress</span></div><Tag tone="good">On track</Tag></div>)}
          {counts.assigned === 0 && <EmptyState icon={CheckCircle2} title="No resolutions in progress" text="Assign a verified report to a department to begin tracking resolution." />}
        </div></Panel>;
      case "map": return <Panel eyebrow="Geographic map" title="Where problems are concentrated">
        <div className="jn-india-placeholder"><MapPin size={50} /><h3>District-level problem density</h3>
          <p>Geographic clustering of verified reports, ready for a Leaflet + OpenStreetMap layer.</p></div>
        <div className="jn-gov-trends">{[["Ranchi, Jharkhand", 42], ["Guwahati, Assam", 31], ["Kalahandi, Odisha", 18], ["Pune, Maharashtra", 25]].map(([d, v]) =>
          <div className="jn-bar" key={d}><span>{d}</span><i><b style={{ width: `${v * 2}%` }} /></i><strong>{v}</strong></div>)}</div></Panel>;
      case "analytics": return <><Kpis items={[{ label: "New Reports", value: String(counts.new) }, { label: "Verified", value: String(counts.verified) }, { label: "Assigned", value: String(counts.assigned) }, { label: "Avg. AI Confidence", value: "86%" }]} />
        <Panel eyebrow="Analytics" title="Problems by domain">{analytics.domains.map((x) =>
          <div className="jn-bar" key={x.label}><span>{x.label}</span><i><b style={{ width: `${x.value}%` }} /></i><strong>{x.value}</strong></div>)}</Panel></>;
      case "stakeholders": return <Panel eyebrow="Stakeholders" title="Universities & industry partners">
        <div className="jn-role-list">{[...universities.map((u) => ({ ...u, kind: "University" })), ...industries.map((i) => ({ ...i, kind: "Industry" }))].map((s) =>
          <div className="jn-role-list-item" key={s.name}><Network size={16} className="jn-role-list-icon" />
            <div><b>{s.name}</b><span>{s.kind} · {s.location || s.expertise}</span></div>
            <PrivilegeButton user={user} perm="stakeholder:contact" secondary label="Contact" onClick={() => log({ action: "Contacted stakeholder", target: s.name, detail: s.kind })} /></div>)}</div></Panel>;
      case "audit": return <Panel eyebrow="Audit log" title="Every administrative action is recorded">
        {audit.length ? <div className="jn-audit">{audit.map((a, i) => <div className="jn-audit-row" key={i}>
          <Tag tone="info">{a.action}</Tag><div><b>{a.target}</b><span>{a.detail}</span></div>
          <small>{a.by}<br />{new Date(a.at).toLocaleString()}</small></div>)}</div>
          : <EmptyState icon={BarChart3} title="No actions logged yet" text="Verify, reject, request info or assign a report to build the audit trail." />}</Panel>;
      case "settings": return <Panel eyebrow="Settings" title="Department profile">
        <div className="jn-gov-settings"><div><span>Organisation</span><b>{org}</b></div>
          <div><span>Officer</span><b>{getFirstName(user)}</b></div>
          <div><span>Verification</span><b>{(activeEntry(user) || {}).verificationStatus}</b></div>
          <div><span>Notifications</span><b>New reports, assignments, escalations</b></div></div>
        <p className="jn-subtitle">Privileged controls are enabled only after institutional verification. This demo stores all data locally on your device.</p></Panel>;
      default: return <>
        <Kpis items={[{ label: "New Reports", value: String(counts.new) }, { label: "Pending Verification", value: String(queue.filter((r) => r.status === "info").length) }, { label: "Assigned", value: String(counts.assigned) }, { label: "Resolved this month", value: "15" }]} />
        {queuePane((r) => r.status === "new", "No new reports. Everything has been triaged.")}
        <Panel eyebrow="Jump to" title="Administrative tools">
          <div className="jn-gov-shortcuts">{[["verification", "Verification queue"], ["priority", "Priority problems"], ["assign", "Assign departments"], ["analytics", "Analytics"], ["audit", "Audit log"], ["stakeholders", "Stakeholders"]].map(([t, label]) =>
            <button type="button" key={t} className="jn-gov-shortcut" onClick={() => navigate(`/government/dashboard?tab=${t}`)}><Send size={14} /> {label}</button>)}</div></Panel></>;
    }
  };

  return <div className="jn-role-page">
    <VerificationNotice user={user} onApprove={onApproveVerification} />
    <RoleHero eyebrow={`Government · ${org}`} title="Verification & resolution console"
      subtitle="Review citizen reports, act on AI triage, assign departments and keep a complete audit trail." />
    {body()}
  </div>;
}
