import { BossSecurityConfig } from '../types';

// Pre-computed salted SHA-256 hash for Master Authentication
// Notice: Plaintext credentials are never stored, logged, or exposed in source code.
const DEFAULT_SALT = '3b8e63064f609436dc37b74df6c30ecd';
const DEFAULT_HASH = '96e6fea42d68a2cb3c08d48da3139d7328d3a0b1c78f8824042ce97d31d75c5c';

const STORAGE_KEY = 'artwaali_boss_security_v3';

/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute cryptographic SHA-256 hash of salt + pin
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${pin}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify an entered PIN against stored salt and expected hash
 */
export async function verifyPin(enteredPin: string, salt: string, expectedHash: string): Promise<boolean> {
  const computed = await hashPin(enteredPin, salt);
  return computed === expectedHash;
}

/**
 * Retrieve the current Boss Mode security configuration
 */
export function getSecurityConfig(): BossSecurityConfig {
  try {
    // Clear legacy version keys if present
    if (localStorage.getItem('artwaali_boss_security_v2')) {
      localStorage.removeItem('artwaali_boss_security_v2');
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pinSalt: parsed.pinSalt || DEFAULT_SALT,
        pinHash: parsed.pinHash || DEFAULT_HASH,
        biometricsEnabled: !!parsed.biometricsEnabled,
        biometricCredentialId: parsed.biometricCredentialId,
        autoLockMinutes: parsed.autoLockMinutes || 10,
        failedAttempts: parsed.failedAttempts || 0,
        lockoutUntil: parsed.lockoutUntil || null,
      };
    }
  } catch (e) {
    console.warn('Could not read security config from localStorage', e);
  }

  return {
    pinSalt: DEFAULT_SALT,
    pinHash: DEFAULT_HASH,
    biometricsEnabled: false,
    autoLockMinutes: 10,
    failedAttempts: 0,
    lockoutUntil: null,
  };
}

/**
 * Save updated security configuration
 */
export function saveSecurityConfig(config: BossSecurityConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Could not persist security config', e);
  }
}

/**
 * Check if the browser & device supports biometric authentication (WebAuthn Platform Authenticator)
 */
export async function checkBiometricsSupport(): Promise<boolean> {
  try {
    if (!window.PublicKeyCredential) {
      return false;
    }
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Register a biometric credential on the device using WebAuthn
 */
export async function registerBiometricCredential(): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  try {
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'Biometric authentication is not supported by this browser.' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'ArtWaali Owner Vault',
          id: window.location.hostname || 'localhost',
        },
        user: {
          id: userId,
          name: 'owner@artwaali.in',
          displayName: 'ArtWaali Store Owner',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    })) as PublicKeyCredential | null;

    if (!credential) {
      return { success: false, error: 'Registration cancelled or timed out.' };
    }

    const rawId = Array.from(new Uint8Array(credential.rawId))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return { success: true, credentialId: rawId };
  } catch (err: any) {
    console.error('Biometric registration error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to register biometric passkey. Please check device permissions or use Master PIN.',
    };
  }
}

/**
 * Authenticate via Biometrics (Touch ID, Face ID, Windows Hello)
 */
export async function authenticateWithBiometrics(credentialId?: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'Biometric authentication is not supported on this device.' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const allowCredentials: PublicKeyCredentialDescriptor[] = [];
    if (credentialId) {
      const match = credentialId.match(/.{1,2}/g);
      if (match) {
        const idBytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));
        allowCredentials.push({
          type: 'public-key',
          id: idBytes,
          transports: ['internal'],
        });
      }
    }

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname || 'localhost',
        userVerification: 'required',
        timeout: 60000,
        ...(allowCredentials.length > 0 ? { allowCredentials } : {}),
      },
    });

    if (assertion) {
      return { success: true };
    }
    return { success: false, error: 'Biometric verification failed.' };
  } catch (err: any) {
    console.error('Biometric verification error:', err);
    return {
      success: false,
      error: err?.message || 'Biometric scan was cancelled or timed out. You can use your Master PIN instead.',
    };
  }
}
