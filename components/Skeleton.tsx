import type { CSSProperties } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}

export function Skeleton({ width = '100%', height = 16, style }: Readonly<SkeletonProps>) {
  return <div className="skeleton" aria-hidden="true" style={{ width, height, ...style }} />;
}
