import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import "./ExploreProblems.css";

const problems = [
  { id: "IND-2026-000231", emoji: "🛣️", category: "Roads & Transport", title: "Damaged Road", location: "Ranchi", priority: "High", people: "24", status: "In Progress", km: 2.4, date: "2026-09-05" },
  { id: "IND-2026-000244", emoji: "💧", category: "Water", title: "Contaminated handpump water", location: "Kanke", priority: "Critical", people: "1,240", status: "In Progress", km: 6.8, date: "2026-09-06" },
  { id: "IND-2026-000250", emoji: "🗑️", category: "Waste Management", title: "Garbage pile-up near market", location: "Ranchi", priority: "High", people: "340", status: "Reported", km: 3.1, date: "2026-09-07" },
  { id: "IND-2026-000219", emoji: "💡", category: "Electricity", title: "Frequent power cuts", location: "Namkum", priority: "Medium", people: "820", status: "In Progress", km: 9.4, date: "2026-08-29" },
  { id: "IND-2026-000205", emoji: "🏥", category: "Healthcare", title: "Clinic short of medicines", location: "Angara", priority: "Critical", people: "2,400", status: "In Progress", km: 14.2, date: "2026-09-01" },
  { id: "IND-2026-000198", emoji: "🎓", category: "Education", title: "School toilet unusable", location: "Bero", priority: "Medium", people: "450", status: "Solved", km: 21.6, date: "2026-07-18" },
  { id: "IND-2026-000187", emoji: "🌾", category: "Agriculture", title: "Crop loss from erratic rain", location: "Mandar", priority: "High", people: "3,100", status: "In Progress", km: 27.3, date: "2026-08-24" },
  { id: "IND-2026-000176", emoji: "🌳", category: "Environment", title: "Illegal tree felling", location: "Ranchi", priority: "Medium", people: "600", status: "Reported", km: 4.9, date: "2026-09-06" },
  { id: "IND-2026-000160", emoji: "📱", category: "Digital/Technology", title: "No mobile network coverage", location: "Lohardaga", priority: "Low", people: "1,900", status: "Solved", km: 38.5, date: "2026-06-30" },
  { id: "IND-2026-000154", emoji: "🏙️", category: "Public Infrastructure", title: "Broken footbridge over drain", location: "Ramgarh", priority: "High", people: "520", status: "Solved", km: 33.0, date: "2026-08-11" },
];

const filters = ["Nearby", "Most Urgent", "Recently Reported", "In Progress", "Solved"];
const priorityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const priorityColor = { Critical: "#ff5470", High: "#ff6b57", Medium: "#ffc46b", Low: "#7ee0a5" };

export default function ExploreProblems({ navigate }) {
  const [filter, setFilter] = useState("Nearby");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = problems.filter((p) => !q || `${p.title} ${p.location} ${p.category}`.toLowerCase().includes(q));
    if (filter === "Nearby") list = [...list].sort((a, b) => a.km - b.km);
    else if (filter === "Most Urgent") list = [...list].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
    else if (filter === "Recently Reported") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    else if (filter === "In Progress") list = list.filter((p) => p.status !== "Solved");
    else if (filter === "Solved") list = list.filter((p) => p.status === "Solved");
    return list;
  }, [filter, query]);

  return <>
    <section className="jn-inner-hero">
      <span className="jn-eyebrow"><ShieldCheck size={14} /> Check before you report</span>
      <h1>Explore Problems</h1>
      <p>See what your community has already reported. If your problem is already listed, add your support instead of submitting it again — duplicates slow verification and delay real solutions.</p>
    </section>
    <main className="jn-page-content">
      <div className="jn-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by problem, area or category..." /></div>
      <div className="jn-filter-row">{filters.map((f) => <button key={f} className={filter === f ? "selected" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div>
      <div className="jn-explore-count">{visible.length} problem{visible.length === 1 ? "" : "s"} found{filter === "Nearby" ? " · sorted by distance from you" : ""}</div>
      {visible.length === 0 ? (
        <div className="jn-explore-empty">No problems match this view yet.<button onClick={() => navigate("/report")}>Report a new problem <ArrowRight size={14} /></button></div>
      ) : (
        <div className="jn-explore-grid">{visible.map((p) => <ExploreCard key={p.id} problem={p} navigate={navigate} />)}</div>
      )}
      <div className="jn-explore-cta"><span>Can't find your problem in the list?</span><button className="jn-btn" onClick={() => navigate("/report")}>Report a new problem <ArrowRight size={16} /></button></div>
    </main>
  </>;
}

function ExploreCard({ problem, navigate }) {
  return <article className="jn-explore-card">
    <div className="jn-explore-title"><span>{problem.emoji}</span><h3>{problem.title}</h3></div>
    <div className="jn-explore-meta">
      <p><MapPin size={13} /> {problem.location} · {problem.km} km away</p>
      <p className="jn-explore-priority"><i style={{ background: priorityColor[problem.priority] }} /> {problem.priority} Priority</p>
      <p><Users size={13} /> {problem.people} people affected</p>
    </div>
    <button className="jn-text-button" onClick={() => navigate(`/challenges/${problem.id}`)}>View Details <ArrowRight size={14} /></button>
  </article>;
}
