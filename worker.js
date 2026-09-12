export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Explicit admin routes: serve the real admin page instead of SPA fallback.
    const response = (path === '/admin' || path === '/admin/' || path === '/admin.html')
      ? await env.ASSETS.fetch(new Request(new URL('/admin/index.html', request.url), request))
      : (path === '/admin/tyres' || path === '/admin/tyres/' || path === '/admin/tyres.html')
        ? await env.ASSETS.fetch(new Request(new URL('/admin/tyres.html', request.url), request))
        : await env.ASSETS.fetch(request);

    // Lightweight production security headers. No CSP is added because the app
    // intentionally loads Supabase from trusted CDNs and uses inline UI code.
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
