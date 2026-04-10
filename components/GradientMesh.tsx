'use client';

import { motion, useReducedMotion, useScroll, useTime, useTransform } from 'framer-motion';

export function GradientMesh() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const time = useTime();

  const indigoY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '15%']
  );
  const greenY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '-10%']
  );
  const amberY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '-6%']
  );

  // [v15 ELEVATION-3] Orbital micro-rotation — reduced-motion: static
  const indigoRot = useTransform(time, (t) => (reducedMotion ? 0 : (t / 25000) * 360));
  const greenRot  = useTransform(time, (t) => (reducedMotion ? 0 : -(t / 35000) * 360));
  const amberRot  = useTransform(time, (t) => (reducedMotion ? 0 : (t / 45000) * 360));

  return (
    <div aria-hidden="true" className="gradient-mesh">
      <div className="gradient-mesh-wrap gradient-mesh-wrap--indigo">
        <motion.div
          className="gradient-mesh-orb gradient-mesh-orb--indigo"
          style={{ y: indigoY, rotate: indigoRot, willChange: 'transform' }}
        />
      </div>
      <div className="gradient-mesh-wrap gradient-mesh-wrap--green">
        <motion.div
          className="gradient-mesh-orb gradient-mesh-orb--green"
          style={{ y: greenY, rotate: greenRot, willChange: 'transform' }}
        />
      </div>
      <div className="gradient-mesh-wrap gradient-mesh-wrap--amber">
        <motion.div
          className="gradient-mesh-orb gradient-mesh-orb--amber"
          style={{ y: amberY, rotate: amberRot, willChange: 'transform' }}
        />
      </div>
    </div>
  );
}
