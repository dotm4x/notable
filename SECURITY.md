# Security Policy

Notable takes the security of its packages, applications, and consumers seriously. This policy outlines how security vulnerabilities are handled and how to responsibly disclose them.

---

## Supported Versions

Security updates and patches are only provided for releases designated as **stable** (the latest stable release). Pre-releases, experimental builds, release candidates, and deprecated versions are not supported.

If you discover a vulnerability in an older or unsupported build that also applies to the current stable release, please report it following the process below.

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**

If you believe you have found a security vulnerability in Notable, report it privately using one of the following methods:

1. **GitHub Private Vulnerability Reporting (Recommended):**  
   Navigate to the [Security Advisories tab](https://github.com/dotm4x/notable/security/advisories) of the repository and click **"Report a vulnerability"**.

2. **Direct Contact:**  
   If GitHub private reporting is unavailable, email the maintainer at [`max@stonebogus.com`](mailto:max@stonebogus.com) with the subject line prefixed by `[Security]`.

### What to Include in Your Report

To help assess and address the issue quickly, please include as much of the following details as possible:

- **Area / Component:** The specific component, package, or area affected.
- **Description:** A detailed explanation of the vulnerability and its potential impact.
- **Steps to Reproduce:** Clear, step-by-step instructions or a minimal proof-of-concept (PoC).
- **Impact Assessment:** The type of threat (e.g., Cross-Site Scripting, prototype pollution, denial of service) and potential attack scenarios.
- **Proposed Fix:** Any suggested remediation or patch, if available.

---

## Response Process

When a security vulnerability is reported:

1. **Acknowledgment:** Maintainers will acknowledge receipt of the report within 48 hours.
2. **Investigation & Validation:** The report will be reviewed to verify the vulnerability and determine its severity and blast radius.
3. **Private Remediation:** A fix will be developed and verified privately (via GitHub Security Advisories or private patch validation).
4. **Release & Advisory:** A patch release will be published alongside a GitHub Security Advisory detailing the issue, severity, mitigation, and credit to the reporter (unless anonymity is requested).

---

## Security Best Practices

Notable adheres to strict dependency and code hygiene principles:

- **Minimal Dependencies:** Keeping third-party runtime dependencies to a minimum to reduce supply-chain attack surfaces.
- **Automated Verification:** Continuous security and dependency policy checks in CI.
- **Defensive Design:** Components avoid unsafe DOM operations and encourage safe, accessible defaults.
