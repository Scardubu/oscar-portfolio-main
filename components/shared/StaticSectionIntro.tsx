import type { ReactNode } from 'react';

import clsx from 'clsx';

interface StaticSectionIntroProps {
  eyebrowLabel: string;
  headingId?: string;
  title: ReactNode;
  description?: ReactNode;
  eyebrowNumber?: string;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function StaticSectionIntro({
  eyebrowLabel,
  headingId,
  title,
  description,
  eyebrowNumber,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: StaticSectionIntroProps) {
  return (
    <div className={clsx('section-intro-editorial', className)}>
      <div>
        <div className={clsx('section-kicker-row', eyebrowClassName)}>
          {eyebrowNumber ? (
            <span className="section-number" aria-hidden="true">
              {eyebrowNumber}
            </span>
          ) : null}
          <span className="section-label">{eyebrowLabel}</span>
        </div>

        <h1 id={headingId} className={titleClassName}>
          {title}
        </h1>
      </div>

      {description ? <p className={descriptionClassName}>{description}</p> : null}
    </div>
  );
}
