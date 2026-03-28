"use client";

import { useState } from "react";
import { Sparkles, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// PRD Card-006: Mock ML failure scenario
const ML_SCENARIO = {
  problem: "Model accuracy dropped from 85% to 72%",
  technical:
    "Training loss converged normally (0.23), but validation loss increased to 0.58. Feature importance analysis shows top 3 features (user_age, session_duration, click_rate) account for 78% of predictions. Cross-validation scores: [0.71, 0.73, 0.69, 0.74, 0.72]. Precision: 0.68, Recall: 0.76, F1: 0.72.",
  plainLanguage:
    "Your model is memorizing the training data instead of learning patterns (overfitting). It's like a student who memorizes answers but can't solve new problems. The model relies too heavily on 3 features, ignoring other valuable signals. This happened because recent data has different patterns than historical data (concept drift).",
  recommendations: [
    "Add regularization (L2 penalty=0.01) to prevent overfitting",
    "Expand feature set: include 5-10 more diverse features",
    "Retrain with last 6 months of data to capture recent patterns",
    "Implement ensemble with 3 models to reduce single-model bias",
  ],
};

export function AIConsultingDemo() {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAskAI = () => {
    setIsGenerating(true);
    // Simulate LLM generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowExplanation(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6"
    >
      {/* PRD Card-006: Mock ML failure scenario */}
      <div>
        <h4 className="mb-4 text-lg font-bold text-white">
          ML Debugging Assistant Demo
        </h4>
        <div className="space-y-4 rounded-lg border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
              <span className="text-lg">⚠️</span>
            </div>
            <div>
              <h5 className="mb-2 font-semibold text-red-400">
                Production Issue Detected
              </h5>
              <p className="text-sm text-gray-300">{ML_SCENARIO.problem}</p>
            </div>
          </div>

          {/* Technical details (before AI explanation) */}
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <h6 className="mb-2 text-sm font-semibold text-gray-400">
              Technical Diagnostics:
            </h6>
            <p className="font-mono text-xs leading-relaxed text-gray-400 lg:text-sm">
              {ML_SCENARIO.technical}
            </p>
          </div>

          {/* Ask AI button */}
          {!showExplanation && (
            <button
              onClick={handleAskAI}
              disabled={isGenerating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-3 font-semibold text-black transition-all hover:bg-accent-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Ask AI Assistant to Explain
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* PRD Card-006: Plain-language explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Plain language explanation */}
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-5">
              <div className="mb-3 flex items-center gap-2 text-green-400">
                <MessageSquare className="h-5 w-5" />
                <h5 className="font-semibold">AI Explanation (Plain Language)</h5>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-300 lg:text-base">
                {ML_SCENARIO.plainLanguage}
              </p>

              <div className="space-y-2">
                <h6 className="text-sm font-semibold text-white">
                  Recommended Actions:
                </h6>
                <ul className="space-y-2">
                  {ML_SCENARIO.recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <span className="mt-1 text-accent-primary">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Before/After comparison */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <h6 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
                  <span>❌</span> Before (Technical Jargon)
                </h6>
                <p className="text-xs leading-relaxed text-gray-400">
                  &quot;High variance detected. Train/val loss divergence indicates
                  overfitting. Feature correlation matrix shows multicollinearity
                  (VIF &gt; 5). Implement dropout layers or L1/L2 regularization.&quot;
                </p>
              </div>
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <h6 className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-400">
                  <span>✓</span> After (Business Language)
                </h6>
                <p className="text-xs leading-relaxed text-gray-300">
                  &quot;The model is too focused on training examples and struggles
                  with new data. We&apos;ll add constraints to make it generalize
                  better and reduce reliance on redundant features.&quot;
                </p>
              </div>
            </div>

            {/* Impact metrics */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <h6 className="mb-3 text-sm font-semibold text-white">
                Consulting Impact:
              </h6>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="mb-1 font-mono text-2xl font-bold text-accent-primary">
                    60%
                  </div>
                  <div className="text-xs text-gray-400">
                    Time Reduction
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    10hr → 4hr debugging
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-2xl font-bold text-accent-primary">
                    5+
                  </div>
                  <div className="text-xs text-gray-400">
                    Clients Served
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Startups & enterprises
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-2xl font-bold text-accent-primary">
                    100%
                  </div>
                  <div className="text-xs text-gray-400">
                    Stakeholder Clarity
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Technical → business
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data disclaimer */}
      <p className="text-xs text-gray-500">
        * Demo uses pre-generated responses. Live consulting provides custom
        analysis via GPT-4 and Ollama.
      </p>
    </motion.div>
  );
}
