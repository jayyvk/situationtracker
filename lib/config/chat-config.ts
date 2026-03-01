import type { ChatSource } from "@/lib/types/signals";

export const chatSource: ChatSource = {
  id: "launchpad",
  label: "Ops Chat",
  launchUrl: "https://discord.com/channels/@me",
  note:
    "Use this slot for an embeddable chat provider later. Discord is linked externally for v1 because reliable iframe embedding is inconsistent."
};
