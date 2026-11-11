import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './AccordionGallery.css';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

export default function AccordionGallery({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  grayscale = true,
  showLabels = true,
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  className = ''
}) {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const timelineRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);
  const count = items.length;
  const [active, setActive] = useState(() => Math.min(Math.max(defaultIndex, 0), count - 1));
  const selected = Math.min(Math.max(active, 0), count - 1);
  const vertical = orientation === 'vertical';

  const applyLayout = useCallback(animate => {
    if (!count || !rootRef.current) return;
    const column = getComputedStyle(rootRef.current).flexDirection === 'column';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
    const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
    const dur = animate && !reduced ? duration : 0;
    timelineRef.current?.kill();
    const timeline = gsap.timeline();

    panelRefs.current.slice(0, count).forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === selected;
      const rot = isActive ? 0 : i < selected ? tilt : -tilt;
      timeline.to(panel, {
        flexGrow: isActive ? grow : 1,
        ...(column ? { rotateX: -rot } : { rotateY: rot }),
        duration: dur, ease
      }, 0);

      const media = mediaRefs.current[i];
      if (media) {
        const drift = Math.max(-1.5, Math.min(1.5, selected - i));
        const shift = drift * parallax * mediaSizeRef.current * 0.06;
        timeline.to(media, {
          xPercent: -50, yPercent: -50,
          x: column ? 0 : isActive ? 0 : shift,
          y: column && !isActive ? shift : 0,
          '--ag-gray': grayscale && !isActive ? 1 : 0,
          '--ag-dim': isActive ? 0 : 0.35,
          duration: dur, ease
        }, 0);
      }

      const bar = barRefs.current[i];
      const text = textRefs.current[i];
      if (showLabels && bar && text) {
        timeline.to([bar, text], isActive
          ? { opacity: 1, x: 0, duration: dur, ease, stagger: reduced ? 0 : stagger }
          : { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
      }
    });
    timelineRef.current = timeline;
  }, [count, selected, expandRatio, duration, ease, tilt, parallax, grayscale, showLabels, stagger]);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const column = getComputedStyle(el).flexDirection === 'column';
      const total = column ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
      firstRunRef.current = false;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
      timelineRef.current?.kill();
    };
  }, [applyLayout, gap, count, expandRatio]);

  const handleKeyDown = (i, event) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % count;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i - 1 + count) % count;
    if (next !== undefined) {
      event.preventDefault();
      setActive(next);
      panelRefs.current[next]?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: `${vertical ? Math.round(height * 1.6) : height}px`
      }}
      role="group"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === selected;
        const Tag = item.link ? 'a' : 'button';
        return (
          <Tag
            key={i}
            ref={el => { panelRefs.current[i] = el; }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            href={item.link || undefined}
            type={item.link ? undefined : 'button'}
            onClick={event => {
              if (!isActive) {
                event.preventDefault();
                setActive(i);
              }
            }}
            onPointerEnter={event => {
              if (trigger === 'hover' && event.pointerType !== 'touch') setActive(i);
            }}
            onFocus={() => setActive(i)}
            onKeyDown={event => handleKeyDown(i, event)}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label || item.alt || `Image ${i + 1}`}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={el => { mediaRefs.current[i] = el; }}>
                <img src={item.image} alt={item.alt || item.label || ''} loading="lazy" draggable="false" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={el => { barRefs.current[i] = el; }} />
                <span className="ag-panel__text" ref={el => { textRefs.current[i] = el; }}>{item.label}</span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}
