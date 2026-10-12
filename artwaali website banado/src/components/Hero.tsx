import React from 'react';
import { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent;
  isEditMode: boolean;
  onUpdateContent: (content: SiteContent) => void;
}

export const Hero: React.FC<HeroProps> = ({ content, isEditMode, onUpdateContent }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden"
    >
      {/* Dynamic Ambient Backgrounds */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_15%_45%,rgba(0,130,130,0.32)_0%,transparent_70%),radial-gradient(ellipse_55%_50%_at_82%_22%,rgba(127,255,212,0.17)_0%,transparent_60%),radial-gradient(ellipse_50%_45%_at_55%_82%,rgba(201,168,76,0.17)_0%,transparent_60%)]" />

      {/* Atmospheric Blurred Blobs with drifting animation */}
      <div className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,155,155,0.25)_0%,transparent_70%)] blur-[70px] pointer-events-none animate-pulse" />
      <div className="absolute top-[18%] -right-16 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.16)_0%,transparent_70%)] blur-[70px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.17)_0%,transparent_70%)] blur-[70px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Tagline Badge */}
        <div
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => onUpdateContent({ ...content, heroTag: e.currentTarget.textContent || content.heroTag })}
          className={`inline-block text-[10px] font-medium tracking-[0.26em] uppercase text-[#C9A84C] py-1.5 px-4 rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/5 mb-7 transition-all ${
            isEditMode ? 'outline-dashed outline-1 outline-[#C9A84C] cursor-text' : ''
          }`}
        >
          {content.heroTag}
        </div>

        {/* Hero Title */}
        <h1
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => onUpdateContent({ ...content, heroHeading: e.currentTarget.textContent || content.heroHeading })}
          className={`font-serif text-5xl sm:text-7xl lg:text-8xl font-light leading-[1.02] tracking-tight text-[#ddeaf8] mb-6 max-w-3xl transition-all ${
            isEditMode ? 'outline-dashed outline-1 outline-[#C9A84C] cursor-text' : ''
          }`}
        >
          Where Light<br />
          Becomes <em className="italic text-[#7FFFD4]">Art</em>
        </h1>

        {/* Hero Subtitle */}
        <p
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => onUpdateContent({ ...content, heroSub: e.currentTarget.textContent || content.heroSub })}
          className={`text-base sm:text-lg font-light text-[#7a9ab8] leading-relaxed max-w-lg mb-10 transition-all ${
            isEditMode ? 'outline-dashed outline-1 outline-[#C9A84C] cursor-text' : ''
          }`}
        >
          {content.heroSub}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#shop"
            id="hero-explore-btn"
            className="px-8 py-3.5 rounded bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] text-[#08121e] text-xs font-semibold uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-[0_10px_35px_rgba(127,255,212,0.3)] transition-all duration-200"
          >
            Explore Collection
          </a>
          <a
            href="#contact"
            id="hero-contact-btn"
            className="px-8 py-3.5 rounded border border-[#4DC8C8]/25 text-[#ddeaf8] text-xs uppercase tracking-widest hover:border-[#7FFFD4] hover:text-[#7FFFD4] transition-all duration-200"
          >
            Custom Orders
          </a>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#7a9ab8]/70">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#7FFFD4] to-transparent animate-pulse" />
      </div>
    </section>
  );
};
