import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import { VERIFICATION } from "../rbac/roles";

export default function VerificationBadge({ status }) {
  if (status === VERIFICATION.VERIFIED) return <span className="jn-vbadge verified"><BadgeCheck size={13} /> Verified</span>;
  if (status === VERIFICATION.PENDING) return <span className="jn-vbadge pending"><Clock size={13} /> Verification Pending</span>;
  return <span className="jn-vbadge required"><ShieldAlert size={13} /> Verification Required</span>;
}
