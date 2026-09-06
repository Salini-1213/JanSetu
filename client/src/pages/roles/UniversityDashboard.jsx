import { useState } from "react";
import { Bell, BookOpen, FlaskConical, GraduationCap, Handshake, Lightbulb, MapPin, Search, TrendingUp, Users } from "lucide-react";
import { industries, problems, universities } from "../../data/jansetuMockData";
import { getFirstName } from "../../services/userProfileService";
import { UNIVERSITY_SUBROLES, activeEntry } from "../../rbac/roles";
import VerificationNotice from "../../components/VerificationNotice";
import { EmptyState, Kpis, Panel, PrivilegeButton, RoleHero, Tag } from "./dashboardBits";

const DOMAINS = ["All", "Water Resources", "Healthcare", "Urban Development", "Accessibility", "Agriculture"];
const INITIAL_TEAMS = [{ id: "T-01", name: "HydroSense Collective", problem: "Water shortage affecting farmers", members: 6, lead: "Dr. R. Mehta" }];
const INITIAL_SOLUTIONS = [{ id: "S-01", title: "Low-cost soil moisture sensor network", problem: "Water shortage affecting farmers", status: "Under evaluation", score: 82 }];

export default function UniversityDashboard({ user, navigate, path, onApproveVerification }) {
  const [domain, setDomain] = useState("All");
  const [adopted, setAdopted] = useState([]);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const tab = (path.split("?tab=")[1] || "overview").split("&")[0];
  const org = (activeEntry(user) || {}).org || "University";
  const sub = UNIVERSITY_SUBROLES[user.subRole] || UNIVERSITY_SUBROLES.student;
  const discover = problems.filter((p) => domain === "All" || p.domains.includes(domain));

  const adopt = (p) => setAdopted((a) => (a.some((x) => x.id === p.id) ? a : [...a, { ...p, team: "" }]));
  const createTeam = () => setTeams((t) => [...t, { id: `T-0${t.length + 1}`, name: "New research team", problem: adopted[0]?.title || "Unassigned", members: 1, lead: getFirstName(user) }]);

  const body = () => {
    switch (tab) {
      case "discover": return <Panel eyebrow="Discover" title="Verified problems open to universities">
        <div className="jn-choice-grid jn-filter">{DOMAINS.map((d) => <button type="button" key={d} className={domain === d ? "selected" : ""} onClick={() => setDomain(d)}>{d}</button>)}</div>
        <div className="jn-role-list">{discover.map((p) => <div className="jn-role-list-item" key={p.id}>
          <Search size={16} className="jn-role-list-icon" /><div><b>{p.title}</b><span><MapPin size={12} /> {p.location} · {p.people} affected</span></div>
          <div className="jn-card-tags">{p.domains.map((d) => <span key={d}>{d}</span>)}</div>
          {adopted.some((a) => a.id === p.id) ? <Tag tone="good">Adopted</Tag>
            : <PrivilegeButton user={user} label="Adopt" onClick={() => adopt(p)} />}
        </div>)}</div></Panel>;
      case "adopt": return <Panel eyebrow="Adopted problems" title="Problems your institution is working on">
        {adopted.length ? <div className="jn-role-list">{adopted.map((p) => <div className="jn-role-list-item" key={p.id}>
          <BookOpen size={16} className="jn-role-list-icon" /><div><b>{p.title}</b><span>{p.location}</span></div><Tag tone="good">Active</Tag></div>)}</div>
          : <EmptyState icon={BookOpen} title="No adopted problems yet" text="Discover a verified problem and adopt it to begin a project." />}</Panel>;
      case "teams": return <Panel eyebrow="My teams" title="Student & faculty teams" action={<PrivilegeButton user={user} perm="team:create" label="Create team" onClick={createTeam} />}>
        <div className="jn-role-list">{teams.map((t) => <div className="jn-role-list-item" key={t.id}>
          <Users size={16} className="jn-role-list-icon" /><div><b>{t.name}</b><span>{t.members} members · lead {t.lead} · {t.problem}</span></div>
          <PrivilegeButton user={user} perm="team:join" secondary label="Join" onClick={() => { }} /></div>)}</div></Panel>;
      case "solutions": return <Panel eyebrow="Solutions" title="Ideas submitted for evaluation" action={<PrivilegeButton user={user} perm="solution:submit" label="Submit solution" onClick={() => navigate("/suggest")} />}>
        <div className="jn-role-list">{INITIAL_SOLUTIONS.map((s) => <div className="jn-role-list-item" key={s.id}>
          <Lightbulb size={16} className="jn-role-list-icon" /><div><b>{s.title}</b><span>{s.problem} · {s.status}</span></div><Tag tone="info">Score {s.score}</Tag></div>)}</div></Panel>;
      case "projects": return <Panel eyebrow="Projects & prototypes" title="Active builds and field prototypes" action={<PrivilegeButton user={user} perm="prototype:upload" label="Upload prototype" onClick={() => { }} />}>
        <div className="jn-role-list"><div className="jn-role-list-item"><FlaskConical size={16} className="jn-role-list-icon" />
          <div><b>Solar-powered water purification unit</b><span>Prototype · field testing in Ranchi</span></div><Tag tone="warn">Testing</Tag></div>
          <div className="jn-role-list-item"><FlaskConical size={16} className="jn-role-list-icon" />
          <div><b>IoT flood-level monitoring kit</b><span>Prototype · deployed at 3 sites</span></div><Tag tone="good">Deployed</Tag></div></div></Panel>;
      case "industry": return <Panel eyebrow="Industry collaboration" title="Partners offering mentorship & resources" action={<PrivilegeButton user={user} perm="mentorship:request" label="Request mentorship" onClick={() => { }} />}>
        <div className="jn-role-list">{industries.map((i) => <div className="jn-role-list-item" key={i.name}>
          <Handshake size={16} className="jn-role-list-icon" /><div><b>{i.name}</b><span>{i.type} · {i.expertise}</span></div>
          <div className="jn-support">{i.support.map((s) => <span key={s}>{s}</span>)}</div></div>)}</div></Panel>;
      case "research": return <Panel eyebrow="Research" title="Focus areas & publications">
        <div className="jn-role-list">{universities.map((u) => <div className="jn-role-list-item" key={u.name}>
          <GraduationCap size={16} className="jn-role-list-icon" /><div><b>{u.name}</b><span>{u.projects} projects · {u.location}</span></div>
          <div className="jn-card-tags">{u.expertise.map((e) => <span key={e}>{e}</span>)}</div></div>)}</div></Panel>;
      case "impact": return <><Kpis items={[{ label: "Problems Adopted", value: String(adopted.length) }, { label: "Active Teams", value: String(teams.length) }, { label: "Solutions Submitted", value: "04" }, { label: "People Reached", value: "12,400+" }]} />
        <Panel eyebrow="Impact" title="Contribution to the national network"><div className="jn-gov-trends">
          {[["Solutions evaluated", 68], ["Prototypes field-tested", 44], ["Students engaged", 91], ["Districts served", 37]].map(([l, v]) =>
            <div className="jn-bar" key={l}><span>{l}</span><i><b style={{ width: `${v}%` }} /></i><strong>{v}</strong></div>)}</div></Panel></>;
      case "notifications": return <Panel eyebrow="Notifications" title="Recent updates">
        <div className="jn-role-list">{[["New verified problem matches your domain", "Water Resources · Ranchi"], ["Industry partner accepted your mentorship request", "AquaSense Labs"], ["Your solution moved to evaluation", "S-01"]].map(([t, s]) =>
          <div className="jn-role-list-item" key={t}><Bell size={16} className="jn-role-list-icon" /><div><b>{t}</b><span>{s}</span></div><Tag tone="info">New</Tag></div>)}</div></Panel>;
      default: return <>
        <Kpis items={[{ label: "Discoverable Problems", value: String(problems.length) }, { label: "Adopted", value: String(adopted.length) }, { label: "Teams", value: String(teams.length) }, { label: "Solutions", value: "04" }]} />
        <Panel eyebrow="Get started" title="University workspace">
          <div className="jn-gov-shortcuts">{[["discover", "Discover problems"], ["teams", "Manage teams"], ["solutions", "Submit solutions"], ["projects", "Prototypes"], ["industry", "Industry collaboration"], ["impact", "View impact"]].map(([t, label]) =>
            <button type="button" key={t} className="jn-gov-shortcut" onClick={() => navigate(`/university/dashboard?tab=${t}`)}><TrendingUp size={14} /> {label}</button>)}</div></Panel>
        <Panel eyebrow="Discover" title="Highlighted problems"><div className="jn-role-list">{problems.slice(0, 3).map((p) =>
          <div className="jn-role-list-item" key={p.id}><Search size={16} className="jn-role-list-icon" /><div><b>{p.title}</b><span>{p.location}</span></div>
            <div className="jn-card-tags">{p.domains.map((d) => <span key={d}>{d}</span>)}</div></div>)}</div></Panel></>;
    }
  };

  return <div className="jn-role-page">
    <VerificationNotice user={user} onApprove={onApproveVerification} />
    <RoleHero eyebrow={`University · ${org}`} title="Research & innovation hub"
      subtitle={`Signed in as ${sub.label}. Adopt real problems, build teams, submit solutions and collaborate with industry.`}>
      <Tag tone="info">Sub-role: {sub.label}</Tag>
    </RoleHero>
    {body()}
  </div>;
}
