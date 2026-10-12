import React from 'react';
import { Shield, Lock, Unlock, LogOut } from 'lucide-react';

interface NavigationProps {
  isAuthenticated: boolean;
  onOpenBossPanel: () => void;
  onLogoutBoss: () => void;
  onSecretTrigger?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated,
  onOpenBossPanel,
  onLogoutBoss,
}) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="main-navigation"
      className="fixed top-0 left-0 right-0 h-[68px] flex items-center justify-between px-6 sm:px-12 bg-[#08121e]/90 backdrop-blur-xl border-b border-[#4DC8C8]/15 z-40"
    >
      {/* Brand Logo - Navigates smoothly to top */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          id="brand-logo"
          onClick={handleLogoClick}
          className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-[#ddeaf8] select-none cursor-pointer transition-opacity hover:opacity-90"
          title="ArtWaali Handmade Resin Art"
        >
          Art<span className="text-[#7FFFD4]">Waali</span>
        </a>

        {/* Authenticated Owner Badge - ONLY visible to authenticated owner */}
        {isAuthenticated && (
          <div
            id="owner-status-badge"
            className="flex items-center gap-2 pl-3 ml-2 border-l border-[#4DC8C8]/25 animate-fadeIn"
          >
            <button
              onClick={onOpenBossPanel}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7FFFD4]/10 hover:bg-[#7FFFD4]/20 border border-[#7FFFD4]/35 text-[#7FFFD4] text-xs font-mono font-medium transition-all"
              title="Open Boss Mode Dashboard"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Boss Mode:</span>
              <span className="font-semibold">Active</span>
            </button>
            <button
              onClick={onLogoutBoss}
              className="p-1 text-[#7a9ab8] hover:text-red-400 transition-colors"
              title="Lock & Hide Boss Mode"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-6 sm:gap-8">
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#shop"
            className="text-xs uppercase tracking-widest text-[#7a9ab8] hover:text-[#7FFFD4] transition-colors"
          >
            Shop
          </a>
          <a
            href="#gallery"
            className="text-xs uppercase tracking-widest text-[#7a9ab8] hover:text-[#7FFFD4] transition-colors"
          >
            Gallery
          </a>
          <a
            href="#about"
            className="text-xs uppercase tracking-widest text-[#7a9ab8] hover:text-[#7FFFD4] transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-xs uppercase tracking-widest text-[#7a9ab8] hover:text-[#7FFFD4] transition-colors"
          >
            Contact
          </a>
        </div>

        <a
          href="#contact"
          id="nav-custom-order-btn"
          className="text-xs uppercase font-medium tracking-wider text-[#052422] bg-[#7FFFD4] hover:bg-[#4DC8C8] px-4 sm:px-5 py-2 rounded transition-all duration-200 shadow-[0_2px_15px_rgba(127,255,212,0.25)]"
        >
          Custom Order
        </a>
      </div>
    </nav>
  );
};
