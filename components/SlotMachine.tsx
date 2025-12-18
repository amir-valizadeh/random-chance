"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, useAnimation } from "framer-motion";
import { Participant } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface SlotMachineProps {
  participants: Participant[];
  onSpinEnd: (winner: Participant) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 72;
const SPIN_DURATION = 4000;

const SlotMachine: React.FC<SlotMachineProps> = ({
  participants,
  onSpinEnd,
  isSpinning,
  setIsSpinning,
}) => {
  const { isRTL } = useLanguage();
  const controls = useAnimation();
  const [winner, setWinner] = useState<Participant | null>(null);
  const [displayItems, setDisplayItems] = useState<Participant[]>([]);

  // Shuffle and extend list for smooth scrolling
  const extendedList = useMemo(() => {
    if (participants.length === 0) return [];

    // Shuffle function
    const shuffle = (arr: Participant[]) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Create extended shuffled list
    const repeats = Math.max(30, Math.ceil(150 / participants.length));
    let extended: Participant[] = [];
    for (let i = 0; i < repeats; i++) {
      extended = [...extended, ...shuffle(participants)];
    }
    return extended;
  }, [participants]);

  useEffect(() => {
    setDisplayItems(extendedList);
  }, [extendedList]);

  // Calculate winner when spinning starts
  useEffect(() => {
    if (isSpinning && participants.length > 0) {
      // Calculate winner - equal probability for all
      const randomIndex = Math.floor(Math.random() * participants.length);
      const selectedWinner = participants[randomIndex];

      setWinner(selectedWinner);

      if (selectedWinner && extendedList.length > 0) {
        // Find the winner index near the middle of the extended list
        const midPoint = Math.floor(extendedList.length / 2);
        const winnerIdx = extendedList.findIndex(
          (p, i) => i >= midPoint && p.id === selectedWinner!.id
        );
        const targetIdx = winnerIdx >= 0 ? winnerIdx : midPoint;

        // Calculate scroll distance
        const targetOffset =
          -(targetIdx - Math.floor(VISIBLE_ITEMS / 2)) * ITEM_HEIGHT;

        controls.set({ y: 0 });

        controls
          .start({
            y: targetOffset,
            transition: {
              duration: SPIN_DURATION / 1000,
              ease: [0.1, 0.3, 0.2, 1],
            },
          })
          .then(() => {
            setTimeout(() => {
              setIsSpinning(false);
              onSpinEnd(selectedWinner!);
            }, 300);
          });
      }
    }
  }, [
    isSpinning,
    participants,
    extendedList,
    controls,
    setIsSpinning,
    onSpinEnd,
  ]);

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Machine Frame */}
      <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border-4 border-gray-600">
        {/* Top decoration - lights */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  isSpinning ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: [
                    "#FF6B6B",
                    "#FFE66D",
                    "#4ECDC4",
                    "#9B59B6",
                    "#FF6B6B",
                    "#9B59B6",
                    "#4ECDC4",
                    "#FFE66D",
                    "#FF6B6B",
                  ][i],
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Single Slot Column */}
        <div
          className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-gray-600"
          style={{
            height: VISIBLE_ITEMS * ITEM_HEIGHT,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}>
          {/* Highlight center row */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 z-10 border-y-2 border-yellow-400/70 shadow-lg"
            style={{ height: ITEM_HEIGHT }}>
            {/* Side arrows */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400 text-2xl">
              ▶
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-400 text-2xl">
              ◀
            </div>
          </div>

          <motion.div animate={controls} className="flex flex-col slot-column">
            {displayItems.map((p, idx) => (
              <div
                key={`${p.id}-${idx}`}
                className="flex items-center justify-center px-6"
                style={{ height: ITEM_HEIGHT }}
                dir={isRTL ? "rtl" : "ltr"}>
                <div
                  className={`flex items-center gap-4 w-full max-w-[350px] ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  }`}>
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 shadow-lg ring-2 ring-white/30"
                    style={{ backgroundColor: p.color }}
                  />
                  <span
                    className="text-white font-bold text-xl truncate flex-1"
                    style={{
                      fontFamily: isRTL
                        ? "'Vazirmatn', system-ui, sans-serif"
                        : "system-ui, sans-serif",
                      textAlign: isRTL ? "right" : "left",
                    }}>
                    {p.fullName}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 px-8 py-2 rounded-lg shadow-lg">
            <span className="text-gray-900 font-black text-sm tracking-widest">
              🎰 LUCKY PICKER 🎰
            </span>
          </div>
        </div>

        {/* Participant count */}
        <div className="mt-3 text-center text-gray-400 text-sm">
          {participants.length} {isRTL ? "شرکت‌کننده" : "entries"}
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl -z-10" />
    </div>
  );
};

export default SlotMachine;
