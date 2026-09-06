import { ChevronRight } from "lucide-react";
import { ROLES, activeEntry } from "../rbac/roles";
import VerificationBadge from "./VerificationBadge";
import RoleSwitcher from "./RoleSwitcher";

// Role-aware left navigation. Replaces the citizen DisasterSidebar whenever the
// user is inside one of the four role dashboards.
export default function RoleShell({ user, path, navigate, onSwitchRole }) {
  const role = ROLES[user.activeRole] || ROLES.citizen;
  const entry = activeEntry(user);
  return <aside className="jn-sidebar jn-role-nav">
    <div className="jn-role-nav-head"><span className="jn-role-emoji">{role.emoji}</span><div><b>{role.label}</b><small>{role.tagline}</small></div></div>
    <VerificationBadge status={entry?.verificationStatus || "verified"} />
    {entry?.org && <span className="jn-role-org">{entry.org}</span>}
    <nav>{role.nav.map(({ label, path: itemPath, icon: Icon }) => {
      const active = itemPath.includes("?") ? path === itemPath : path === itemPath || path.startsWith(itemPath + "/");
      return <button key={label} className={active ? "active" : ""} onClick={() => navigate(itemPath)}><Icon size={17} /><span>{label}</span>{active && <ChevronRight size={14} className="jn-sidebar-arrow" />}</button>;
    })}</nav>
    <RoleSwitcher user={user} onSwitch={onSwitchRole} />
    {user.demo && <span className="jn-demo-flag">DEMO ACCOUNT</span>}
  </aside>;
}
