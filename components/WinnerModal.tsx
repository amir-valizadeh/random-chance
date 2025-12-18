"use client";

import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { Participant } from "@/types";
import { Trophy, Trash2, Copy, Check } from "lucide-react";
import { playWinSound } from "@/lib/sound";
import { useLanguage } from "@/contexts/LanguageContext";

interface WinnerModalProps {
  winner: Participant | null;
  onClose: () => void;
  onRemoveWinner: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  onClose,
  onRemoveWinner,
}) => {
  const { width, height } = useWindowSize();
  const { t, isRTL } = useLanguage();
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      playWinSound();
      setCopied(false);
    } else {
      setShowConfetti(false);
    }
  }, [winner]);

  const copyWinnerName = () => {
    if (winner) {
      navigator.clipboard.writeText(winner.fullName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {winner && (
        <>
          {showConfetti && (
            <ReactConfetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={500}
              colors={[
                winner.color,
                "#FFD700",
                "#FF6B6B",
                "#4ECDC4",
                "#9B59B6",
              ]}
            />
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              {/* Top color bar matching winner */}
              <div
                className="absolute top-0 left-0 w-full h-2"
                style={{ backgroundColor: winner.color }}
              />

              {/* Decorative circles */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                style={{ backgroundColor: winner.color }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-20"
                style={{ backgroundColor: winner.color }}
              />

              {/* Trophy with winner color */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                className="mx-auto w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mb-4 sm:mb-6 relative"
                style={{ backgroundColor: `${winner.color}20` }}>
                <div
                  className="absolute inset-2 rounded-full opacity-50"
                  style={{ backgroundColor: `${winner.color}30` }}
                />
                <Trophy
                  size={40}
                  className="sm:w-14 sm:h-14"
                  style={{ color: winner.color }}
                />
              </motion.div>

              {/* Winner label */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-600">
                🎉 {t.winner} 🎉
              </motion.h2>

              {/* Winner name with color indicator */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-lg ring-2 ring-white"
                    style={{ backgroundColor: winner.color }}
                  />
                  <span
                    className="text-4xl font-bold text-gray-800 dark:text-white break-words"
                    style={{
                      fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "inherit",
                    }}>
                    {winner.fullName}
                  </span>
                </div>

                {/* Copy button */}
                <button
                  onClick={copyWinnerName}
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      <span className="text-green-500">
                        {isRTL ? "کپی شد!" : "Copied!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>{isRTL ? "کپی نام" : "Copy name"}</span>
                    </>
                  )}
                </button>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    onRemoveWinner();
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-xl font-semibold transition-colors">
                  <Trash2 size={18} />
                  {t.removeWinner}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold transition-colors">
                  {t.close}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WinnerModal;
