import { get_current_user } from "@/services/authService";

export function require_auth() {
  const user = get_current_user();
  const path = window.location.pathname;

  if (!user && path !== "/login" && path !== "/register") {
    window.location.replace("/login");
  }
}

export function redirect_if_needed() {
  const user = get_current_user();
  const path = window.location.pathname;

  if (user && (path === "/login" || path === "/register" || path === "/")) {
    window.location.replace(`/profile?username=${user.username}`);
  }
}
