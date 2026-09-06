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

export const getProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const profile = raw ? JSON.parse(raw) : null;
    return profile && profile.name ? { ...emptyProfile(), ...profile } : null;
  } catch {
    return null;
  }
};

export const saveProfile = (profile) => {
  const stored = { ...emptyProfile(), ...profile, joinedAt: profile.joinedAt || new Date().toISOString() };
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
