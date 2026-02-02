import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function get_language_from_path(path: string) {
  const ext = (path.split(".").pop() || "").toLowerCase();

  const map: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rs: "rust",
    go: "go",
    java: "java",
    kt: "kotlin",
    c: "c",
    h: "c",
    cpp: "cpp",
    hpp: "cpp",
    cs: "csharp",
    json: "json",
    yml: "yaml",
    yaml: "yaml",
    md: "markdown",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    less: "less",
    xml: "xml",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    toml: "toml",
    ini: "ini",
    env: "shell",
    txt: "plaintext",
  };

  return map[ext] || "plaintext";
}
