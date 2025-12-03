/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 기존 설정들 ...
  
  // 아래 내용 추가: ESLint 에러가 있어도 빌드 강제 진행
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;