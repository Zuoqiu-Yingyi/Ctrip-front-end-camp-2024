// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    output: "export",
    typescript: {
        // REF: https://nextjs.org/docs/app/api-reference/next-config-js/typescript
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
