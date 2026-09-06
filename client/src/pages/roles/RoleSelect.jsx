import { useState } from "react";
import { ArrowRight, Building2, GraduationCap, Landmark, Sparkles, UserRound } from "lucide-react";
import { ROLES, ROLE_IDS, UNIVERSITY_SUBROLES } from "../../rbac/roles";
import { ASSISTANT_EXAMPLES, recommendRole } from "../../rbac/roleAssistant";

const ROLE_ICONS = { citizen: UserRound, government: Landmark, university: GraduationCap, industry: Building2 };
const ORG_LABEL = { government: "Department / Authority", university: "University / Institution", industry: "Company / Organization" };
const ORG_PLACEHOLDER = {
  government: "e.g. Ranchi Municipal Corporation, Public Works Department",
  university: "e.g. National Institute of Technology, Patna",
  industry: "e.g. Your company or organization name",
};

export default function RoleSelect({ onSubmit }) {
  const [role, setRole] = useState(null);
  const [org, setOrg] = useState("");
  const [subRole, setSubRole] = useState("student");
  const [ask, setAsk] = useState("");
  const [recommendation, setRecommendation] = useState(null);

  return <div className="jn-roleselect">
    <span className="jn-eyebrow">Step 1 of 2 · Choose your role</span>
    <h2>How will you use this platform?</h2>
    <p className="jn-subtitle">Pick the option that best describes you. You can add more roles later from your profile.</p>
    <div className="jn-roleselect-grid">
      {ROLE_IDS.map((id) => { const r = ROLES[id]; return <button type="button" key={id} className={`jn-role-card ${role === id ? "selected" : ""}`} onClick={() => setRole(id)}>
        <span className="jn-role-card-emoji">{r.emoji}</span>
        <b>{r.label}</b>
        <p>{r.signupDescription}</p>
        {r.verificationRequired ? <small>Institutional verification required</small> : <small>No verification needed</small>}
      </button>; })}
    </div>

    <div className="jn-role-assist">
      <div className="jn-role-assist-head"><Sparkles size={16} /> Not sure? Ask the AI assistant</div>
      <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder='e.g. "I want to report broken roads in my area."' />
      <div className="jn-role-assist-actions">
        <button type="button" className="jn-btn" onClick={() => setRecommendation(recommendRole(ask))}>Ask</button>
        {ASSISTANT_EXAMPLES.map((ex) => <button type="button" key={ex.text} className="jn-role-example" onClick={() => { setAsk(ex.text); setRecommendation(ex.role); }}>{ex.text}</button>)}
      </div>
      {recommendation && <div className="jn-role-assist-result">You appear to be using the platform as a <b>{ROLES[recommendation].label}</b>. <button type="button" onClick={() => setRole(recommendation)}>Use this role</button></div>}
    </div>

    {role && <div className="jn-role-org">
      {role !== "citizen" && <label>{ORG_LABEL[role]} <b>*</b><input value={org} onChange={(e) => setOrg(e.target.value)} placeholder={ORG_PLACEHOLDER[role]} /></label>}
      {role === "university" && <><div className="jn-select-label">I am a</div><div className="jn-choice-grid">{Object.entries(UNIVERSITY_SUBROLES).map(([key, sr]) => <button type="button" key={key} className={subRole === key ? "selected" : ""} onClick={() => setSubRole(key)}>{sr.label}</button>)}</div></>}
      <button type="button" className="jn-btn" disabled={role !== "citizen" && !org.trim()} onClick={() => onSubmit({ role, org: org.trim(), subRole })}>Continue <ArrowRight size={16} /></button>
    </div>}
  </div>;
}
