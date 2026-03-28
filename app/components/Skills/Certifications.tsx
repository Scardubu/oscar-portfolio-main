"use client";

import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { CERTIFICATIONS } from "@/app/lib/constants";

export function Certifications() {
  return (
    <div className="mx-auto mt-16 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <h3 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
          Certifications & Training
        </h3>
        <p className="text-gray-400">
          Continuous learning through industry-recognized programs
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert, index) => (
          <motion.a
            key={cert.id}
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6 transition-all hover:border-accent-primary/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.15)]"
          >
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary/10">
              <Award className="h-6 w-6 text-accent-primary" />
            </div>

            {/* Title */}
            <h4 className="mb-2 text-lg font-bold text-white group-hover:text-accent-primary">
              {cert.title}
            </h4>

            {/* Issuer & Date */}
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
              <span>{cert.issuer}</span>
              <span>•</span>
              <span>{cert.date}</span>
            </div>

            {/* Description */}
            {cert.description && (
              <p className="mb-4 text-sm leading-relaxed text-gray-300">
                {cert.description}
              </p>
            )}

            {/* External link indicator */}
            <div className="flex items-center gap-2 text-sm font-semibold text-accent-primary">
              <span>View Credential</span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
