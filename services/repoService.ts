import { log } from "@/lib/log";
import { ICommit, IFile, IRepo, IRequstedFile } from "@/lib/types";
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

export async function get_repo_data_by_owner_repo_name(
  owner: string,
  repo_name: string,
): Promise<{
  repo: IRepo;
  commits: ICommit[];
  files: IFile[];
  current_commit: string;
}> {
  log(
    `Initiating repo data request (${SERVER_URL}/api/repos/data/${owner}/${repo_name})`,
    "Vault",
  );

  const res = await fetch(
    `${SERVER_URL}/api/repos/data/${owner}/${repo_name}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();

  log(`Received repo data ${JSON.stringify(data.repos)}`, "Vault");

  if (!res.ok) throw new Error(data?.detail || "Failed to fetch repos");

  const repo: IRepo = {
    name: data.repo_name,
    full_name: `${data.owner_id}/${data.repo_name}`,
    is_fork: data.is_fork,
    owner_email: data.owner_email,
    owner_id: data.owner_id,
    forked_from: data.forked_from,
  };

  return {
    repo: repo,
    commits: data.commits ?? ([] as ICommit[]),
    files: data.files ?? ([] as IFile[]),
    current_commit: data.current_commit_id,
  };
}

export async function get_file_content_by_path(
  owner: string,
  repo_name: string,
  path: string,
): Promise<IRequstedFile> {
  log(
    `Initiating file request (${SERVER_URL}/api/repos/file/${owner}/${repo_name}?path=${path})`,
    "Vault",
  );

  const res = await fetch(
    `${SERVER_URL}/api/repos/file/${owner}/${repo_name}?path=${path}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();

  log(`Received file ${JSON.stringify(data)}`, "Vault");

  if (!res.ok) throw new Error(data?.detail || "Failed to fetch repos");

  return data as IRequstedFile;
}
