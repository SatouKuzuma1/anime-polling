/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    // domains: {},
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};
// module.exports = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "shikimori.one",
//         port: "",
//         pathname: "/account123/**",
//       },
//     ],
//   },
// };

export default config;