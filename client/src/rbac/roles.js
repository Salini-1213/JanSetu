import { AlertTriangle, BarChart3, Bell, BookOpen, Briefcase, Coins, FilePlus2, FlaskConical, GraduationCap, Handshake, Home, Inbox, LayoutDashboard, Lightbulb, Map, Megaphone, Network, Package, RefreshCw, Route, Search, Settings, ShieldCheck, Sparkles, TrendingUp, Trophy, UserRound, Users } from "lucide-react";

export const VERIFICATION = { PENDING: "pending", VERIFIED: "verified", REQUIRED: "required" };

export const ROLES = {
  citizen: {
    id: "citizen", label: "Citizen", emoji: "👤", tagline: "Report and participate.",
    signupDescription: "I want to report problems, track issues, suggest solutions and help my community.",
    verificationRequired: false,
    dashboardPath: "/citizen/dashboard",
    navbar: [
      { label: "Report Problem", path: "/report" },
      { label: "Explore", path: "/explore" },
      { label: "My Reports", path: "/track" },
      { label: "Help Solve", path: "/challenges" },
      { label: "Map", path: "/impact" },
    ],
    nav: [
      { label: "Home", path: "/citizen/dashboard", icon: Home },
      { label: "Report a Problem", path: "/report", icon: FilePlus2 },
      { label: "Explore Problems", path: "/explore", icon: Search },
      { label: "My Reports", path: "/track", icon: Route },
      { label: "Suggest a Solution", path: "/suggest", icon: Lightbulb },
      { label: "Help Solve", path: "/challenges", icon: Handshake },
      { label: "Impact & Map", path: "/impact", icon: Trophy },
      { label: "Profile", path: "/profile", icon: UserRound },
    ],
    permissions: ["report:create", "report:read:own", "solution:suggest", "map:view", "impact:view"],
  },
  government: {
    id: "government", label: "Government", emoji: "🏛️", tagline: "Verify, coordinate and resolve.",
    signupDescription: "I represent a government department or public authority and want to verify, manage and resolve societal problems.",
    verificationRequired: true,
    dashboardPath: "/government/dashboard",
    navbar: [
      { label: "Verification", path: "/government/dashboard?tab=verification" },
      { label: "Priority Problems", path: "/government/dashboard?tab=priority" },
      { label: "Departments", path: "/government/dashboard?tab=assign" },
      { label: "Resolution", path: "/government/dashboard?tab=resolution" },
      { label: "Analytics", path: "/government/dashboard?tab=analytics" },
    ],
    nav: [
      { label: "Dashboard", path: "/government/dashboard", icon: LayoutDashboard },
      { label: "New Reports", path: "/government/dashboard?tab=new-reports", icon: Inbox },
      { label: "AI Analysis", path: "/government/dashboard?tab=ai", icon: Sparkles },
      { label: "Government Verification", path: "/government/dashboard?tab=verification", icon: ShieldCheck },
      { label: "Priority Problems", path: "/government/dashboard?tab=priority", icon: AlertTriangle },
      { label: "Assign Department", path: "/government/dashboard?tab=assign", icon: Network },
      { label: "Resolution Tracking", path: "/government/dashboard?tab=resolution", icon: RefreshCw },
      { label: "Request Information", path: "/government/dashboard?tab=request", icon: Megaphone },
      { label: "Geographic Map", path: "/government/dashboard?tab=map", icon: Map },
      { label: "Analytics", path: "/government/dashboard?tab=analytics", icon: BarChart3 },
      { label: "Stakeholders", path: "/government/dashboard?tab=stakeholders", icon: Users },
      { label: "Audit Log", path: "/government/dashboard?tab=audit", icon: BookOpen },
      { label: "Settings", path: "/government/dashboard?tab=settings", icon: Settings },
    ],
    permissions: ["report:review", "report:verify", "report:reject", "report:request-info", "report:assign", "resolution:track", "analytics:view", "audit:read", "stakeholder:contact"],
  },
  university: {
    id: "university", label: "University", emoji: "🏫", tagline: "Research, innovate and build.",
    signupDescription: "I am a student, researcher, faculty member or university representative interested in solving real-world problems.",
    verificationRequired: true,
    dashboardPath: "/university/dashboard",
    navbar: [
      { label: "Discover Problems", path: "/university/dashboard?tab=discover" },
      { label: "Teams", path: "/university/dashboard?tab=teams" },
      { label: "Projects", path: "/university/dashboard?tab=projects" },
      { label: "Solutions", path: "/university/dashboard?tab=solutions" },
      { label: "Research", path: "/university/dashboard?tab=research" },
    ],
    nav: [
      { label: "Dashboard", path: "/university/dashboard", icon: LayoutDashboard },
      { label: "Discover Problems", path: "/university/dashboard?tab=discover", icon: Search },
      { label: "Adopt a Problem", path: "/university/dashboard?tab=adopt", icon: BookOpen },
      { label: "My Teams", path: "/university/dashboard?tab=teams", icon: Users },
      { label: "Solutions", path: "/university/dashboard?tab=solutions", icon: Lightbulb },
      { label: "Projects & Prototypes", path: "/university/dashboard?tab=projects", icon: FlaskConical },
      { label: "Industry Collaboration", path: "/university/dashboard?tab=industry", icon: Handshake },
      { label: "Research", path: "/university/dashboard?tab=research", icon: BookOpen },
      { label: "Impact", path: "/university/dashboard?tab=impact", icon: TrendingUp },
      { label: "Notifications", path: "/university/dashboard?tab=notifications", icon: Bell },
    ],
    permissions: ["problem:discover", "solution:submit", "impact:view"],
  },
  industry: {
    id: "industry", label: "Industry", emoji: "🏢", tagline: "Partner, mentor and implement.",
    signupDescription: "I represent a company or organization interested in technology, resources, funding, mentoring or implementing solutions.",
    verificationRequired: true,
    dashboardPath: "/industry/dashboard",
    navbar: [
      { label: "Challenges", path: "/industry/dashboard?tab=challenges" },
      { label: "Partnerships", path: "/industry/dashboard?tab=partnerships" },
      { label: "Mentorship", path: "/industry/dashboard?tab=mentorship" },
      { label: "Projects", path: "/industry/dashboard?tab=projects" },
      { label: "Resources", path: "/industry/dashboard?tab=resources" },
    ],
    nav: [
      { label: "Dashboard", path: "/industry/dashboard", icon: LayoutDashboard },
      { label: "Explore Challenges", path: "/industry/dashboard?tab=challenges", icon: Search },
      { label: "University Partnerships", path: "/industry/dashboard?tab=partnerships", icon: GraduationCap },
      { label: "Solutions", path: "/industry/dashboard?tab=solutions", icon: Lightbulb },
      { label: "Mentorship", path: "/industry/dashboard?tab=mentorship", icon: GraduationCap },
      { label: "Projects", path: "/industry/dashboard?tab=projects", icon: Briefcase },
      { label: "Resources", path: "/industry/dashboard?tab=resources", icon: Package },
      { label: "Sponsorship", path: "/industry/dashboard?tab=sponsorship", icon: Coins },
      { label: "Impact", path: "/industry/dashboard?tab=impact", icon: TrendingUp },
      { label: "Notifications", path: "/industry/dashboard?tab=notifications", icon: Bell },
    ],
    permissions: ["challenge:discover", "partnership:view", "mentorship:offer", "resource:offer", "sponsor:project", "project:track"],
  },
};

export const UNIVERSITY_SUBROLES = {
  student: { label: "Student", permissions: ["team:join", "solution:submit"] },
  faculty: { label: "Faculty", permissions: ["team:create", "prototype:upload", "mentorship:request"] },
  researcher: { label: "Researcher", permissions: ["team:create", "prototype:upload", "mentorship:request", "solution:submit"] },
  coordinator: { label: "University Coordinator / Admin", permissions: ["team:create", "prototype:upload", "mentorship:request", "solution:submit", "stakeholder:contact", "impact:view"] },
};

export const ROLE_IDS = Object.keys(ROLES);

export const roleOf = (user) => (user && user.activeRole && ROLES[user.activeRole] ? user.activeRole : "citizen");
export const roleEntry = (user, role) => ((user && user.roles) || []).find((r) => r.role === role);
export const activeEntry = (user) => roleEntry(user, roleOf(user));
export const verificationOf = (user) => (activeEntry(user) || {}).verificationStatus || VERIFICATION.VERIFIED;

// Privileged (institutional) actions are only enabled once verification passes,
// or when running a clearly-labelled demo account.
export const isPrivilegedAllowed = (user) => {
  if (user && user.demo) return true;
  const role = roleOf(user);
  if (!ROLES[role].verificationRequired) return true;
  return verificationOf(user) === VERIFICATION.VERIFIED;
};

export const permissionsFor = (user) => {
  const role = roleOf(user);
  const perms = [...ROLES[role].permissions];
  if (role === "university") {
    const sub = UNIVERSITY_SUBROLES[(user && user.subRole) || "student"];
    if (sub) perms.push(...sub.permissions);
  }
  return perms;
};

export const can = (user, permission) => permissionsFor(user).includes(permission);

// Returns the role a protected path belongs to, or null for public/community routes.
export const guardFor = (path) => {
  for (const id of ROLE_IDS) if (path === `/${id}` || path.startsWith(`/${id}/`)) return { role: id };
  return null;
};
