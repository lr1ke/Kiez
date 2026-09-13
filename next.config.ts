import type { NextConfig } from 'next';
const config: NextConfig = { serverExternalPackages: ['@electric-sql/pglite', 'pg'], output: 'standalone', outputFileTracingIncludes: { '/*': ['./migrations/*.sql'] } };
export default config;
