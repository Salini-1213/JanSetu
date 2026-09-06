import { ArrowRight, FilePlus2, Lightbulb, MapPin, Route, Search } from "lucide-react";
import { getFirstName } from "../../services/userProfileService";
import { problems } from "../../data/jansetuMockData";
import VerificationNotice from "../../components/VerificationNotice";
import { Kpis, Panel, RoleHero, Tag } from "./dashboardBits";

// The citizen-facing lifecycle, from first report to a resolved problem.
const LIFECYCLE = ["Submitted", "AI Analysis", "Government Verification", "Assigned", "In Progress", "Solution Proposed", "Resolved"];

const QUICK_ACTIONS = [
  { icon: FilePlus2, title: "Report a Problem", text: "Describe a challenge in your community and send it into the network.", path: "/report", cta: "Start a report" },
  { icon: Route, title: "Track My Reports", text: "Follow every problem you raised through each stage of the lifecycle.", path: "/track", cta: "Track status" },
  { icon: MapPin, title: "Problems Near Me", text: "See verified challenges around you and the institutions helping.", path: "/explore", cta: "Explore map" },
  { icon: Lightbulb, title: "Suggest a Solution", text: "Have an idea for a problem? Share it for universities and experts to evaluate.", path: "/suggest", cta: "Share an idea" },
];

// Mock "my reports" reused from the shared problem set, each at a different stage.
const MY_REPORTS = [
  { ...problems[0], stage: 4 },
  { ...problems[1], stage: 2 },
  { ...problems[3], stage: 6 },
];

function LifeCycle({ stage }) {
  return <div className="jn-life">{LIFECYCLE.map((name, index) =>
    <div key={name} className={index < stage ? "done" : index === stage ? "current" : ""}>
      <span>{index + 1}</span><b>{name}</b>
    </div>)}</div>;
}

export default function CitizenDashboard({ user, navigate, onApproveVerification }) {
  return <div className="jn-role-page">
    <VerificationNotice user={user} onApprove={onApproveVerification} />
    <RoleHero eyebrow="Citizen dashboard" title={`Welcome back, ${getFirstName(user)}`}
      subtitle="Report what matters in your community, track it end to end, and help solve problems near you." />

    <Kpis items={[
      { label: "Problems Reported", value: "03" },
      { label: "Under Review", value: "01" },
      { label: "Matched to Institutions", value: "01" },
      { label: "Solutions Deployed", value: "00" },
    ]} />

    <div className="jn-citizen-cards">
      {QUICK_ACTIONS.map(({ icon: Icon, title, text, path, cta }) =>
        <button type="button" key={title} className="jn-citizen-card" onClick={() => navigate(path)}>
          <span className="jn-citizen-card-icon"><Icon size={20} /></span>
          <b>{title}</b><p>{text}</p>
          <span className="jn-citizen-card-cta">{cta} <ArrowRight size={14} /></span>
        </button>)}
    </div>

    <Panel eyebrow="Your activity" title="My reports" action={<button type="button" className="jn-text-button" onClick={() => navigate("/report")}>Report another <ArrowRight size={14} /></button>}>
      <div className="jn-citizen-reports">
        {MY_REPORTS.map((report) =>
          <article className="jn-report-row" key={report.id}>
            <div className="jn-report-row-head">
              <div><small>{report.id} · {report.date}</small><h4>{report.title}</h4>
                <p className="jn-report-loc"><MapPin size={13} /> {report.location}</p></div>
              <div className="jn-report-row-tags"><Tag tone={report.stage === 6 ? "good" : "info"}>{LIFECYCLE[report.stage]}</Tag>
                <button type="button" className="jn-text-button" onClick={() => navigate("/track")}>Track <ArrowRight size={13} /></button></div>
            </div>
            <LifeCycle stage={report.stage} />
          </article>)}
      </div>
    </Panel>

    <Panel eyebrow="Near you" title="Problems open for community ideas" action={<button type="button" className="jn-text-button" onClick={() => navigate("/explore")}>Explore all <ArrowRight size={14} /></button>}>
      <div className="jn-role-list">
        {problems.slice(0, 3).map((p) =>
          <div className="jn-role-list-item" key={p.id}>
            <Search size={16} className="jn-role-list-icon" />
            <div><b>{p.title}</b><span>{p.location} · {p.people} affected</span></div>
            <div className="jn-card-tags">{p.domains.map((d) => <span key={d}>{d}</span>)}</div>
            <button type="button" className="jn-btn secondary jn-priv" onClick={() => navigate(`/suggest?problem=${p.id}`)}><Lightbulb size={14} /> Suggest</button>
          </div>)}
      </div>
    </Panel>
  </div>;
}
