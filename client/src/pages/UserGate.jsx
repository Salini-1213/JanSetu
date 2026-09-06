import { BadgeCheck, MapPin, Network, Phone, ShieldCheck } from "lucide-react";
import ProfileForm from "./ProfileForm";
import { emptyProfile } from "../services/userProfileService";

export default function UserGate({ onRegister }) {
  return (
    <div className="jn-gate-page">
      <div className="jn-gate">
        <section className="jn-gate-brand">
          <button className="jn-logo" type="button"><span className="jn-logo-mark"><Network size={17} /></span>JAN<span>SETU</span></button>
          <h1>Turn local problems into <em>national solutions.</em></h1>
          <p>Create your citizen profile once. JanSetu will connect the challenges you report with the universities, government offices and industry partners closest to you.</p>
          <ul className="jn-gate-list">
            <li><ShieldCheck size={16} />Your details stay private on this device</li>
            <li><MapPin size={16} />Problems matched to institutions near you</li>
            <li><Phone size={16} />Updates on every challenge you report</li>
            <li><BadgeCheck size={16} />Scheme eligibility checks as your profile grows</li>
          </ul>
          <span className="jn-gate-tag">Jan · Setu — the people's bridge</span>
        </section>
        <section className="jn-gate-card">
          <span className="jn-eyebrow">New citizen registration</span>
          <h2>Create your profile</h2>
          <p className="jn-subtitle">Fields marked <b>*</b> are required. Optional details can be added anytime from your profile page.</p>
          <ProfileForm initial={emptyProfile()} submitLabel="Enter JanSetu" onSubmit={onRegister} />
        </section>
      </div>
    </div>
  );
}
