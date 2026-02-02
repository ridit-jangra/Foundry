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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function RepoCard({ repo }: { repo: IRepo }) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 border p-4 rounded-2xl w-full">
      <span
        className="flex items-center gap-2 text-lg sm:text-[22px] hover:underline cursor-pointer wrap-break-word"
        onClick={() =>
          router.push(`/repo?owner=${repo.owner_id}&name=${repo.name}`)
        }
      >
        <Computer className="text-foreground/60 shrink-0" />
        <span className="break-all">{repo.name}</span>
      </span>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
        <span className="shrink-0">Clone path:</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <code
              className="bg-muted/60 py-2 rounded-lg px-3 cursor-pointer hover:bg-muted/20 transition-colors text-xs sm:text-sm break-all"
              onClick={async () => {
                await navigator.clipboard.writeText(repo.full_name);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {repo.full_name}
            </code>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied" : "Click to copy"}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default function Client() {
  const [repos, setRepos] = useState<IRepo[]>([]);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const tabs = [
    {
      title: "Overview",
      value: "overview",
      tooltip: "Overview",
      icon: BookOpenIcon,
    },
    { title: "Repos", value: "repos", tooltip: "Repos", icon: Computer },
  ];

  useEffect(() => {
    async function run() {
      if (!username) return;
      const list = await get_all_repo_by_owner(username);
      setRepos(list);
    }
    run();
  }, [username]);

  if (!username) {
    return (
      <div className="font-mono flex flex-col items-center justify-center min-h-screen text-2xl sm:text-3xl gap-4 px-4">
        <p className="text-center">No profile specified</p>
        <span className="flex flex-col sm:flex-row items-center gap-3 text-center">
          <span>Use:</span>
          <kbd className="bg-muted text-base sm:text-2xl p-2 rounded-full px-4 font-mono break-all">
            /profile?username=example
          </kbd>
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-3">
      <div className="flex items-center justify-between mb-4 px-3">
        <div className="flex items-center gap-3">
          <Button variant={"outline"} size={"icon-lg"}>
            <MenuIcon style={{ width: "22px", height: "22px" }} />
          </Button>
          <p className="font-mono font-medium text-lg sm:text-xl truncate">
            {username}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="border-b-2 flex-1 h-full">
        <TabsList variant={"line"} className="px-3 w-full justify-baseline">
          {tabs.map((t) => (
            <Tooltip key={t.value}>
              <TooltipTrigger>
                <TabsTrigger
                  value={t.value}
                  className="text-base sm:text-lg gap-2 sm:gap-3"
                >
                  <t.icon
                    style={{ width: "20px", height: "20px" }}
                    className="sm:w-5.5 sm:h-5.5"
                  />
                  <span className="hidden sm:inline">{t.title}</span>
                  {t.value === "repos" && <Badge>{repos.length}</Badge>}
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>{t.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </TabsList>

        <TabsContent
          value="overview"
          className="flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 pt-8 sm:pt-12 lg:pt-16 bg-muted/30 flex-1 gap-8 sm:gap-12 lg:gap-24 w-full"
        >
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <Image
              src={"/default-profile.jpg"}
              alt={username}
              width={600}
              height={600}
              className="rounded-full border-3 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-full lg:h-auto max-w-75"
            />
            <div className="flex flex-col gap-3 w-full max-w-75">
              <span className="font-mono text-xl sm:text-2xl text-center lg:text-left">
                {username}
              </span>
              <Button variant={"outline"} className="text-base sm:text-lg">
                Edit profile
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <span className="font-mono text-xl sm:text-2xl flex items-center gap-3 justify-center lg:justify-start">
              Repos{" "}
              <Badge className="text-sm sm:text-[16px]">{repos.length}</Badge>
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              {repos.map((r) => (
                <RepoCard key={r.full_name} repo={r} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="repos"
          className="flex px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 pt-8 sm:pt-12 lg:pt-16 bg-muted/30 flex-1 gap-8 sm:gap-12 lg:gap-24 w-full"
        >
          <div className="flex flex-col gap-4 w-full">
            <span className="font-mono text-xl sm:text-2xl flex items-center gap-3 justify-center lg:justify-start">
              Repos{" "}
              <Badge className="text-sm sm:text-[16px]">{repos.length}</Badge>
            </span>
            <div className="flex flex-col gap-5 w-full">
              {repos.map((r) => (
                <RepoCard key={r.full_name} repo={r} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
