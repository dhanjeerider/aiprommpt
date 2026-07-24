import { Copy, Heart, Bookmark, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Prompt copied to clipboard");
          setTimeout(() => setCopied(false), 1600);
        } catch {
          toast.error("Could not copy");
        }
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg",
        className
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy prompt"}
    </button>
  );
}

export function LikeButton({ initial = 0 }: { initial?: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initial);
  return (
    <button
      onClick={() => {
        setLiked((v) => !v);
        setCount((c) => c + (liked ? -1 : 1));
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2.5 text-sm font-medium transition hover:bg-white",
        liked && "border-rose-200 bg-rose-50 text-rose-600"
      )}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      {count}
    </button>
  );
}

export function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => {
        setSaved((v) => !v);
        toast.success(saved ? "Removed from saved" : "Saved to your collection");
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2.5 text-sm font-medium transition hover:bg-white",
        saved && "border-indigo-200 bg-indigo-50 text-indigo-600"
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
