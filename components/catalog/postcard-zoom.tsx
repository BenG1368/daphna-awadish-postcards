"use client";

import { DismissableLayerBranch } from "@radix-ui/react-dismissable-layer";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export function PostcardZoom({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const onCloseRef = useRef(onClose);
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const offsetRef = useRef(offset);
  const scaleRef = useRef(scale);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(
    null,
  );
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const zoomAtRef = useRef<(nextScale: number, clientX?: number, clientY?: number) => void>(
    () => {},
  );
  const commitRef = useRef<(nextScale: number, nextOffset: { x: number; y: number }) => void>(
    () => {},
  );

  onCloseRef.current = onClose;

  function commit(nextScale: number, nextOffset: { x: number; y: number }) {
    const node = frame.current;
    const picture = image.current;
    let resolved = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    let next = nextOffset;
    if (resolved === MIN_SCALE) {
      next = { x: 0, y: 0 };
    } else if (node && picture) {
      const limits = panLimits(picture, node, resolved);
      next = {
        x: clamp(next.x, -limits.x, limits.x),
        y: clamp(next.y, -limits.y, limits.y),
      };
    }
    scaleRef.current = resolved;
    offsetRef.current = next;
    setScale(resolved);
    setOffset(next);
  }

  function zoomAt(nextScale: number, clientX?: number, clientY?: number) {
    const picture = image.current;
    const prev = scaleRef.current;
    const resolved = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    if (!picture || clientX == null || clientY == null || prev <= 0) {
      commit(resolved, offsetRef.current);
      return;
    }
    const rect = picture.getBoundingClientRect();
    const originX = rect.left + rect.width / 2 - offsetRef.current.x;
    const originY = rect.top + rect.height / 2 - offsetRef.current.y;
    const pointX = clientX - originX;
    const pointY = clientY - originY;
    const localX = (pointX - offsetRef.current.x) / prev;
    const localY = (pointY - offsetRef.current.y) / prev;
    commit(resolved, {
      x: pointX - localX * resolved,
      y: pointY - localY * resolved,
    });
  }

  zoomAtRef.current = zoomAt;
  commitRef.current = commit;

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const node = frame.current;
      if (!node || !(event.target instanceof Node) || !node.contains(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      zoomAtRef.current(scaleRef.current * wheelFactor(event), event.clientX, event.clientY);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomAtRef.current(scaleRef.current * 1.25);
        return;
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomAtRef.current(scaleRef.current / 1.25);
        return;
      }
      if (event.key === "0") {
        event.preventDefault();
        zoomAtRef.current(MIN_SCALE);
        return;
      }
      if (scaleRef.current <= MIN_SCALE) return;
      const step = event.shiftKey ? 120 : 56;
      const move: Record<string, [number, number]> = {
        ArrowLeft: [step, 0],
        ArrowRight: [-step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step],
      };
      const delta = move[event.key];
      if (!delta) return;
      event.preventDefault();
      commitRef.current(scaleRef.current, {
        x: offsetRef.current.x + delta[0],
        y: offsetRef.current.y + delta[1],
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);

  useEffect(() => {
    frame.current?.focus();
    const id = window.setTimeout(() => setShowHint(false), 2600);
    return () => window.clearTimeout(id);
  }, []);

  function pointerDistance() {
    const points = [...pointers.current.values()];
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }

  function onPointerDown(event: React.PointerEvent<HTMLImageElement>) {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers reject capture until the pointer is active. Tracking still works.
    }
    if (pointers.current.size === 2) {
      pinch.current = { distance: pointerDistance(), scale: scaleRef.current };
      drag.current = null;
      return;
    }
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      ox: offsetRef.current.x,
      oy: offsetRef.current.y,
      moved: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLImageElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2 && pinch.current && pinch.current.distance > 0) {
      zoomAt(pinch.current.scale * (pointerDistance() / pinch.current.distance));
      return;
    }

    const activeDrag = drag.current;
    if (!activeDrag || scaleRef.current <= MIN_SCALE) return;
    const dx = event.clientX - activeDrag.x;
    const dy = event.clientY - activeDrag.y;
    if (Math.hypot(dx, dy) > 4) activeDrag.moved = true;
    commit(scaleRef.current, { x: activeDrag.ox + dx, y: activeDrag.oy + dy });
  }

  function onPointerUp(event: React.PointerEvent<HTMLImageElement>) {
    pointers.current.delete(event.pointerId);
    pinch.current = null;
    drag.current = null;
  }

  return createPortal(
    <DismissableLayerBranch
      ref={frame}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      tabIndex={-1}
      data-zoom-layer
      style={{ pointerEvents: "auto" }}
      className="pointer-events-auto fixed inset-0 z-[70] flex touch-none items-center justify-center overflow-hidden bg-[#1c1917]/88 outline-none"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current();
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={image}
        src={src}
        alt={alt}
        draggable={false}
        onDoubleClick={(event) => {
          event.stopPropagation();
          const next = scaleRef.current > 1.05 ? MIN_SCALE : 2.4;
          zoomAt(next, event.clientX, event.clientY);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          transformOrigin: "center center",
        }}
        className={
          scale > 1
            ? "max-h-[92vh] max-w-[92vw] cursor-grab select-none active:cursor-grabbing"
            : "max-h-[92vh] max-w-[92vw] cursor-zoom-in select-none"
        }
      />
      <button
        type="button"
        aria-label="Close enlarged view"
        className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-[#1c1917]/80 text-white hover:bg-[#1c1917]"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onCloseRef.current();
        }}
      >
        <X className="size-5" />
      </button>
      <p
        className={`pointer-events-none absolute bottom-6 text-xs tracking-wide text-white/75 transition-opacity duration-500 ${showHint ? "opacity-100" : "opacity-0"}`}
      >
        {scale > 1 ? "Drag to move · scroll to zoom" : "Scroll to zoom · click outside to close"}
      </p>
    </DismissableLayerBranch>,
    document.body,
  );
}

function wheelFactor(event: WheelEvent) {
  let delta = event.deltaY;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= 800;
  const gain = event.ctrlKey ? 0.012 : 0.0024;
  return Math.exp(-delta * gain);
}

function panLimits(picture: HTMLImageElement, frame: HTMLElement, scale: number) {
  return {
    x: Math.max(0, (picture.offsetWidth * scale - frame.clientWidth) / 2),
    y: Math.max(0, (picture.offsetHeight * scale - frame.clientHeight) / 2),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
