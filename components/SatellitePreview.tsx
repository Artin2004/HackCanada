"use client";

import { useState } from "react";
import { buildSatelliteUrl, buildSatelliteThumbnailUrl } from "@/lib/data/satellite-url";

interface SatellitePreviewProps {
  lat: number;
  lon: number;
  /** If we already have an image_url from AI analysis, use that. Otherwise build one. */
  imageUrl?: string | null;
  /** "thumb" = 300x200 card preview, "full" = 600x400 modal banner */
  size?: "thumb" | "full";
  className?: string;
}

export function SatellitePreview({ lat, lon, imageUrl, size = "thumb", className = "" }: SatellitePreviewProps) {
  const [errored, setErrored] = useState(false);
  const url = imageUrl || (size === "full" ? buildSatelliteUrl(lat, lon) : buildSatelliteThumbnailUrl(lat, lon));

  if (errored) {
    return (
      <div className={`bg-slate-800 flex items-center justify-center text-slate-500 text-xs ${className}`}>
        Satellite unavailable
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`Satellite view ${lat.toFixed(3)}°N ${Math.abs(lon).toFixed(3)}°W`}
      onError={() => setErrored(true)}
      className={`object-cover ${className}`}
    />
  );
}

/** Floating popup shown above a map marker on hover */
interface SatelliteTooltipProps {
  lat: number;
  lon: number;
  imageUrl?: string | null;
  riskLevel?: string;
  frp?: number;
  /** Pixel position of the map dot on screen */
  screenX: number;
  screenY: number;
}

export function SatelliteTooltip({ lat, lon, imageUrl, riskLevel, frp, screenX, screenY }: SatelliteTooltipProps) {
  return (
    <div
      className="fixed z-[9998] pointer-events-none"
      style={{
        left: screenX,
        top: screenY,
        transform: "translate(-50%, calc(-100% - 18px))",
      }}
    >
      <div className="rounded-xl overflow-hidden border border-slate-600 bg-slate-900 shadow-2xl w-52">
        <SatellitePreview lat={lat} lon={lon} imageUrl={imageUrl} size="thumb" className="w-full h-32" />
        <div className="px-3 py-2 space-y-0.5">
          <p className="text-[10px] font-mono text-slate-400">
            {lat.toFixed(3)}°N &nbsp;{Math.abs(lon).toFixed(3)}°W
          </p>
          {riskLevel && (
            <p className={`text-xs font-bold ${
              riskLevel === "HIGH" ? "text-red-400" : riskLevel === "MEDIUM" ? "text-amber-400" : "text-emerald-400"
            }`}>{riskLevel} RISK</p>
          )}
          {frp != null && (
            <p className="text-[10px] text-slate-500">FRP: <span className="text-slate-300 font-mono">{frp.toFixed(1)} MW</span></p>
          )}
        </div>
        {/* Arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-7px] w-3 h-3 bg-slate-900 border-r border-b border-slate-600 rotate-45" />
      </div>
    </div>
  );
}
