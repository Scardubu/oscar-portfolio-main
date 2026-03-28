"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
} from "chart.js";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// PRD Card-002: Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// PRD Card-002: Sample predictions data (static fallback)
const SAMPLE_PREDICTIONS = [
  {
    match: "Man City vs Arsenal",
    prediction: "Man City Win",
    confidence: "78.3%",
    actual: "Man City Win",
    correct: true,
  },
  {
    match: "Liverpool vs Chelsea",
    prediction: "Draw",
    confidence: "71.2%",
    actual: "Draw",
    correct: true,
  },
  {
    match: "Barcelona vs Real Madrid",
    prediction: "Barcelona Win",
    confidence: "65.8%",
    actual: "Draw",
    correct: false,
  },
  {
    match: "Bayern vs Dortmund",
    prediction: "Bayern Win",
    confidence: "82.1%",
    actual: "Bayern Win",
    correct: true,
  },
  {
    match: "PSG vs Marseille",
    prediction: "PSG Win",
    confidence: "89.4%",
    actual: "PSG Win",
    correct: true,
  },
];

// PRD Card-002: Accuracy over time data (illustrative monthly data)
const ACCURACY_DATA = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  datasets: [
    {
      label: "Prediction Accuracy (%)",
      data: [68.5, 70.2, 71.8, 72.5, 73.1, 73.7, 74.2, 73.9, 73.5, 73.8, 74.1],
      borderColor: "#00D9FF",
      backgroundColor: "rgba(0, 217, 255, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "#00D9FF",
      pointBorderColor: "#FFFFFF",
      pointBorderWidth: 2,
    },
  ],
};

export function SabiScoreDemo() {
  const [showAccordion, setShowAccordion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration issues with Chart.js
  useEffect(() => {
    setMounted(true);
  }, []);

  // PRD Card-002: Chart.js options with dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#FFFFFF",
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(10, 10, 10, 0.9)",
        titleColor: "#00D9FF",
        bodyColor: "#FFFFFF",
        borderColor: "#00D9FF",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            const value = tooltipItem.parsed.y;
            return value !== null ? `Accuracy: ${value}%` : "N/A";
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            family: "Inter, sans-serif",
            size: 11,
          },
        },
      },
      y: {
        min: 65,
        max: 80,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            family: "Inter, sans-serif",
            size: 11,
          },
          callback: function (value: string | number) {
            return value + "%";
          },
        },
      },
    },
  };

  if (!mounted) {
    return (
      <div className="mt-4 flex h-96 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <div className="text-gray-400">Loading demo...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6"
    >
      {/* PRD Card-002: Chart.js visualization */}
      <div>
        <h4 className="mb-4 text-lg font-bold text-white">
          Prediction Accuracy Over Time
        </h4>
        <div className="h-64 w-full lg:h-80">
          <Line data={ACCURACY_DATA} options={chartOptions} />
        </div>
      </div>

      {/* PRD Card-002: Sample predictions table */}
      <div>
        <h4 className="mb-4 text-lg font-bold text-white">
          Recent Predictions (Sample)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase text-gray-400">
              <tr>
                <th className="pb-3 pr-4">Match</th>
                <th className="pb-3 pr-4">Prediction</th>
                <th className="pb-3 pr-4">Confidence</th>
                <th className="pb-3 pr-4">Actual</th>
                <th className="pb-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SAMPLE_PREDICTIONS.map((pred, idx) => (
                <tr key={idx} className="text-gray-300">
                  <td className="py-3 pr-4 font-medium text-white">
                    {pred.match}
                  </td>
                  <td className="py-3 pr-4">{pred.prediction}</td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-accent-primary">
                      {pred.confidence}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{pred.actual}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        pred.correct
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {pred.correct ? "✓ Correct" : "✗ Wrong"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRD Card-002: "How It Works" accordion */}
      <div>
        <button
          onClick={() => setShowAccordion(!showAccordion)}
          className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-left font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/5"
        >
          <span>How It Works: Ensemble Methodology</span>
          {showAccordion ? (
            <ChevronUp className="h-5 w-5 text-accent-primary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-accent-primary" />
          )}
        </button>

        <AnimatePresence>
          {showAccordion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-3 rounded-lg border border-white/5 bg-white/[0.02] p-4 text-sm text-gray-300"
            >
              <div>
                <strong className="text-accent-primary">
                  Model Architecture:
                </strong>{" "}
                Ensemble combining XGBoost (40%), LightGBM (35%), and Random
                Forest (25%) with weighted voting based on confidence scores.
              </div>
              <div>
                <strong className="text-accent-primary">
                  Feature Engineering:
                </strong>{" "}
                220+ features including:
                <ul className="ml-5 mt-2 list-disc space-y-1">
                  <li>Rolling statistics (form, goals, xG, shots)</li>
                  <li>Head-to-head history (last 5 meetings)</li>
                  <li>Team strength ratings (ELO-based)</li>
                  <li>Contextual factors (home advantage, rest days, injuries)</li>
                  <li>Market sentiment (odds movement, betting volume)</li>
                </ul>
              </div>
              <div>
                <strong className="text-accent-primary">
                  Training Process:
                </strong>{" "}
                Models trained on 10,000+ historical matches with 5-fold
                cross-validation. Hyperparameter tuning via Optuna with 500+
                trials. Weekly retraining with new data.
              </div>
              <div>
                <strong className="text-accent-primary">
                  Confidence Scoring:
                </strong>{" "}
                High-confidence predictions (&gt;70%) achieve 84.9% accuracy.
                Low-confidence predictions flagged for manual review.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data disclaimer */}
      <p className="text-xs text-gray-500">
        * Demo uses sample data for illustration. Live platform serves real-time
        predictions via API.
      </p>
    </motion.div>
  );
}
