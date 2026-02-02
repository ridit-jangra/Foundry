export function log(
  message: string,
  origin: string = "Foundry",
  type: "default" | "error" | "warning" = "default",
): void {
  console.log(`[${origin} (${type})] (${Date.now().toString()}): ${message}`);
}
