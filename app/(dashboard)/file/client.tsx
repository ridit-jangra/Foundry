"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IRequstedFile } from "@/lib/types";
import { get_file_content_by_path } from "@/services/repoService";
import { MenuIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { get_language_from_path } from "@/lib/utils";

function FileViewer({ content, path }: { content: string; path: string }) {
  const language = get_language_from_path(path);

  return (
    <div className="h-full w-full">
      <Editor
        className="h-full w-full"
        height="100vh"
        language={language}
        value={content}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          readOnly: true,
          theme: "vs-dark",
        }}
      />
    </div>
  );
}

export default function Client() {
  const [file, setFile] = useState<IRequstedFile>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const owner = searchParams.get("owner");
  const repo_name = searchParams.get("name");
  const file_path = searchParams.get("path");

  useEffect(() => {
    async function run() {
      if (!repo_name || !owner || !file_path) return;
      const file = await get_file_content_by_path(owner, repo_name, file_path);

      console.log(file);

      setFile(file);
    }
    run();
  }, [owner, repo_name, file_path]);

  if (!owner || !repo_name || !file_path)
    return (
      <div className="font-mono flex flex-col items-center justify-center min-h-screen text-2xl sm:text-3xl gap-4 px-4">
        <p className="text-center">No repo specified</p>
        <span className="flex flex-col sm:flex-row items-center gap-3 text-center">
          <span>Use:</span>
          <kbd className="bg-muted text-base sm:text-2xl p-2 rounded-full px-4 font-mono break-all">
            /repo?owner=example&repo=name&path=main.py
          </kbd>
        </span>
      </div>
    );

  return (
    <>
      {file ? (
        <div className="min-h-screen flex flex-col pt-2">
          <div className="flex items-center justify-between mb-4 px-3">
            <div className="flex items-center gap-3">
              <Button variant={"outline"} size={"icon-lg"}>
                <MenuIcon style={{ width: "22px", height: "22px" }} />
              </Button>
              <p className="font-mono font-medium text-lg sm:text-xl truncate">
                {file.owner_id}/{file.repo_name}/{file.file_path}
              </p>
            </div>
          </div>
          <div className="flex flex-col px-4 pt-12 sm:px-8 md:px-16 lg:px-32 xl:px-60 bg-muted/30 flex-1 gap-8 w-full">
            <div className="flex items-center h-12 w-full justify-between">
              <p className="font-mono text-3xl">{file.repo_name}</p>
            </div>
            <div className="flex flex-col border rounded-2xl overflow-hidden flex-1 min-h-0">
              <div className="flex items-center justify-between bg-muted/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-medium cursor-pointer hover:underline">
                    {file.file_path}
                  </span>
                </div>
                <span className="flex gap-2 items-center text-xl">
                  Status
                  <Badge
                    variant={`${(file as any).file.status === "new" || (file as any).file.status === "modified" ? "default" : "destructive"}`}
                  >
                    {(file as any).file.status}
                  </Badge>
                </span>
              </div>
              <div className="flex-1 min-h-0 flex gap-4 px-4">
                <FileViewer content={file.content} path={file.file_path} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="font-mono flex flex-col items-center justify-center min-h-screen text-2xl sm:text-3xl gap-4 px-4">
          <p className="text-center">File not found or loading... </p>
        </div>
      )}
    </>
  );
}
