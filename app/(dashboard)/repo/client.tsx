"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ICommit, IFile, IRepo } from "@/lib/types";
import { get_repo_data_by_owner_repo_name } from "@/services/repoService";
import { FileIcon, MenuIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Client() {
  const [repo, setRepo] = useState<IRepo>();
  const [commits, setCommits] = useState<ICommit[]>([]);
  const [currentCommit, setCurrentCommit] = useState<ICommit>();
  const [files, setFiles] = useState<IFile[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const owner = searchParams.get("owner");
  const repo_name = searchParams.get("name");

  useEffect(() => {
    async function run() {
      if (!repo_name || !owner) return;
      const { repo, commits, files, current_commit } =
        await get_repo_data_by_owner_repo_name(owner, repo_name);
      setRepo(repo);
      setCommits(commits);
      setFiles(files);

      console.log(files);

      setCurrentCommit(commits.find((v) => v.id === current_commit));
    }
    run();
  }, [owner, repo_name]);

  if (!owner || !repo_name)
    return (
      <div className="font-mono flex flex-col items-center justify-center min-h-screen text-2xl sm:text-3xl gap-4 px-4">
        <p className="text-center">No repo specified</p>
        <span className="flex flex-col sm:flex-row items-center gap-3 text-center">
          <span>Use:</span>
          <kbd className="bg-muted text-base sm:text-2xl p-2 rounded-full px-4 font-mono break-all">
            /repo?owner=example&repo=name
          </kbd>
        </span>
      </div>
    );

  return (
    <>
      {repo ? (
        <div className="min-h-screen flex flex-col pt-2">
          <div className="flex items-center justify-between mb-4 px-3">
            <div className="flex items-center gap-3">
              <Button variant={"outline"} size={"icon-lg"}>
                <MenuIcon style={{ width: "22px", height: "22px" }} />
              </Button>
              <p className="font-mono font-medium text-lg sm:text-xl truncate">
                {repo.owner_id}/{repo.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col px-4 pt-12 sm:px-8 md:px-16 lg:px-32 xl:px-60 bg-muted/30 flex-1 gap-8 w-full">
            <div className="flex items-center h-12 w-full justify-between">
              <p className="font-mono text-3xl">{repo.name}</p>
            </div>
            <div className="flex flex-col border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between bg-muted/60 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[18px] font-medium cursor-pointer hover:underline"
                    onClick={() =>
                      router.push(`/profile?username=${repo.owner_id}`)
                    }
                  >
                    {repo.owner_id}
                  </span>
                  <span>{currentCommit?.message}</span>
                </div>
                <span className="flex gap-2 items-center text-xl">
                  <Badge>{commits.length}</Badge>
                  Commits
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {files.map((v, i) => (
                  <div
                    key={i}
                    className="border-b flex items-center justify-between cursor-pointer hover:underline px-4 py-1 font-mono text-[17px]"
                    onClick={() =>
                      router.push(
                        `/file?owner=${repo.owner_id}&name=${repo.name}&path=${v.file_path}`,
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon />
                      {v.file_path}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="font-mono flex flex-col items-center justify-center min-h-screen text-2xl sm:text-3xl gap-4 px-4">
          <p className="text-center">Repo not found or loading... </p>
        </div>
      )}
    </>
  );
}
