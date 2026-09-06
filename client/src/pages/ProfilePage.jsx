import { useState } from "react";
import { BadgeCheck, Calendar, LogOut, MapPin, Pencil, Phone, ShieldCheck, Sparkles } from "lucide-react";
import ProfileForm from "./ProfileForm";
import { applicableFields, getInitials, profileCompletion, saveProfile } from "../services/userProfileService";

const joinedLabel = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "recently";
  }
};

export default function ProfilePage({ user, onSaved, onSignOut }) {
  const [editing, setEditing] = useState(false);
  if (!user) return null;

  if (editing) {
    return (
      <>
        <section className="jn-inner-hero"><span className="jn-eyebrow">Your account</span><h1>Edit profile</h1><p>Update your citizen details. Required fields keep your reports verifiable; optional fields unlock more benefits.</p></section>
        <main className="jn-page-content">
          <section className="jn-white-card jn-profile-edit">
            <ProfileForm initial={user} submitLabel="Save changes" onCancel={() => setEditing(false)} onSubmit={(profile) => { onSaved(saveProfile(profile)); setEditing(false); window.scrollTo(0, 0); }} />
          </section>
        </main>
      </>
    );
  }

  const { percent, missing } = profileCompletion(user);
  const location = [user.city, user.state, user.country].filter(Boolean).join(", ");
  return (
    <>
      <section className="jn-profile-hero">
        <div className="jn-avatar">{getInitials(user)}</div>
        <div className="jn-profile-id">
          <h2>{user.name}</h2>
          {location && <p><MapPin size={14} />{location}</p>}
          <p><Calendar size={14} />Member since {joinedLabel(user.joinedAt)}</p>
        </div>
        <div className="jn-profile-meter">
          <b>{percent}%</b>
          <span>profile complete</span>
          <div className="jn-profile-progress"><i style={{ width: `${percent}%` }} /></div>
          {percent < 100 ? <small>{missing.length} detail{missing.length === 1 ? "" : "s"} left to add</small> : <small className="done"><BadgeCheck size={13} />Trusted Citizen badge unlocked</small>}
        </div>
      </section>
      <main className="jn-page-content">
        <div className="jn-profile-grid">
          <section className="jn-white-card">
            <span className="jn-eyebrow">Your information</span>
            <h3>What JanSetu knows about you</h3>
            <div className="jn-profile-rows">
              {applicableFields(user).map(({ key, label, required }) => {
                const value = String(user[key] || "").trim();
                return <div className={value ? "jn-profile-row" : "jn-profile-row empty"} key={key}><span>{label}{required ? <b>*</b> : null}</span><strong>{value || "Not added yet"}</strong></div>;
              })}
            </div>
            <p className="jn-profile-note">Fields marked <b>*</b> were required when you joined. Everything else can be added or updated anytime using “Edit profile”.</p>
          </section>
          <div className="jn-profile-side">
            <section className="jn-white-card">
              <span className="jn-eyebrow">Complete your profile</span>
              <h3>{missing.length ? "You're almost there" : "Profile complete"}</h3>
              {missing.length > 0 ? (
                <ul className="jn-profile-missing">
                  {missing.map(({ key, label, benefit }) => <li key={key}><b>{label}</b><span>{benefit}</span></li>)}
                </ul>
              ) : (
                <div className="jn-profile-complete"><BadgeCheck size={22} />All details are in. Your reports now get priority verification and first-access matching with universities and industry partners.</div>
              )}
              <button className="jn-btn" onClick={() => setEditing(true)}><Pencil size={14} />{missing.length ? "Complete profile" : "Edit profile"}</button>
            </section>
            <section className="jn-white-card">
              <span className="jn-eyebrow">How to complete your profile</span>
              <h3>Three quick steps</h3>
              <ol className="jn-profile-steps">
                <li>Tap <b>{missing.length ? "Complete profile" : "Edit profile"}</b> above to open your details.</li>
                <li>Fill the optional fields — caste, age and occupation unlock scheme checks and personalised matches.</li>
                <li>Save. Your completion score updates instantly, and the benefits activate right away.</li>
              </ol>
            </section>
            <section className="jn-white-card">
              <span className="jn-eyebrow">Member benefits</span>
              <h3>Why your details matter</h3>
              <ul className="jn-profile-benefits">
                <li><Phone size={15} /><div><b>Faster updates</b><span>Phone and email get you status alerts on every problem you report.</span></div></li>
                <li><MapPin size={15} /><div><b>Local matching</b><span>City and state route your challenges to the nearest universities and district offices.</span></div></li>
                <li><ShieldCheck size={15} /><div><b>Scheme eligibility</b><span>Caste, age and occupation unlock category-specific government schemes and scholarships.</span></div></li>
                <li><Sparkles size={15} /><div><b>Trusted Citizen badge</b><span>A 100% profile earns priority verification and first access to new pilots.</span></div></li>
              </ul>
            </section>
            <section className="jn-white-card jn-profile-account">
              <span className="jn-eyebrow">Account</span>
              <h3>Session</h3>
              <p>You are signed in as <b>{user.email}</b>. Your profile is remembered on this device — no password needed.</p>
              <button className="jn-profile-signout" onClick={onSignOut}><LogOut size={14} />Sign out of JanSetu</button>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
