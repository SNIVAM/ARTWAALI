import React from 'react';
import { SiteContent } from '../types';

interface AboutSectionProps {
  content: SiteContent;
  isEditMode: boolean;
  onUpdateContent: (content: SiteContent) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  content,
  isEditMode,
  onUpdateContent,
}) => {
  return (
    <section id="about" className="bg-[#101c2b] border-y border-[#4DC8C8]/15 py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Story Text */}
        <div className="space-y-6">
          <span className="text-[10px] font-medium tracking-[0.24em] uppercase text-[#C9A84C] block font-mono">
            Our Story
          </span>

          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdateContent({ ...content, aboutHeading: e.currentTarget.textContent || content.aboutHeading })
            }
            className={`font-serif text-3xl sm:text-5xl font-light text-[#ddeaf8] leading-tight ${
              isEditMode ? 'outline-dashed outline-1 outline-[#C9A84C] cursor-text' : ''
            }`}
          >
            Born from <em className="italic text-[#7FFFD4]">passion</em>,<br />
            poured with care
          </h2>

          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdateContent({ ...content, aboutP1: e.currentTarget.textContent || content.aboutP1 })
            }
            className={`text-sm text-[#7a9ab8] leading-relaxed ${
              isEditMode ? 'outline-dashed outline-1 outline-[#C9A84C] cursor-text' : ''
            }`}
          >
            {content.aboutP1}
          </p>

          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdateContent({ ...content, aboutP2: e.currentTarget.textContent || content.aboutP2 })
            }
            className={`text-sm text-[#7a9ab8] leading-relaxed ${
              isEditMode ? 'outline-dashed outline-1 outline-[#C9A84C] cursor-text' : ''
            }`}
          >
            {content.aboutP2}
          </p>

          <p className="text-sm text-[#7a9ab8] leading-relaxed">
            We ship Pan-India and warmly accept custom commissions for gifting, weddings, and corporate events.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl border border-[#4DC8C8]/20 bg-[#7FFFD4]/[0.02] hover:border-[#4DC8C8]/40 transition-colors">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#7FFFD4] mb-2">500+</div>
            <div className="text-xs text-[#7a9ab8]">Pieces crafted &amp; shipped across India</div>
          </div>

          <div className="p-6 rounded-xl border border-[#4DC8C8]/20 bg-[#7FFFD4]/[0.02] hover:border-[#4DC8C8]/40 transition-colors">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#7FFFD4] mb-2">4.9★</div>
            <div className="text-xs text-[#7a9ab8]">Average verified customer rating</div>
          </div>

          <div className="p-6 rounded-xl border border-[#4DC8C8]/20 bg-[#7FFFD4]/[0.02] hover:border-[#4DC8C8]/40 transition-colors">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#7FFFD4] mb-2">3+</div>
            <div className="text-xs text-[#7a9ab8]">Years of dedicated resin artistry</div>
          </div>

          <div className="p-6 rounded-xl border border-[#4DC8C8]/20 bg-[#7FFFD4]/[0.02] hover:border-[#4DC8C8]/40 transition-colors">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#7FFFD4] mb-2">100%</div>
            <div className="text-xs text-[#7a9ab8]">Food-safe, non-toxic premium epoxy</div>
          </div>
        </div>
      </div>
    </section>
  );
};
