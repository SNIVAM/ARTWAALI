# Implementation Plan - Hardened Boss Mode with Biometric & Secret Master PIN

## Security Threat Model

### Component Overview
ArtWaali is a handcrafted resin art storefront featuring a privileged "Boss Mode" administrative control center for the store owner. The application runs as a secure, modern React single-page application.

### Entry Points and Untrusted Inputs
| Entry Point | Type | Trusted? | Validation |
|---|---|---|---|
| Master PIN Challenge | UI Modal Input | Untrusted | Sanitized, fixed length/character checks, hashed with salt before comparison |
| Biometric Authenticator | WebAuthn API (`navigator.credentials.get`) | System Trusted | Validated against stored credential ID and user verification |
| Contact / Enquiry Form | Form Inputs | Untrusted | Strict text sanitization, React safe text rendering |
| Product / Price Editor | Admin Inputs | Trusted (post-auth) | Type verification (number parsing, length limits) |

### Trust Boundaries and Auth Assumptions
- **Authentication**: Dual-factor capable authorization using WebAuthn Biometric passkey (Touch ID / Face ID / Windows Hello) or Salted SHA-256 Master PIN.
- **Authorization**: Boss Mode features (Orders viewer, Price editor, Content live-editor, Settings) are strictly locked and unrendered until cryptographic authentication succeeds.
- **Stealth & Obfuscation**: The Boss Mode trigger is completely invisible by default. Only the owner knows the secret master gesture (triple-click logo or `Ctrl+Shift+B`) to summon the authentication prompt.
- **Zero Plaintext Secrets**: No hardcoded passwords in client bundles or plain localStorage.

### Sensitive Data Paths
| Data Type | Source | Destination | Protection |
|---|---|---|---|
| Master PIN Hash | Setup / Memory | Local Storage (Salted Hash only) | Cryptographic SHA-256 with unique salt, never plaintext |
| Biometric Credentials | WebAuthn Platform Authenticator | Browser Secure Storage | Managed securely by browser/OS hardware security module (Secure Enclave / TPM) |
| Customer Enquiries | Contact Form | Session State | In-memory session store, safe CSV export |

### Privileged Actions
| Action | Location | Guard |
|---|---|---|
| Unlock Boss Mode | `src/components/BossMode.tsx` | WebAuthn verification OR Salted SHA-256 PIN match with rate limiter |
| View Customer Orders | `src/components/BossMode.tsx` | Authenticated session state |
| Modify Product Prices | `src/components/BossMode.tsx` | Authenticated session state |
| Edit Site Content | `src/components/BossMode.tsx` | Authenticated session state |

### Priority Review Areas
1. **Zero Secret Exposure**: Ensure no plaintext passwords or PINs are present in code, logs, or stored attributes.
2. **Brute Force Defense**: Enforce rate-limiting and temporary lockouts after failed PIN attempts.
3. **Biometric Integration Reliability**: Support WebAuthn with graceful fallback to Master PIN when biometrics is unavailable or not yet registered.

## Verification Plan

### Security Verification
- **Security Scan**: Inspect all newly created and modified files for common CWE vulnerabilities (XSS, injection, exposed secrets, missing auth boundaries). Resolve any detected issues immediately.
- **Security Audit**: Audit the implementation against the component's threat model (`## Security Threat Model`). Document all findings, dispositions, and remediations in `walkthrough.md` using the `generate-security-audit-report` skill.
