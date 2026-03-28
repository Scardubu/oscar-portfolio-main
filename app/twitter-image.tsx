import { ImageResponse } from 'next/og';

import { OGImage } from '@/app/components/OGImage';

export const runtime = 'edge';

export const alt = 'Oscar Dubu - Production AI systems and full-stack execution';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(<OGImage />, {
    ...size,
  });
}
