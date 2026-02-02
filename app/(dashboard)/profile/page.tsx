"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IRepo } from "@/lib/types";
import { get_all_repo_by_owner } from "@/services/repoService";
import { BookOpenIcon, Computer, MenuIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function RepoCard({ repo: v, index: i }: { repo: IRepo; index: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-3 border p-4 rounded-2xl w-full" key={i}>
      <span className="flex items-center gap-2 text-[22px] hover:underline cursor-pointer">
        <Computer className="text-foreground/60" />
        {v.name}
      </span>
      <span className="flex gap-3 items-center">
        Clone path:
        <Tooltip>
          <TooltipTrigger>
            <code
              className="bg-muted/60 py-2 rounded-lg px-3 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(v.full_name);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              {v.full_name}
            </code>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied" : "Click to copy"}</TooltipContent>
        </Tooltip>
      </span>
    </div>
  );
}

export default function Page() {
  const [repos, setRepos] = useState<IRepo[]>([]);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const tabs = [
    {
      title: "Overview",
      value: "overview",
      tooltip: `Overview`,
      icon: BookOpenIcon,
    },
    {
      title: "Repos",
      value: "repos",
      tooltip: `Repos`,
      icon: Computer,
    },
  ];

  useEffect(() => {
    async function get_repos() {
      if (!username) return;

      const repos = await get_all_repo_by_owner(username);
      setRepos(repos);
    }

    get_repos();
  }, []);

  return (
    <>
      {username ? (
        <div className="min-h-screen flex flex-col pt-3">
          <div className="flex items-center justify-between mb-4 px-3">
            <div className="flex items-center gap-3">
              <Button variant={"outline"} size={"icon-lg"}>
                <MenuIcon
                  style={{
                    width: "22px",
                    height: "22px",
                  }}
                />
              </Button>
              <p className="font-mono font-medium text-xl">{username}</p>
            </div>
          </div>
          <Tabs defaultValue="overview" className="border-b-2 flex-1 h-full">
            <TabsList variant={"line"} className="px-3 pb-1.5">
              {tabs.map((v, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger>
                    <TabsTrigger value={v.value} className="text-lg gap-3">
                      <v.icon
                        style={{
                          width: "22px",
                          height: "22px",
                        }}
                      />
                      {v.title}
                      {v.value === "repos" && <Badge>{repos.length}</Badge>}
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{v.tooltip}</TooltipContent>
                </Tooltip>
              ))}
            </TabsList>
            <TabsContent
              value="overview"
              className="flex px-60 pt-16 bg-muted/30 flex-1 gap-24 w-full justify-between"
            >
              <div className="flex flex-col gap-4">
                <Image
                  src={"/default-profile.jpg"}
                  alt={username ?? ""}
                  width={600}
                  height={600}
                  className="rounded-full border-3"
                />
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-2xl">{username}</span>
                  <Button variant={"outline"} className="text-lg">
                    Edit profile
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <span className="font-mono text-2xl flex items-center gap-3">
                  Repos <Badge className="text-[16px]">{repos.length}</Badge>
                </span>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {repos.map((v, i) => (
                    <RepoCard repo={v} index={i} />
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="repos"
              className="flex px-60 pt-16 bg-muted/30 flex-1 gap-24 w-full justify-between"
            >
              <div className="flex flex-col gap-4 w-full">
                <span className="font-mono text-2xl flex items-center gap-3">
                  Repos <Badge className="text-[16px]">{repos.length}</Badge>
                </span>
                <div className="flex flex-col gap-5 w-full">
                  {repos.map((v, i) => (
                    <RepoCard repo={v} index={i} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="font-mono flex flex-col items-center justify-center min-h-screen text-3xl gap-4">
          No profile specified
          <span className="flex items-center gap-3">
            Use:
            <kbd className="bg-muted text-2xl p-2 rounded-full px-4 font-mono">
              /profile?=username=example
            </kbd>
          </span>
        </div>
      )}
    </>
  );
}
