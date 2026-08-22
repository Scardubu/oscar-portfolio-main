import { ImageResponse } from 'next/og';

import { OGImage } from '@/components/OGImage';

export const runtime = 'edge';

export const alt =
  'Oscar Ndugbu (Scardubu) — Staff Backend and Platform Engineer · AI infrastructure systems';
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
