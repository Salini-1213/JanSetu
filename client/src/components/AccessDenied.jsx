import { ArrowLeft, Lock, Repeat } from "lucide-react";
import { ROLES, VERIFICATION, roleEntry, roleOf } from "../rbac/roles";

// Client-side enforcement panel. Shown when the active role tries to open a
// dashboard that belongs to a different role (e.g. a citizen typing
// /government/dashboard). Offers a switch when the target role is verified.
export default function AccessDenied({ user, wanted, navigate, onSwitchRole }) {
  const current = ROLES[roleOf(user)];
  const target = ROLES[wanted] || current;
  const hasTarget = (roleEntry(user, wanted) || {}).verificationStatus === VERIFICATION.VERIFIED;

  return <div className="jn-denied">
    <span className="jn-denied-icon"><Lock size={30} /></span>
    <span className="jn-eyebrow">Access denied</span>
    <h1>This area is for <em>{target.label}</em> accounts.</h1>
    <p>You are signed in as a <b>{current.label}</b>, which does not have permission to open <code>{target.dashboardPath}</code>. Access is checked in the browser before the page renders, so typing the address directly will not bypass it.</p>
    <div className="jn-denied-actions">
      {hasTarget && onSwitchRole && <button type="button" className="jn-btn" onClick={() => onSwitchRole(wanted)}><Repeat size={15} /> Continue as {target.label}</button>}
      <button type="button" className={`jn-btn${hasTarget ? " secondary" : ""}`} onClick={() => navigate(current.dashboardPath)}><ArrowLeft size={15} /> Back to my {current.label} dashboard</button>
    </div>
  </div>;
}
