// @ts-check
import withPWAInit from "@ducanh2912/next-pwa";

// REF: https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started
export const withPWA = withPWAInit({
    dest: "public",
    scope: "/mobile/",
    sw: "/service-worker.js",
});

/**
 * @type {import("next").NextConfig}
 */
export const nextConfig = {
    output: "export",
    trailingSlash: true,
    typescript: {
        // REF: https://nextjs.org/docs/app/api-reference/next-config-js/typescript
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
// export default withPWA(nextConfig);
