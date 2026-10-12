import React, { useState, useEffect } from 'react';
import { Fingerprint, Lock, ShieldCheck, AlertCircle, Eye, EyeOff, X, KeyRound, Clock } from 'lucide-react';
import { BossSecurityConfig } from '../types';
import {
  verifyPin,
  checkBiometricsSupport,
  authenticateWithBiometrics,
  saveSecurityConfig,
} from '../utils/security';

interface BossAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  securityConfig: BossSecurityConfig;
  onUpdateSecurityConfig: (cfg: BossSecurityConfig) => void;
}

export const BossAuthModal: React.FC<BossAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  securityConfig,
  onUpdateSecurityConfig,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Check lockout status
  useEffect(() => {
    if (!securityConfig.lockoutUntil) {
      setLockoutRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((securityConfig.lockoutUntil! - now) / 1000));
      setLockoutRemaining(remaining);
      if (remaining <= 0 && securityConfig.lockoutUntil) {
        onUpdateSecurityConfig({
          ...securityConfig,
          lockoutUntil: null,
          failedAttempts: 0,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [securityConfig, onUpdateSecurityConfig]);

  // Check biometrics availability
  useEffect(() => {
    if (isOpen) {
      checkBiometricsSupport().then(setBiometricsAvailable);
      setPin('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLockedOut = lockoutRemaining > 0;

  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLockedOut) return;

    if (!pin) {
      setErrorMsg('Please enter your Secret Master PIN.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const isValid = await verifyPin(pin, securityConfig.pinSalt, securityConfig.pinHash);

      if (isValid) {
        // Reset failed attempts
        onUpdateSecurityConfig({
          ...securityConfig,
          failedAttempts: 0,
          lockoutUntil: null,
        });
        setPin('');
        onSuccess();
      } else {
        const newAttempts = (securityConfig.failedAttempts || 0) + 1;
        let newLockout: number | null = null;

        if (newAttempts >= 3) {
          const lockoutDurationSeconds = newAttempts >= 5 ? 60 : 30;
          newLockout = Date.now() + lockoutDurationSeconds * 1000;
          setLockoutRemaining(lockoutDurationSeconds);
          setErrorMsg(`Strict security lockout triggered: Too many failed attempts. Locked for ${lockoutDurationSeconds}s.`);
        } else {
          setErrorMsg(`Invalid Master PIN. ${3 - newAttempts} attempt(s) remaining before lockout.`);
        }

        onUpdateSecurityConfig({
          ...securityConfig,
          failedAttempts: newAttempts,
          lockoutUntil: newLockout,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBiometricAuth = async () => {
    if (isLockedOut) return;
    setIsVerifying(true);
    setErrorMsg('');

    const res = await authenticateWithBiometrics(securityConfig.biometricCredentialId);
    if (res.success) {
      onUpdateSecurityConfig({
        ...securityConfig,
        failedAttempts: 0,
        lockoutUntil: null,
      });
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Biometric verification failed. Please enter Master PIN.');
    }
    setIsVerifying(false);
  };

  const handleNumClick = (val: string) => {
    if (isLockedOut) return;
    if (pin.length < 32) {
      setPin(prev => prev + val);
    }
  };

  const handleClearPin = () => {
    setPin('');
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div
      id="boss-auth-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04090f]/85 backdrop-blur-md transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="boss-auth-card"
        className="relative w-full max-w-md overflow-hidden bg-[#101c2b] border border-[#4DC8C8]/25 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#ddeaf8]"
      >
        {/* Close button */}
        <button
          id="close-boss-auth"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7a9ab8] hover:text-[#7FFFD4] rounded-lg transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4DC8C8]/20 to-[#7FFFD4]/10 border border-[#4DC8C8]/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(77,200,200,0.15)]">
            <Lock className="w-7 h-7 text-[#7FFFD4]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#7FFFD4] tracking-wide">
            Master Vault Verification
          </h2>
          <p className="text-xs sm:text-sm text-[#7a9ab8] mt-1">
            Strict Owner Authentication &middot; Zero Plaintext Exposure
          </p>
        </div>

        {/* Lockout Warning */}
        {isLockedOut && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-3 text-red-200 text-xs sm:text-sm">
            <Clock className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-medium text-red-400">Security Cooldown Active:</span>
              <p className="text-red-300/90 mt-0.5">
                Boss Mode is locked against brute force. Try again in {lockoutRemaining}s.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && !isLockedOut && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-red-300 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Biometrics Quick Action (if supported) */}
        {biometricsAvailable && (
          <div className="mb-6">
            <button
              id="biometric-login-btn"
              type="button"
              disabled={isLockedOut || isVerifying}
              onClick={handleBiometricAuth}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#4DC8C8]/20 via-[#7FFFD4]/15 to-[#4DC8C8]/20 hover:from-[#4DC8C8]/30 hover:to-[#7FFFD4]/30 border border-[#7FFFD4]/35 text-[#7FFFD4] font-medium text-sm transition-all duration-200 shadow-[0_0_15px_rgba(127,255,212,0.1)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
            >
              <Fingerprint className="w-5 h-5 text-[#7FFFD4] animate-pulse" />
              <span>Authenticate with Biometrics (Touch ID / Face ID)</span>
            </button>
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4DC8C8]/15"></div>
              </div>
              <span className="relative px-3 bg-[#101c2b] text-[11px] uppercase tracking-widest text-[#7a9ab8]">
                Or enter Secret Master PIN
              </span>
            </div>
          </div>
        )}

        {/* Master PIN Input & Keypad */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-between text-xs text-[#7a9ab8] mb-1.5 font-mono">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#C9A84C]" />
                SECRET MASTER PIN
              </span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="hover:text-[#7FFFD4] transition-colors flex items-center gap-1"
              >
                {showPin ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Peek</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                id="master-pin-input"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={isLockedOut || isVerifying}
                placeholder="Enter secret Boss Password"
                autoFocus
                maxLength={32}
                className="w-full py-3.5 px-4 bg-[#08121e]/90 border border-[#4DC8C8]/30 rounded-xl text-center text-lg sm:text-xl font-mono tracking-widest text-[#7FFFD4] placeholder:text-[#7a9ab8]/40 focus:outline-none focus:border-[#7FFFD4] focus:ring-1 focus:ring-[#7FFFD4] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Quick PIN Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={isLockedOut}
                onClick={() => handleNumClick(digit)}
                className="py-2.5 rounded-lg bg-[#08121e]/60 hover:bg-[#4DC8C8]/15 border border-[#4DC8C8]/15 hover:border-[#7FFFD4]/40 text-sm sm:text-base text-[#ddeaf8] hover:text-[#7FFFD4] font-medium transition-all active:scale-95 disabled:opacity-40"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              disabled={isLockedOut}
              onClick={handleClearPin}
              className="py-2.5 rounded-lg bg-[#08121e]/40 hover:bg-red-950/30 border border-[#4DC8C8]/10 hover:border-red-500/30 text-xs text-[#7a9ab8] hover:text-red-400 transition-all active:scale-95 disabled:opacity-40"
            >
              CLEAR
            </button>
            <button
              type="button"
              disabled={isLockedOut}
              onClick={() => handleNumClick('0')}
              className="py-2.5 rounded-lg bg-[#08121e]/60 hover:bg-[#4DC8C8]/15 border border-[#4DC8C8]/15 hover:border-[#7FFFD4]/40 text-sm sm:text-base text-[#ddeaf8] hover:text-[#7FFFD4] font-medium transition-all active:scale-95 disabled:opacity-40"
            >
              0
            </button>
            <button
              type="button"
              disabled={isLockedOut}
              onClick={handleBackspace}
              className="py-2.5 rounded-lg bg-[#08121e]/40 hover:bg-[#4DC8C8]/15 border border-[#4DC8C8]/10 text-xs text-[#7a9ab8] hover:text-[#7FFFD4] transition-all active:scale-95 disabled:opacity-40"
            >
              ⌫
            </button>
          </div>

          {/* Unlock Submit Button */}
          <button
            id="submit-pin-btn"
            type="submit"
            disabled={isLockedOut || isVerifying || !pin}
            className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] hover:opacity-95 text-[#052422] font-semibold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_4px_20px_rgba(77,200,200,0.25)] hover:shadow-[0_6px_25px_rgba(127,255,212,0.35)] disabled:opacity-40 disabled:pointer-events-none"
          >
            {isVerifying ? 'Cryptographically Verifying...' : 'Unlock Boss Mode'}
          </button>
        </form>

        {/* Security Disclaimers & Trigger info */}
        <div className="mt-5 pt-4 border-t border-[#4DC8C8]/15 text-[11px] text-[#7a9ab8] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#C9A84C]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">Strict Privacy Protected:</span>
          </div>
          <p className="leading-relaxed">
            No plaintext passwords exist anywhere in source code or storage. Verifies only salted SHA-256 hashes.
          </p>
          <div className="p-2 bg-[#08121e]/60 rounded-lg border border-[#4DC8C8]/10 text-[10px] text-[#7a9ab8] font-mono">
            <span className="text-[#7FFFD4]">Owner Secret Trigger:</span> Press <kbd className="px-1 py-0.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded text-[#7FFFD4]">Ctrl+Shift+B</kbd> anytime to summon this prompt.
          </div>
        </div>
      </div>
    </div>
  );
};
