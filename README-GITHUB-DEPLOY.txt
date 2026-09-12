GITHUB + CLOUDFLARE DEPLOYMENT

This project is prepared for Cloudflare Workers Builds.

IMPORTANT:
- Worker name in wrangler.jsonc is lively-limit-c354.
- Connect the GitHub repository to the EXISTING Worker named lively-limit-c354.
- Do not use the Cloudflare static-file uploader.
- The project must be deployed as a Worker so worker.js handles /admin/tyres.html.

Cloudflare dashboard:
Workers & Pages -> lively-limit-c354 -> Settings -> Builds -> Connect
Choose this GitHub repository, root directory '/', then save/deploy.

After deployment, /admin/tyres.html is explicitly routed to public/admin/tyres.html.
