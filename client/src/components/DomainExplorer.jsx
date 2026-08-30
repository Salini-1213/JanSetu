import { useState } from "react";
import { ArrowRight, Check, ScanLine, Sprout } from "lucide-react";

const domainOptions = [
  "Healthcare", "Agriculture", "Education & Study", "Roads & Transport",
  "Electricity & Energy", "Water Resources", "Sanitation & Waste",
  "Environment & Climate", "Housing", "Employment & Livelihood",
  "Public Safety", "Digital Infrastructure", "Women & Child Welfare",
  "Accessibility", "Government Services", "Disaster Management",
  "Tourism & Culture", "Other",
];

export default function DomainExplorer({ navigate }) {
  const [selected, setSelected] = useState("");
  const [cropResult, setCropResult] = useState(false);

  const selectDomain = (domain) => {
    setSelected(domain);
    setCropResult(false);
  };

  return (
    <section className="jn-section jn-domain-section">
      <div className="jn-section-heading">
        <span className="jn-eyebrow">Start where it matters</span>
        <h2>What kind of problem<br /><em>are you facing?</em></h2>
        <p>Choose a domain to help JanSetu connect your challenge with the right people, institutions and resources.</p>
      </div>
      <div className="jn-domain-grid">
        {domainOptions.map((domain, index) => (
          <button type="button" className={`jn-domain-option domain-${index % 5} ${selected === domain ? "selected" : ""}`} key={domain} onClick={() => selectDomain(domain)}>
            {selected === domain && <Check size={14} />}
            {domain}
          </button>
        ))}
      </div>
      <div className="jn-domain-action">
        {selected ? <><span>Selected domain: <b>{selected}</b></span><div className="jn-domain-actions">{selected === "Agriculture" && <button type="button" className="jn-crop-button" onClick={() => setCropResult(true)}><ScanLine size={16} /> AI Crop Detector</button>}<button type="button" className="jn-btn" onClick={() => navigate(`/report?domain=${encodeURIComponent(selected)}`)}>Report this problem <ArrowRight size={16} /></button></div></> : <span>Select the area that best describes your challenge.</span>}
      </div>
      {selected === "Agriculture" && cropResult && <div className="jn-crop-result"><Sprout size={21} /><div><b>AI crop scan complete</b><span>Demo result: crop appears healthy with possible early water stress.</span></div><strong>89% confidence</strong></div>}
    </section>
  );
}
