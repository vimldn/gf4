# Can I Eat That? — Vercel edition

Next.js app with server API routes for product search, barcode lookup, UK shops and recorded prices. Includes the logo and larger, darker typography.

## Deploy
Replace the old repository contents with the contents of this folder (keep your .git folder). package.json must be at the repository root. Commit and push.

In Vercel choose Next.js, Build Command `npm run build`, and leave Output Directory at its framework default (remove any `out` or `dist` override). No environment variables or database are required.

This edition does not use static export, the Cloudflare worker build script, or .openai/hosting.json. The four /api endpoints run as Next.js server functions.

## Local development
`npm ci` then `npm run dev`.
Production: `npm run build` then `npm start`.
Tests: `npm test`.

## Data limits
Open Food Facts supplies community product records. Gluten-free labels are evidence, not a guarantee; check the current pack. Shop endpoints are queried on demand and can be unavailable independently. Sainsbury's may block hosting providers. Open Prices observations are dated, not live checkout quotes. No invented prices or gluten-free approvals. Saved products stay in the browser.
