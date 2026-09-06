import { useState } from "react";
import { Bell, Briefcase, Coins, GraduationCap, Handshake, Lightbulb, MapPin, Package, Search, TrendingUp } from "lucide-react";
import { problems, universities } from "../../data/jansetuMockData";
import { getFirstName } from "../../services/userProfileService";
import { activeEntry } from "../../rbac/roles";
import VerificationNotice from "../../components/VerificationNotice";
import { EmptyState, Kpis, Panel, PrivilegeButton, RoleHero, Tag } from "./dashboardBits";

const INITIAL_SPONSORED = [{ id: "P-01", title: "IoT flood-level monitoring kit", partner: "IIT Guwahati", amount: "₹8,00,000", stage: "Prototyping" }];
const RESOURCES = ["Prototyping lab access", "Sensor hardware", "Cloud credits", "Field deployment support", "Mentor hours"];

export default function IndustryDashboard({ user, navigate, path, onApproveVerification }) {
  const [sponsored, setSponsored] = useState(INITIAL_SPONSORED);
  const [mentorships, setMentorships] = useState([]);
  const tab = (path.split("?tab=")[1] || "overview").split("&")[0];
  const org = (activeEntry(user) || {}).org || "Company";

  const offerMentorship = () => setMentorships((m) => [...m, { id: `M-0${m.length + 1}`, title: "Mentorship offer", by: `${getFirstName(user)} · ${org}`, status: "Open" }]);
  const sponsor = (p) => setSponsored((s) => (s.some((x) => x.id === p.id) ? s : [...s, { id: p.id, title: p.title, partner: "Your team", amount: "₹5,00,000", stage: "Sponsored" }]));

  const body = () => {
    switch (tab) {
      case "challenges": return <Panel eyebrow="Explore challenges" title="Verified problems seeking industry partners">
        <div className="jn-role-list">{problems.map((p) => <div className="jn-role-list-item" key={p.id}>
          <Search size={16} className="jn-role-list-icon" /><div><b>{p.title}</b><span><MapPin size={12} /> {p.location} · {p.people} affected</span></div>
          <div className="jn-card-tags">{p.domains.map((d) => <span key={d}>{d}</span>)}</div>
          {sponsored.some((s) => s.id === p.id) ? <Tag tone="good">Sponsored</Tag>
            : <PrivilegeButton user={user} perm="sponsor:project" label="Sponsor" onClick={() => sponsor(p)} />}
        </div>)}</div></Panel>;
      case "partnerships": return <Panel eyebrow="University partnerships" title="Institutions open to collaboration" action={<PrivilegeButton user={user} perm="partnership:view" secondary label="View all" onClick={() => { }} />}>
        <div className="jn-role-list">{universities.map((u) => <div className="jn-role-list-item" key={u.name}>
          <GraduationCap size={16} className="jn-role-list-icon" /><div><b>{u.name}</b><span>{u.location} · {u.projects} projects · {u.score}% match</span></div>
          <div className="jn-card-tags">{u.expertise.map((e) => <span key={e}>{e}</span>)}</div></div>)}</div></Panel>;
      case "solutions": return <Panel eyebrow="Solutions" title="University & community solutions ready to scale">
        <div className="jn-role-list"><div className="jn-role-list-item"><Lightbulb size={16} className="jn-role-list-icon" />
          <div><b>Low-cost soil moisture sensor network</b><span>BIT Mesra · evaluation score 82</span></div>
          <PrivilegeButton user={user} perm="sponsor:project" secondary label="Fund scale-up" onClick={() => { }} /></div>
          <div className="jn-role-list-item"><Lightbulb size={16} className="jn-role-list-icon" />
          <div><b>Solar-powered water purification unit</b><span>IIT Bhubaneswar · field tested</span></div>
          <PrivilegeButton user={user} perm="sponsor:project" secondary label="Fund scale-up" onClick={() => { }} /></div></div></Panel>;
      case "mentorship": return <Panel eyebrow="Mentorship" title="Offer guidance to student & faculty teams" action={<PrivilegeButton user={user} perm="mentorship:offer" label="Offer mentorship" onClick={offerMentorship} />}>
        {mentorships.length ? <div className="jn-role-list">{mentorships.map((m) => <div className="jn-role-list-item" key={m.id}>
          <Handshake size={16} className="jn-role-list-icon" /><div><b>{m.title}</b><span>{m.by}</span></div><Tag tone="good">{m.status}</Tag></div>)}</div>
          : <EmptyState icon={Handshake} title="No mentorship offers yet" text="Offer mentorship to guide teams working on problems you care about." />}</Panel>;
      case "projects": return <Panel eyebrow="Projects" title="Projects you are tracking">
        <div className="jn-role-list">{sponsored.map((p) => <div className="jn-role-list-item" key={p.id}>
          <Briefcase size={16} className="jn-role-list-icon" /><div><b>{p.title}</b><span>{p.partner} · {p.amount} · {p.stage}</span></div>
          <PrivilegeButton user={user} perm="project:track" secondary label="Track" onClick={() => { }} /></div>)}</div></Panel>;
      case "resources": return <Panel eyebrow="Resources" title="What your organisation can contribute" action={<PrivilegeButton user={user} perm="resource:offer" label="Offer resources" onClick={() => { }} />}>
        <div className="jn-support jn-resource-list">{RESOURCES.map((r) => <span key={r}>{r}</span>)}</div></Panel>;
      case "sponsorship": return <Panel eyebrow="Sponsorship" title="Fund projects that match your mission">
        <Kpis items={[{ label: "Active Sponsorships", value: String(sponsored.length) }, { label: "Committed", value: "₹13L" }, { label: "Projects Funded", value: "06" }, { label: "Impact Reach", value: "48,000+" }]} />
        <div className="jn-role-list">{problems.slice(0, 3).map((p) => <div className="jn-role-list-item" key={p.id}>
          <Coins size={16} className="jn-role-list-icon" /><div><b>{p.title}</b><span>{p.location}</span></div>
          {sponsored.some((s) => s.id === p.id) ? <Tag tone="good">Sponsored</Tag>
            : <PrivilegeButton user={user} perm="sponsor:project" label="Sponsor project" onClick={() => sponsor(p)} />}</div>)}</div></Panel>;
      case "impact": return <><Kpis items={[{ label: "Projects Supported", value: String(sponsored.length) }, { label: "Mentorships Offered", value: String(mentorships.length) }, { label: "Funds Deployed", value: "₹13L" }, { label: "Lives Impacted", value: "48,000+" }]} />
        <Panel eyebrow="Impact" title="Your contribution to the network"><div className="jn-gov-trends">
          {[["Projects sponsored", 72], ["Prototypes scaled", 40], ["Mentor hours", 63], ["Districts reached", 29]].map(([l, v]) =>
            <div className="jn-bar" key={l}><span>{l}</span><i><b style={{ width: `${v}%` }} /></i><strong>{v}</strong></div>)}</div></Panel></>;
      case "notifications": return <Panel eyebrow="Notifications" title="Recent updates">
        <div className="jn-role-list">{[["A university team requested your mentorship", "HydroSense Collective"], ["Sponsored project reached prototyping stage", "P-01"], ["New solution matches your focus area", "Water Resources"]].map(([t, s]) =>
          <div className="jn-role-list-item" key={t}><Bell size={16} className="jn-role-list-icon" /><div><b>{t}</b><span>{s}</span></div><Tag tone="info">New</Tag></div>)}</div></Panel>;
      default: return <>
        <Kpis items={[{ label: "Open Challenges", value: String(problems.length) }, { label: "Partnerships", value: String(universities.length) }, { label: "Sponsored Projects", value: String(sponsored.length) }, { label: "Mentorships", value: String(mentorships.length) }]} />
        <Panel eyebrow="Get started" title="Industry workspace">
          <div className="jn-gov-shortcuts">{[["challenges", "Explore challenges"], ["partnerships", "University partnerships"], ["mentorship", "Offer mentorship"], ["resources", "Offer resources"], ["sponsorship", "Sponsor a project"], ["projects", "Track projects"]].map(([t, label]) =>
            <button type="button" key={t} className="jn-gov-shortcut" onClick={() => navigate(`/industry/dashboard?tab=${t}`)}><Package size={14} /> {label}</button>)}</div></Panel>
        <Panel eyebrow="Challenges" title="High-priority problems seeking partners"><div className="jn-role-list">{problems.filter((p) => p.priority === "High").map((p) =>
          <div className="jn-role-list-item" key={p.id}><TrendingUp size={16} className="jn-role-list-icon" /><div><b>{p.title}</b><span>{p.location}</span></div><Tag tone="bad">{p.priority}</Tag></div>)}</div></Panel></>;
    }
  };

  return <div className="jn-role-page">
    <VerificationNotice user={user} onApprove={onApproveVerification} />
    <RoleHero eyebrow={`Industry · ${org}`} title="Partnership & impact hub"
      subtitle="Explore challenges, partner with universities, offer mentorship and resources, and sponsor solutions that scale." />
    {body()}
  </div>;
}
