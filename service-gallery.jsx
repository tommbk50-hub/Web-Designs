import React from 'react';
import { createRoot } from 'react-dom/client';
import AccordionGallery from './AccordionGallery';
import BorderGlow from './BorderGlow';

const items = [
  { image: './Images/veneers.png', label: 'Porcelain veneers', alt: 'Illustration of three thin porcelain dental veneers' },
  { image: './Images/crowns.png', label: 'Ceramic crowns', alt: 'Illustration of three ceramic dental crowns' },
  { image: './Images/bridges.png', label: 'Dental bridge', alt: 'Illustration of a three-unit dental bridge' }
];

const mount = document.getElementById('service-gallery-root');
if (mount) {
  createRoot(mount).render(
    <>
      <BorderGlow
        edgeSensitivity={20}
        glowColor="40 80 80"
        backgroundColor="#120F17"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={0.8}
        coneSpread={25}
        colors={['#c59b47', '#f6d995', '#d99b26']}
      >
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-200">Explore our disciplines</span>
            <h2 id="service-gallery-title" className="text-2xl sm:text-3xl font-medium text-white mt-2">A closer look at dental craft</h2>
            <p className="text-sm text-white/75 mt-2">Illustrative product artwork, not photographs of patient cases or work by our laboratory.</p>
          </div>
          <a className="shrink-0 rounded-full border border-amber-200/50 px-5 py-2.5 text-sm font-medium text-amber-100 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"
            href="#digital-prescription">Prescribe online →</a>
        </div>
      </BorderGlow>
      <div className="mt-8">
        <AccordionGallery items={items} defaultIndex={1} expandRatio={0.52} trigger="hover"
          accentColor="#f6d995" overlayColor="#120f17" radius={28} />
      </div>
    </>
  );
}
