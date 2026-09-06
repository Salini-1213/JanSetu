// Lightweight keyword classifier for the onboarding AI role assistant.
// It only RECOMMENDS a role; it never grants privileges. Institutional
// privileges always depend on the verification process.
const SIGNALS = [
  { role: "citizen", words: ["report", "broken", "road", "water", "garbage", "complain", "my area", "community", "street", "pothole", "near me", "village", "locality", "citizen"] },
  { role: "government", words: ["department", "officer", "municipal", "authority", "verify", "government", "ministry", "ward", "administration", "public body", "collector"] },
  { role: "university", words: ["professor", "student", "research", "faculty", "college", "campus", "university", "thesis", "lab", "academic", "lecturer", "scholar"] },
  { role: "industry", words: ["company", "startup", "fund", "sponsor", "mentor", "csr", "invest", "business", "corporate", "resource", "firm", "enterprise"] },
];

export function recommendRole(text) {
  const t = (text || "").toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const signal of SIGNALS) {
    const score = signal.words.filter((w) => t.includes(w)).length;
    if (score > bestScore) { bestScore = score; best = signal.role; }
  }
  return best;
}

export const ASSISTANT_EXAMPLES = [
  { text: "I want to report broken roads in my area.", role: "citizen" },
  { text: "I am a professor and want my students to work on real-world problems.", role: "university" },
  { text: "I work in the municipal corporation and verify complaints.", role: "government" },
  { text: "Our company can fund and mentor promising solutions.", role: "industry" },
];
