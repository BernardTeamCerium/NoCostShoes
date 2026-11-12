# No Cost Shoes — Website Redesign

Modern redesign of [NoCostShoes.com](https://www.nocostshoes.com), the diabetic-footwear
brand of Quantum Medical Supply (Medicare-approved supplier, West Palm Beach, FL).

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Homepage — hero, insurance strip, 4-step process, footwear categories, FAQs, CTA |
| `qualify.html` | Redirect target for old apply links — sends visitors to the secure patient portal |
| `how-it-works.html` | The process in detail + what Medicare covers each year |
| `patients.html` | Why diabetic shoes matter, the fitting, daily foot-care habits |
| `providers.html` | Referral process and partnership info for physicians/podiatrists |
| `resources.html` | Medicare Coverage Guide, Therapeutic Shoe Bill, full FAQ |
| `about.html` | Company story and values |
| `contact.html` | Contact details, hours, and message form |

## Stack

Pure static HTML/CSS/JS — no build step, no dependencies. Deploy the repo root to any
static host (Netlify, Vercel, S3/CloudFront, GitHub Pages, cPanel, etc.).

- `css/styles.css` — design system (colors, typography, components) shared by all pages
- `js/main.js` — mobile nav, active-link highlighting, scroll-reveal, form handling

## Notes

- **Forms**: eligibility applications go to the secure patient portal (no on-site form —
  it would collect health information). The Contact and Careers forms compose a pre-filled
  email in the visitor's mail app (`data-mailto-form` in `js/main.js`); swap in a real
  endpoint (Formspree, Zapier webhook, CRM) by replacing that handler when one exists.
- **Redirects**: `web.config` (IIS URL Rewrite) 301-redirects every known old address to
  the matching new page and serves extensionless URLs. Deploy it to the site root.
- **Fonts**: system font stack — no font CDNs.

## Local preview

```sh
python3 -m http.server 8080
# open http://localhost:8080
```
