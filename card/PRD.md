# Product Requirements Document: Digital Loyalty Card
 
**Version:** 1.0
**Status:** Draft
**Date:** October 19, 2026
 
---
 
## 1. Overview
 
A free, web-based digital loyalty card for a small business. Customers scan one shared QR code at the counter, log in with email and password, and receive a stamp. After a set number of stamps they earn a reward.
 
## 2. Goals
 
- Increase repeat visits and customer retention.
- Replace paper stamp cards with a free digital solution.
- Launch with zero software cost (free-tier services only).
- Keep the customer flow under 15 seconds per visit.
### Non-Goals (v1)
- Native iOS/Android apps
- Payment processing or POS integration
- Points-per-dollar systems
- Multi-location support
## 3. Target Users
 
| User | Description | Needs |
|---|---|---|
| Customer | Walk-in shopper with a smartphone | Quick login, see stamp progress, know when reward is ready |
| Staff | Cashier or counter employee | Simple way to confirm stamps and redeem rewards |
| Owner/Admin | Business owner | See sign-ups, stamps, and redemptions; adjust rules |
 
## 4. User Flow
 
1. Customer scans the common QR code at the counter.
2. QR opens the loyalty web app URL.
3. Customer signs up or logs in with email and password.
4. App checks eligibility (cooldown, valid token) and adds one stamp.
5. Customer sees the updated stamp card.
6. At the target stamp count, the card shows "Reward ready."
7. Staff verify the card and mark the reward redeemed; stamps reset.
## 5. Functional Requirements
 
### 5.1 Authentication
- **FR-1:** Users can register with email and password.
- **FR-2:** Users can log in and log out.
- **FR-3:** Password reset via email.
- **FR-4:** Sessions persist so returning customers stay logged in.
### 5.2 Stamping
- **FR-5:** Scanning the QR code adds one stamp to the logged-in account.
- **FR-6:** Cooldown: one stamp per account every 4 hours (configurable).
- **FR-7:** The QR contains a token that rotates daily, so old photos stop working.
- **FR-8:** A "Stamp added" confirmation screen is shown so staff can verify it.
### 5.3 Loyalty Card
- **FR-9:** Display a stamp grid showing progress (e.g., 4 of 10).
- **FR-10:** Show "Reward ready" when the target is reached (default: 10).
- **FR-11:** Show stamp history with dates.
### 5.4 Redemption
- **FR-12:** Staff redeem a reward by entering a PIN or confirming on the customer's screen.
- **FR-13:** After redemption, stamps reset to zero and the redemption is logged.
### 5.5 Admin
- **FR-14:** Admin can set the stamp target, cooldown, and reward text.
- **FR-15:** Admin can view total customers, stamps issued, and rewards redeemed.
- **FR-16:** Admin can generate or rotate the daily QR token.
## 6. Non-Functional Requirements
 
- **Performance:** Page loads in under 3 seconds on 4G.
- **Compatibility:** Works on current iOS Safari and Android Chrome.
- **Availability:** Relies on free-tier hosting uptime.
- **Accessibility:** Readable text, sufficient contrast, tap targets at least 44px.
- **Installable:** PWA support so customers can add it to the home screen.
## 7. Security and Privacy
 
- Passwords handled only by Firebase Authentication (never stored in app code).
- Firestore security rules: users can read their own record only; stamps are written through validated logic.
- HTTPS enforced.
- Privacy notice at sign-up explaining what data is collected and why.
- Separate opt-in checkbox for marketing emails.
- Users can request deletion of their account and data.
- Compliance with applicable laws (e.g., GDPR, CCPA) depending on location.
## 8. Fraud Prevention
 
| Risk | Mitigation |
|---|---|
| Scanning repeatedly | 4-hour cooldown per account |
| Scanning from home | Daily rotating token; optional staff PIN |
| Fake accounts | Email verification |
| Staff misuse | Redemption log with timestamps |
 
## 9. Technical Approach
 
- **Front end:** HTML, CSS, JavaScript (PWA)
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Hosting:** Firebase Hosting or Netlify (free tier)
- **QR generation:** Free generator (e.g., QRCode Monkey) pointing to the app URL with token
### Data Model (Firestore)
 
```
users/{uid}
  email, createdAt, stampCount, lastStampAt, marketingOptIn
 
stamps/{stampId}
  uid, createdAt, tokenUsed
 
redemptions/{redemptionId}
  uid, redeemedAt, confirmedBy
 
config/settings
  stampTarget, cooldownHours, rewardText, currentToken
```
 
## 10. Success Metrics
 
- Sign-ups in the first 30 days
- Percentage of customers with 2 or more stamps (repeat rate)
- Rewards redeemed per month
- Average time between visits (before vs. after launch)
- Fraud rate (stamps rejected by cooldown or invalid token)
## 11. Milestones
 
| Phase | Deliverable | Estimate |
|---|---|---|
| 1. Plan | Reward rules, data decisions, final PRD | 2 days |
| 2. Design | Card layout, screens, branding | 3 days |
| 3. Build | Auth, stamping, card UI, admin page | 1 to 2 weeks |
| 4. Test | iOS and Android, edge cases, staff trial | 3 to 5 days |
| 5. Deploy | Hosting, counter QR, privacy notice, staff training | 2 days |
| 6. Review | Check metrics, adjust reward and cooldown | After 30 days |
 
## 12. Risks and Assumptions
 
**Assumptions**
- Customers have smartphones with a camera and internet access.
- Free-tier limits are enough for the expected customer volume.
**Risks**
- Customers dislike creating accounts, which lowers sign-ups. *Mitigation: keep sign-up to two fields and offer a clear incentive.*
- Shared QR code is shared online. *Mitigation: rotating token and cooldown.*
- Free-tier limits exceeded. *Mitigation: monitor usage and upgrade if needed.*
## 13. Open Questions
 
- What is the exact reward (free item, discount)?
- Should rewards expire?
- Is a staff PIN required on every stamp, or only on redemption?
- Which countries' privacy laws apply?
## 14. Future Enhancements
 
- Apple Wallet and Google Wallet passes
- Push notifications or email campaigns
- Tiered rewards and referral bonuses
- POS integration and multi-location support
 