import { set_item, get_item, delete_item } from "./storageService";
import { IUser } from "../lib/types";
import { SERVER_URL } from "../lib/vars";
import { log } from "@/lib/log";

const AUTH_STORAGE_KEY = "FOUNDRY_AUTH_STORAGE";

type AuthState = {
  token: string;
  user: IUser;
};

function key(k: string) {
  return `${AUTH_STORAGE_KEY}_${k}`;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function get_auth(): AuthState | null {
  return get_item(key("AUTH")) ?? null;
}

export function get_current_user(): IUser | null {
  return get_auth()?.user ?? null;
}

export function get_token(): string | null {
  return get_auth()?.token ?? null;
}

export async function login(usernameOrEmail: string, password: string) {
  log(`Initiating login request.`, "Vault");

  const res = await fetch(`${SERVER_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameOrEmail, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Login failed");

  const token = data.token as string;

  log(`Received token (${token}).`, "Vault");

  log(`Initiating whoami request.`, "Vault");

  const meRes = await fetch(`${SERVER_URL}/api/auth/me`, {
    headers: authHeaders(token),
  });

  const meData = await meRes.json();
  if (!meRes.ok) throw new Error(meData?.detail || "Failed to fetch user");

  log(`Received me data (${meData.user}).`, "Vault");

  const user = meData.user as IUser;

  log(`Setting current user (${user.username}).`, "Vault");

  set_item(key("AUTH"), { token, user } satisfies AuthState);

  window.location.reload();
  return { token, user };
}

export async function register(
  username: string,
  email: string,
  password: string,
) {
  const res = await fetch(`${SERVER_URL}/api/auth/register/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Registration initiate failed");
  return data;
}

export async function registerVerify(email: string, otp: string) {
  const res = await fetch(`${SERVER_URL}/api/auth/register/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "OTP verification failed");

  const token = data.token as string;
  const user = data.user as IUser;

  set_item(key("AUTH"), { token, user } satisfies AuthState);
  window.location.replace("/dashboard");
  return { token, user };
}

export function logout() {
  delete_item(key("AUTH"));
  window.location.replace("/login");
}
