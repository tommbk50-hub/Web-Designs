import React, { useCallback, useEffect, useRef } from 'react';
import './BorderGlow.css';

function buildGlowVars(glowColor, intensity) {
  const match = glowColor.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  const [h, s, l] = match ? match.slice(1).map(Number) : [40, 80, 80];
  const vars = {};
  [100, 60, 50, 40, 30, 20, 10].forEach((opacity, i) => {
    vars[`--glow-color${i ? `-${opacity}` : ''}`] =
      `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`;
  });
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];
const DEFAULT_COLORS = ['#c084fc', '#f472b6', '#38bdf8'];

function buildGradientVars(colors) {
  const palette = colors.length ? colors : DEFAULT_COLORS;
  const vars = {};
  GRADIENT_KEYS.forEach((key, i) => {
    const color = palette[Math.min(COLOR_MAP[i], palette.length - 1)];
    vars[key] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${color} 0px, transparent 50%)`;
  });
  vars['--gradient-base'] = `linear-gradient(${palette[0]} 0 100%)`;
  return vars;
}

function isLightColor(color) {
  const value = color.trim().replace('#', '');
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

const easeOutCubic = x => 1 - (1 - x) ** 3;
const easeInCubic = x => x ** 3;

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  let frame = 0;
  const timer = setTimeout(() => {
    function tick() {
      const t = Math.min((performance.now() - t0) / duration, 1);
      onUpdate(start + (end - start) * ease(t));
      if (t < 1) frame = requestAnimationFrame(tick);
      else onEnd?.();
    }
    frame = requestAnimationFrame(tick);
  }, delay);
  return () => {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.5
}) {
  const cardRef = useRef(null);

  const handlePointerMove = useCallback(event => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    const edge = Math.min(Math.max(Math.abs(dx) / (rect.width / 2), Math.abs(dy) / (rect.height / 2)), 1);
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 450) % 360;
    card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);
    const animations = [
      animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) }),
      animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v =>
        card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`) }),
      animateValue({ delay: 1500, duration: 2250, start: 50, onUpdate: v =>
        card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`) }),
      animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
        onUpdate: v => card.style.setProperty('--edge-proximity', v),
        onEnd: () => card.classList.remove('sweep-active')
      })
    ];
    return () => {
      animations.forEach(cancel => cancel());
      card.classList.remove('sweep-active');
    };
  }, [animated]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card${isLightColor(backgroundColor) ? ' border-glow-card--light' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': Math.min(edgeSensitivity, 99),
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors)
      }}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
