# Petsonality v2

A Vite + React starter for the Petsonality app.

## Included
- Public roles: Pet Owner, Breeder, Vendor, Association/Organization, Pet Transport/Shipping Service
- Hidden admin login; admin is not selectable during registration
- Paid assessment gate: questions remain hidden until payment/unlock
- Stripe placeholder links for cat test and $5 annual breeder listing
- Cat personality assessment with body-language/expression observations
- Owner-to-cat matching
- Cat-to-cat compatibility
- Breeder directory registration with TICA/CFA requirement
- No broker/wholesaler/marketing-agent policy
- Document and social planner placeholders
- Admin-editable result templates stored in browser localStorage

## Important before launch
This starter uses browser localStorage and placeholder payment links. Before accepting real users, connect:
- Stripe Checkout / Payment Links
- Supabase, Firebase, or another database
- Proper authentication provider
- Secure file storage for uploaded documents/photos

## Run locally
npm install
npm run dev

## Deploy
Upload to GitHub and connect the repo to Vercel.
