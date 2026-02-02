export interface IUser {
  name: string;
  username: string;
  email: string;
  password_hash: string;
}

export interface IRepo {
  name: string;
  owner_id: string;
  owner_email: string;
  is_fork: boolean;
  forked_from?: string;
  full_name: string;
}

export interface IFile {
  file_path: string;
  file_content: string;
  status: "new" | "modified" | "remove";
}

export interface ICommit {
  id: string;
  message: string;
  files: IFile[];
}

export interface IRequstedFile {
  repo_name: string;
  owner_id: string;
  file_path: string;
  content: string;
  status: string;
}
