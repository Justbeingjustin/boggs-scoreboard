import CopyPlugin from 'copy-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {

    webpack5: true,

    webpack: function (config, { dev, isServer }) {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) config.resolve.fallback.fs = false

        // copy files you're interested in
        if (!dev) {
            config.plugins.push(
                new CopyPlugin({ patterns: [{ from: 'fonts', to: 'fonts' }] })
            )
        }

        return config
    }
};

export default nextConfig;