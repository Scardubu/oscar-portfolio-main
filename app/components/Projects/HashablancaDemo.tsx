"use client";

import { useState } from "react";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// PRD Card-004: Sample transaction data
const SAMPLE_TRANSACTION = {
  hash: "0x7a8f3b2c9d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
  from: "0x9b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
  to: "0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
  amount: "1,000 HASH",
  gasUsed: "0.0021 ETH",
  timestamp: "2024-11-20 14:32:15 UTC",
  chain: "Ethereum Mainnet",
};

// PRD Card-004: Multi-chain gas estimation
const GAS_ESTIMATES = [
  { chain: "Ethereum", gas: "0.0021 ETH", usd: "$4.20" },
  { chain: "Polygon", gas: "0.15 MATIC", usd: "$0.12" },
  { chain: "BSC", gas: "0.0008 BNB", usd: "$0.24" },
  { chain: "StarkNet", gas: "0.0003 ETH", usd: "$0.60" },
];

export function HashablancaDemo() {
  const [showDetails, setShowDetails] = useState(false);
  const [tokenAmount, setTokenAmount] = useState("1000");

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6"
    >
      {/* PRD Card-004: Privacy feature demonstration */}
      <div>
        <h4 className="mb-4 text-lg font-bold text-white">
          Zero-Knowledge Privacy Demo
        </h4>
        <div className="space-y-4 rounded-lg border border-white/5 bg-white/[0.02] p-5">
          {/* Transaction hash (always visible) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Transaction Hash:</span>
            <span className="font-mono text-xs text-accent-primary lg:text-sm">
              {SAMPLE_TRANSACTION.hash.slice(0, 20)}...
            </span>
          </div>

          {/* Privacy toggle section */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!showDetails ? (
                <motion.div
                  key="hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-accent-primary/30 bg-accent-primary/5 p-8 backdrop-blur-sm"
                >
                  <Lock className="h-12 w-12 text-accent-primary" />
                  <div className="text-center">
                    <p className="mb-2 font-semibold text-white">
                      Transaction Details Hidden
                    </p>
                    <p className="text-sm text-gray-400">
                      Protected via Zero-Knowledge Proofs (Circom)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 font-semibold text-black transition-all hover:bg-accent-primary/90"
                  >
                    <Eye className="h-4 w-4" />
                    Verify with Proof
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="visible"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 rounded-lg border border-green-500/30 bg-green-500/5 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-400">
                      <Unlock className="h-5 w-5" />
                      <span className="font-semibold">Proof Verified</span>
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      <EyeOff className="h-4 w-4" />
                      Hide
                    </button>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">From:</span>
                      <span className="font-mono text-white">
                        {SAMPLE_TRANSACTION.from.slice(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">To:</span>
                      <span className="font-mono text-white">
                        {SAMPLE_TRANSACTION.to.slice(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-mono font-semibold text-accent-primary">
                        {SAMPLE_TRANSACTION.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas Used:</span>
                      <span className="font-mono text-white">
                        {SAMPLE_TRANSACTION.gasUsed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chain:</span>
                      <span className="text-white">
                        {SAMPLE_TRANSACTION.chain}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-white">
                        {SAMPLE_TRANSACTION.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Privacy explanation */}
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-xs text-gray-400 lg:text-sm">
            <strong className="text-accent-primary">How ZK Proofs Work:</strong>{" "}
            Zero-knowledge proofs allow verification of transaction validity
            without revealing sensitive details (sender, recipient, amount).
            Hashablanca uses Circom circuits to generate proofs that can be
            verified on-chain while keeping data private.
          </div>
        </div>
      </div>

      {/* PRD Card-004: Gas estimation calculator */}
      <div>
        <h4 className="mb-4 text-lg font-bold text-white">
          Multi-Chain Gas Estimator
        </h4>
        <div className="space-y-4 rounded-lg border border-white/5 bg-white/[0.02] p-5">
          {/* Token amount input */}
          <div>
            <label
              htmlFor="token-amount"
              className="mb-2 block text-sm text-gray-400"
            >
              Token Amount to Distribute:
            </label>
            <input
              id="token-amount"
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-white placeholder-gray-500 transition-colors focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
              placeholder="Enter token amount"
            />
          </div>

          {/* Gas estimates table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-gray-400">
                <tr>
                  <th className="pb-3 pr-4">Chain</th>
                  <th className="pb-3 pr-4">Estimated Gas</th>
                  <th className="pb-3">USD Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {GAS_ESTIMATES.map((estimate, idx) => (
                  <tr key={idx} className="text-gray-300">
                    <td className="py-3 pr-4 font-medium text-white">
                      {estimate.chain}
                    </td>
                    <td className="py-3 pr-4 font-mono text-accent-primary">
                      {estimate.gas}
                    </td>
                    <td className="py-3 font-mono text-green-400">
                      {estimate.usd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommendation */}
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-xs text-green-400 lg:text-sm">
            <strong>Recommendation:</strong> For {tokenAmount} tokens, Polygon
            offers the lowest gas cost at $0.12. StarkNet provides a balance of
            cost ($0.60) and security for privacy-critical transactions.
          </div>
        </div>
      </div>

      {/* Multi-chain support badges */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-400">
          Supported Networks:
        </h4>
        <div className="flex flex-wrap gap-2">
          {["Ethereum", "Polygon", "BSC", "StarkNet"].map((chain) => (
            <span
              key={chain}
              className="rounded-full border border-accent-primary/30 bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary"
            >
              {chain}
            </span>
          ))}
        </div>
      </div>

      {/* Data disclaimer */}
      <p className="text-xs text-gray-500">
        * Demo uses illustrative data. Live platform supports real multi-chain
        transactions with actual ZK proof generation.
      </p>
    </motion.div>
  );
}
