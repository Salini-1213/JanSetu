import { Lock } from "lucide-react";
import { can, isPrivilegedAllowed } from "../../rbac/roles";

// Shared building blocks for the four role dashboards. Keeping them here avoids
// repeating the same hero / KPI / panel / locked-button markup four times.

export function RoleHero({ eyebrow, title, subtitle, children }) {
  return <header className="jn-role-head">
    <span className="jn-eyebrow">{eyebrow}</span>
    <h1>{title}</h1>
    {subtitle && <p className="jn-subtitle">{subtitle}</p>}
    {children}
  </header>;
}

export function Kpis({ items }) {
  return <div className="jn-kpis jn-role-kpis">{items.map(({ label, value, trend }) =>
    <div className="jn-kpi" key={label}><span>{label}</span><strong>{value}</strong>{trend && <small>{trend}</small>}</div>)}</div>;
}

export function Panel({ eyebrow, title, action, children, className = "" }) {
  return <section className={`jn-white-card jn-role-panel ${className}`.trim()}>
    {(eyebrow || title || action) && <div className="jn-role-panel-head">
      <div>{eyebrow && <span className="jn-eyebrow">{eyebrow}</span>}{title && <h3>{title}</h3>}</div>
      {action}
    </div>}
    {children}
  </section>;
}

// A privileged action. Locked (disabled + padlock + tooltip) when the account is
// not verified, or when the active role/sub-role lacks the required permission.
export function PrivilegeButton({ user, perm, children, onClick, secondary = false, label }) {
  const verified = isPrivilegedAllowed(user);
  const permitted = !perm || can(user, perm);
  const allowed = verified && permitted;
  const title = allowed ? undefined
    : !verified ? "Locked until your institution is verified"
    : `Your current role does not include the "${perm}" permission`;
  return <button type="button" className={`jn-btn jn-priv${secondary ? " secondary" : ""}${allowed ? "" : " locked"}`}
    disabled={!allowed} title={title} onClick={allowed ? onClick : undefined}>
    {!allowed && <Lock size={14} />}{label || children}
  </button>;
}

export function Tag({ children, tone = "" }) {
  return <span className={`jn-tag ${tone}`.trim()}>{children}</span>;
}

export function EmptyState({ icon: Icon, title, text }) {
  return <div className="jn-role-empty">{Icon && <Icon size={26} />}<b>{title}</b>{text && <p>{text}</p>}</div>;
}
