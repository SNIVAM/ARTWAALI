import React from 'react';

interface FooterProps {
  onSecretTrigger: () => void;
  isAuthenticated: boolean;
  onOpenBossPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSecretTrigger,
  isAuthenticated,
  onOpenBossPanel,
}) => {
  return (
    <footer className="bg-[#101c2b] border-t border-[#4DC8C8]/15 py-10 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="font-serif text-xl font-semibold text-[#ddeaf8]">
            Art<span className="text-[#7FFFD4]">Waali</span>
          </a>
          <span className="text-xs text-[#7a9ab8]/70 hidden sm:inline">&middot; Handcrafted Resin Art</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs uppercase tracking-wider text-[#7a9ab8]">
          <a href="#shop" className="hover:text-[#7FFFD4] transition-colors">
            Shop
          </a>
          <a href="#gallery" className="hover:text-[#7FFFD4] transition-colors">
            Gallery
          </a>
          <a href="#about" className="hover:text-[#7FFFD4] transition-colors">
            About
          </a>
          <a href="#contact" className="hover:text-[#7FFFD4] transition-colors">
            Contact
          </a>
          {isAuthenticated && (
            <button
              onClick={onOpenBossPanel}
              className="text-[#7FFFD4] hover:underline transition-colors font-mono"
            >
              Boss Mode
            </button>
          )}
        </div>

        {/* Copyright & Stealth Trigger */}
        <div className="flex items-center gap-2 text-xs text-[#7a9ab8]/70">
          <span>
            &copy; {new Date().getFullYear()} ArtWaali. All rights reserved.
          </span>

          {/* Discreet 1px trigger button for touch/accessibility without visual clutter */}
          <button
            onClick={onSecretTrigger}
            aria-label="Owner vault trigger"
            className="w-1.5 h-1.5 rounded-full bg-[#4DC8C8]/10 hover:bg-[#7FFFD4]/50 transition-colors"
            title="Owner Vault"
          />
        </div>
      </div>
    </footer>
  );
};
