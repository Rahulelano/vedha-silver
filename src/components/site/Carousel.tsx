import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Carousel({
  children,
  className,
  itemClassName = "w-[70%] sm:w-[46%] lg:w-[24%]",
  label,
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children.map((child, i) => (
          <div key={i} className={cn("shrink-0 snap-start", itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${label} left`}
          className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${label} right`}
          className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
