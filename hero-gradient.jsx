import React from "react";
import { createRoot } from "react-dom/client";
import { Hazeglow, parseConfig } from "hazeglow";
import "./service-gallery";

const config = parseConfig({
  "version": 1,
  "seed": 3,
  "shape": "pill",
  "center": [
    0.5,
    0.5
  ],
  "size": [
    0.73,
    0.6
  ],
  "roundness": 1,
  "softness": 0.21,
  "rotation": 0,
  "rampDirection": 0.55,
  "angle": 90,
  "warp": 0.51,
  "warpScale": 2.3,
  "palette": [
    "#ff4013",
    "#000000",
    "#ffaa00",
    "#fffbb9",
    "#fec700"
  ],
  "background": "#000000",
  "mesh": [],
  "grain": 0.62,
  "motion": "drift",
  "speed": 0.7,
  "loop": 0,
  "hover": 0.5,
  "hoverMode": "pull",
  "effect": "none",
  "effectSize": 8,
  "effectAmount": 0.5
});

const background = document.getElementById("page-bg");
createRoot(background).render(<Hazeglow config={config} />);

document.addEventListener("pointermove", (event) => {
  const canvas = background.querySelector("canvas");
  if (!canvas || event.target === canvas) return;
  canvas.dispatchEvent(new PointerEvent("pointermove", {
    bubbles: true,
    clientX: event.clientX,
    clientY: event.clientY,
    pointerId: event.pointerId,
    pointerType: event.pointerType
  }));
});

document.addEventListener("pointerout", (event) => {
  const canvas = background.querySelector("canvas");
  if (event.relatedTarget || !canvas || event.target === canvas) return;
  canvas.dispatchEvent(new PointerEvent("pointerout", {
    bubbles: true,
    pointerId: event.pointerId,
    pointerType: event.pointerType
  }));
});
