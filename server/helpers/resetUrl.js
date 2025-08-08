export function buildResetUrl(role, token) {
  const base = process.env.FRONTEND_URL || "http://localhost:3000";

  const RoleResetPath = {
    citizen: "/reset-password",
    hcp: "/healthcare-provider/reset-password",
    hospital: "/hospital/reset-password",
    moh: "/moh/reset-password",
    admin: "/admin/reset-password",
  };

  const url = new URL(RoleResetPath[role], base);
  url.searchParams.set("role", role);
  url.searchParams.set("token", token);
  return url.toString();
}
