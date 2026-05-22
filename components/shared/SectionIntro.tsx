'use client';

import { m, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

import clsx from 'clsx';

interface SectionIntroProps {
  eyebrowNumber?: string;
  eyebrowLabel: string;
  headingId: string;
  title: ReactNode;
  description?: ReactNode;
  eyebrowVariant?: Variants;
  titleVariant?: Variants;
  descriptionVariant?: Variants;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionWrapperClassName?: string;
  descriptionClassName?: string;
}

export function SectionIntro({
  eyebrowNumber,
  eyebrowLabel,
  headingId,
  title,
  description,
  eyebrowVariant,
  titleVariant,
  descriptionVariant,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionWrapperClassName,
  descriptionClassName,
}: SectionIntroProps) {
  return (
    <div className={clsx('section-intro-editorial', className)}>
      <div>
        <m.div
          variants={eyebrowVariant}
          data-cinematic="eyebrow"
          className={clsx('section-kicker-row', eyebrowClassName)}
        >
          {eyebrowNumber ? (
            <span className="section-number" aria-hidden="true">
              {eyebrowNumber}
            </span>
          ) : null}
          <span className="section-label">{eyebrowLabel}</span>
        </m.div>

        <m.h2
          variants={titleVariant}
          id={headingId}
          data-cinematic="title"
          className={titleClassName}
        >
          {title}
        </m.h2>
      </div>

      {description ? (
        <div className={clsx('lg:flex lg:flex-col lg:justify-end', descriptionWrapperClassName)}>
          <m.p variants={descriptionVariant} data-cinematic="lede" className={descriptionClassName}>
            {description}
          </m.p>
        </div>
      ) : null}
    </div>
  );
}
