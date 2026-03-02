
# Add Digital Credentials Epic to Ventures Page

## What Changes

Add **Epic 9 -- Digital Credentials** to the existing user journey on the Ventures page. This will be a concept-only addition that outlines how the Agentic Resume product would use verifiable digital credentials to let users prove their identity, address, education, and work history.

## Epic 9 Details

The new epic card will use the **Shield** or **Fingerprint** icon and include bullet points covering the four credential categories:

- **Identity Verification** -- Government-issued digital IDs (mobile Driver's License / mDL via ISO 18013-5, national eID)
- **Address Verification** -- Verifiable address credentials from utility providers or government registries
- **Educational Credentials** -- Digital diplomas and transcripts (W3C Verifiable Credentials from institutions like MIT Digital Credentials, Hyland Credentials, and others issuing Open Badges v3)
- **Work Credentials** -- Employment verification through employer-issued verifiable credentials (LinkedIn Verified, emerging W3C VC-based employment attestations)
- **Standards** -- Built on W3C Verifiable Credentials and OpenID for Verifiable Credentials (OID4VC); compatible with digital wallets (Apple Wallet, Google Wallet)

## Available Standards and Ecosystems (for reference)

| Credential Type | Available Standards / Providers |
|---|---|
| Identity | mDL (ISO 18013-5), eIDAS 2.0 (EU), Microsoft Entra Verified ID |
| Address | Government registries, utility-issued VCs (emerging) |
| Education | Open Badges v3, CLR (Comprehensive Learner Record), MIT Digital Credentials, Hyland |
| Work History | LinkedIn Verified, employer-issued W3C VCs, CLEAR, Truework (API-based, not yet VC) |

## Technical Changes

**File: `src/pages/Ventures.tsx`**
- Add a 9th entry to the `epics` array with title "Digital Credentials", a `Fingerprint` icon (from lucide-react), and the bullet points above
- No new components, database changes, or dependencies required -- purely a UI content addition to the existing epic list and accordion
