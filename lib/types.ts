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
  path: string;
  content: string;
  status: "new" | "modified" | "remove";
}

export interface ICommit {
  id: string;
  message: string;
  files: IFile[];
}
