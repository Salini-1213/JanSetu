import { ShieldAlert, ShieldQuestion, Sparkles } from "lucide-react";
import { ROLES, VERIFICATION, activeEntry, roleOf, verificationOf } from "../rbac/roles";

// Banner shown at the top of an institutional dashboard when the account is not
// verified yet. Explains LIMITED mode and offers a simulated approval so the
// locked privileges can be previewed. Never asks for passwords/cards/IDs.
export default function VerificationNotice({ user, onApprove }) {
  const role = ROLES[roleOf(user)];
  if (!role.verificationRequired) return null;
  const status = verificationOf(user);
  if (status === VERIFICATION.VERIFIED) return null;

  const org = (activeEntry(user) || {}).org;
  const required = !org || status === VERIFICATION.REQUIRED;

  return <div className={`jn-verify-notice ${required ? "required" : "pending"}`}>
    <span className="jn-verify-notice-icon">{required ? <ShieldQuestion size={22} /> : <ShieldAlert size={22} />}</span>
    <div className="jn-verify-notice-copy">
      <b>{required ? "Verification Required" : "Verification Pending — Limited Mode"}</b>
      <p>
        {required
          ? <>Add and confirm your {role.label.toLowerCase()} organisation details to start verification. Privileged actions stay locked until then.</>
          : <>You can explore this dashboard, but privileged {role.label.toLowerCase()} actions are locked until your institution is verified. We never ask for passwords, payment details or identity documents.</>}
      </p>
    </div>
    {onApprove && <button type="button" className="jn-btn jn-verify-approve" onClick={onApprove}><Sparkles size={15} /> Simulate approval</button>}
  </div>;
}
