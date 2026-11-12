import React from "react";
import { createRoot } from "react-dom/client";
import LogoLoop from "./LogoLoop";
import logos from "award-logos";
import "./award-logo-loop.css";

if (logos.length) {
  createRoot(document.getElementById("award-logo-loop")).render(
    <LogoLoop
      logos={logos}
      speed={45}
      logoHeight={54}
      gap={64}
      hoverSpeed={0}
      draggable={false}
      intro={false}
      ariaLabel="Knight Dental Design awards"
    />
  );
}
