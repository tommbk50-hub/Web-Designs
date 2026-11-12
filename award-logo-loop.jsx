import React from "react";
import { createRoot } from "react-dom/client";
import LogoLoop from "./LogoLoop";
import awardLogos from "award-logos";
import "./award-logo-loop.css";

if (awardLogos.length) {
  createRoot(document.getElementById("award-logo-loop")).render(
    <LogoLoop
      logos={awardLogos}
      speed={45}
      logoHeight={76}
      gap={24}
      hoverSpeed={0}
      draggable={false}
      intro={false}
      ariaLabel="Knight Dental Design awards"
      renderItem={(item, key) => (
        <div className="logoloop__award-card" key={key} title={item.title}>
          <img
            className="logoloop__award-image"
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      )}
    />
  );
}
