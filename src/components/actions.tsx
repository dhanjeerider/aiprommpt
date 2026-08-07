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
        "btn-orange inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm shadow-lg transition hover:opacity-95",
        className
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
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
        "inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:opacity-95"
      )}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      {liked ? "Liked" : "Like"} {count}
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
        "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold transition hover:bg-white/10",
        saved && "border-primary/40 bg-primary/10 text-primary"
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
