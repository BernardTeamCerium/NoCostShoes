# No Cost Shoes — Website Redesign

Modern redesign of [NoCostShoes.com](https://www.nocostshoes.com), the diabetic-footwear
brand of Quantum Medical Supply (Medicare-approved supplier, West Palm Beach, FL).

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Homepage — hero, insurance strip, 4-step process, footwear categories, FAQs, CTA |
| `qualify.html` | "Do I Qualify?" eligibility application form |
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

- **Forms**: the eligibility and contact forms currently validate client-side and show a
  confirmation message (`data-demo-form` in `js/main.js`). Point them at a real endpoint
  (form service, CRM webhook, or backend) before launch.
- **Fonts**: Sora + Inter via Google Fonts.
- **Imagery**: inline SVG illustrations — swap for brand photography anytime by replacing
  the `<svg>` blocks; no other changes needed.

## Local preview

```sh
python3 -m http.server 8080
# open http://localhost:8080
```
