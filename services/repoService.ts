import { log } from "@/lib/log";
import { IRepo } from "@/lib/types";
import { SERVER_URL } from "@/lib/vars";
import { get_token } from "@/services/authService";

function authHeaders() {
  const token = get_token();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function get_all_repo_by_owner(owner: string): Promise<IRepo[]> {
  log(
    `Initiating repo request (${SERVER_URL}/api/repos/list_owner/${owner})`,
    "Vault",
  );

  const res = await fetch(`${SERVER_URL}/api/repos/list_owner/${owner}`, {
    method: "GET",
  });

  const data = await res.json();

  log(`Received repos ${JSON.stringify(data.repos)}`, "Vault");

  if (!res.ok) throw new Error(data?.detail || "Failed to fetch repos");

  return (data.repos ?? []) as IRepo[];
}
