import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'localhost', 
      '3.39.195.73', // 내 EC2 IP (혹시 몰라 추가)
      's3.ap-northeast-2.amazonaws.com', // AWS S3 기본 도메인
      // 만약 버킷 이름이 포함된 긴 도메인을 쓴다면 아래처럼 추가
      'codeit-final-project-security.s3.ap-northeast-2.amazonaws.com', 
    ],
    // 또는 최신 Next.js 버전이라면 remotePatterns 사용 권장 (더 안전함)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com', // 아마존 모든 주소 허용
      },
    ],
  },
  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
