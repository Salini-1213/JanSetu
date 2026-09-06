import { useState } from "react";
import { BadgeCheck, ChevronLeft, MapPin, Network, Phone, ShieldCheck } from "lucide-react";
import ProfileForm from "./ProfileForm";
import RoleSelect from "./roles/RoleSelect";
import { emptyProfile, loadDemoProfile } from "../services/userProfileService";
import { ROLES, ROLE_IDS } from "../rbac/roles";

// Merge the chosen role into the profile. Citizens are verified immediately;
// institutional roles start as "pending" until verification passes.
const withRole = (profile, { role, org, subRole }) => ({
  ...profile,
  roles: [{ role, verificationStatus: role === "citizen" ? "verified" : "pending", org: org || "" }],
  activeRole: role,
  subRole: role === "university" ? subRole : "",
});

export default function UserGate({ onRegister }) {
  const [roleMeta, setRoleMeta] = useState(null);

  return (
    <div className="jn-gate-page">
      <div className="jn-gate">
        <section className="jn-gate-brand">
          <button className="jn-logo" type="button"><span className="jn-logo-mark"><Network size={17} /></span>JAN<span>SETU</span></button>
          <h1>Turn local problems into <em>national solutions.</em></h1>
          <p>Create your profile once and choose how you will use JanSetu — as a citizen, a government officer, a university or an industry partner. We connect every challenge with the people closest to solving it.</p>
          <ul className="jn-gate-list">
            <li><ShieldCheck size={16} />Institutional roles stay locked until verified</li>
            <li><MapPin size={16} />Problems matched to institutions near you</li>
            <li><Phone size={16} />Updates on every challenge you report</li>
            <li><BadgeCheck size={16} />Switch between verified roles anytime</li>
          </ul>
          <span className="jn-gate-tag">Jan · Setu — the people's bridge</span>
        </section>
        <section className="jn-gate-card">
          {roleMeta === null ? (
            <RoleSelect onSubmit={setRoleMeta} />
          ) : (
            <>
              <div className="jn-gate-rolebar">
                <span className="jn-eyebrow">Step 2 of 2 · Your details</span>
                <button type="button" className="jn-text-button" onClick={() => setRoleMeta(null)}><ChevronLeft size={14} /> Change role</button>
              </div>
              <h2>Create your {ROLES[roleMeta.role].label} profile</h2>
              <p className="jn-subtitle">Fields marked <b>*</b> are required. Optional details can be added anytime from your profile page.</p>
              <ProfileForm initial={emptyProfile()} submitLabel="Enter JanSetu" onSubmit={(profile) => onRegister(withRole(profile, roleMeta))} />
            </>
          )}
          <div className="jn-demo-mode">
            <div className="jn-demo-mode-head"><b>Demo Mode</b><span>Preview any dashboard instantly with a pre-verified DEMO ACCOUNT — no details, no waiting.</span></div>
            <div className="jn-demo-mode-grid">
              {ROLE_IDS.map((id) => <button type="button" key={id} className="jn-demo-mode-btn" onClick={() => onRegister(loadDemoProfile(id))}><span className="jn-demo-mode-emoji">{ROLES[id].emoji}</span>{ROLES[id].label}</button>)}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
