import { useState } from "react";
import { Check, Repeat } from "lucide-react";
import { ROLES, VERIFICATION } from "../rbac/roles";

export default function RoleSwitcher({ user, onSwitch }) {
  const [open, setOpen] = useState(false);
  const options = (user?.roles || []).filter((r) => r.verificationStatus === VERIFICATION.VERIFIED);
  if (options.length <= 1) return null;
  const current = ROLES[user.activeRole];
  return <div className="jn-role-switch">
    <button type="button" className="jn-role-switch-btn" onClick={() => setOpen(!open)}><Repeat size={14} /> Current Role: {current?.label}</button>
    {open && <div className="jn-role-switch-menu">
      <span>Continue as:</span>
      {options.map((o) => <button type="button" key={o.role} className={o.role === user.activeRole ? "active" : ""} onClick={() => { setOpen(false); onSwitch(o.role); }}>
        <span>{ROLES[o.role].emoji} {ROLES[o.role].label}</span>{o.role === user.activeRole && <Check size={13} />}
      </button>)}
    </div>}
  </div>;
}
