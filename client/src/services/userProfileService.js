const STORAGE_KEY = "jansetu.citizen.profile.v1";

// Field metadata shared by the registration gate, the profile page and the
// completion meter. `benefit` explains what each detail unlocks for the citizen.
export const PROFILE_FIELDS = [
  { key: "name", label: "Full name", required: true, benefit: "Verification teams can confirm your reports faster." },
  { key: "country", label: "Country", required: true, benefit: "Connects you to the right national innovation network." },
  { key: "state", label: "State / UT", required: true, indiaOnly: true, benefit: "Matches problems with nearby universities and district offices." },
  { key: "city", label: "City / District", required: true, benefit: "Routes local challenges to the institutions closest to you." },
  { key: "phone", label: "Phone number", required: true, benefit: "Get status updates when your reported problems move forward." },
  { key: "email", label: "Email address", required: true, benefit: "Receive match reports and solution milestones." },
  { key: "gender", label: "Gender", required: true, benefit: "Helps us understand who is affected and design inclusive solutions." },
  { key: "caste", label: "Caste category", required: false, benefit: "Check eligibility for category-specific schemes and scholarships." },
  { key: "age", label: "Age", required: false, benefit: "Unlock age-appropriate programs, grants and competitions." },
  { key: "occupation", label: "Occupation", required: false, benefit: "Personalised domain suggestions, like agriculture tools for farmers." },
];

export const emptyProfile = () => ({ name: "", country: "", state: "", city: "", phone: "", email: "", gender: "", caste: "", age: "", occupation: "", joinedAt: "" });

// Role / verification defaults. A legacy profile with no roles is treated as a
// verified citizen so existing sessions keep working.
export const DEFAULT_ROLES = () => [{ role: "citizen", verificationStatus: "verified", org: "" }];

const normalize = (profile) => {
  const roles = Array.isArray(profile.roles) && profile.roles.length ? profile.roles : DEFAULT_ROLES();
  const activeRole = profile.activeRole && roles.some((r) => r.role === profile.activeRole) ? profile.activeRole : roles[0].role;
  return { ...profile, roles, activeRole, subRole: profile.subRole || "", demo: Boolean(profile.demo) };
};

export const getProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const profile = raw ? JSON.parse(raw) : null;
    return profile && profile.name ? normalize({ ...emptyProfile(), ...profile }) : null;
  } catch {
    return null;
  }
};

export const saveProfile = (profile) => {
  const stored = normalize({ ...emptyProfile(), ...profile, joinedAt: profile.joinedAt || new Date().toISOString() });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable — the session still works from component state.
  }
  return stored;
};

export const clearProfile = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
};

export const applicableFields = (profile) => PROFILE_FIELDS.filter((field) => !field.indiaOnly || profile.country === "India");

export const profileCompletion = (profile) => {
  const fields = applicableFields(profile);
  const missing = fields.filter((field) => !String(profile[field.key] || "").trim());
  return { percent: Math.round(((fields.length - missing.length) / fields.length) * 100), missing };
};

export const getFirstName = (profile) => (profile?.name || "").trim().split(/\s+/)[0] || "Citizen";

export const getInitials = (profile) => {
  const parts = (profile?.name || "").trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("") : "JS";
};

// ---- Role / verification helpers -------------------------------------------
export const getActiveRole = (profile) => profile?.activeRole || "citizen";
export const setActiveRole = (profile, role) => saveProfile({ ...profile, activeRole: role });
export const isDemo = (profile) => Boolean(profile?.demo);
export const verifiedRoles = (profile) => (profile?.roles || []).filter((r) => r.verificationStatus === "verified").map((r) => r.role);

export const addRole = (profile, role, { org = "", verificationStatus = "pending" } = {}) => {
  const roles = profile?.roles || [];
  if (roles.some((r) => r.role === role)) return saveProfile(profile);
  return saveProfile({ ...profile, roles: [...roles, { role, verificationStatus, org }] });
};

export const setVerificationStatus = (profile, role, status) =>
  saveProfile({ ...profile, roles: (profile?.roles || []).map((r) => (r.role === role ? { ...r, verificationStatus: status } : r)) });

// ---- Audit log (government administrative actions) -------------------------
const AUDIT_KEY = "jansetu.audit.v1";
export const getAudit = () => {
  try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]"); } catch { return []; }
};
export const appendAudit = (entry) => {
  const list = getAudit();
  list.unshift({ ...entry, at: new Date().toISOString() });
  try { localStorage.setItem(AUDIT_KEY, JSON.stringify(list.slice(0, 200))); } catch { /* ignore */ }
  return list;
};

// ---- Demo Mode presets (clearly labelled, never mixed with real profiles) --
const DEMO_META = {
  citizen: { name: "Demo Citizen", org: "" },
  government: { name: "Demo Officer", org: "Ranchi Municipal Corporation" },
  university: { name: "Demo Faculty", org: "National Institute of Technology" },
  industry: { name: "Demo Partner", org: "Setu Technologies Pvt Ltd" },
};

export const loadDemoProfile = (role) =>
  saveProfile({
    ...emptyProfile(),
    name: DEMO_META[role]?.name || "Demo User",
    email: "demo@jansetu.in", phone: "9000000000", country: "India", state: "Jharkhand", city: "Ranchi",
    roles: [{ role, verificationStatus: "verified", org: DEMO_META[role]?.org || "" }],
    activeRole: role,
    subRole: role === "university" ? "faculty" : "",
    demo: true,
  });
