"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { motion, useAnimation } from "framer-motion";
import { Participant } from "@/types";

interface WheelProps {
  participants: Participant[];
  onSpinEnd: (winner: Participant) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

// Maximum names to display on wheel for performance
const MAX_VISIBLE_NAMES = 24;

const Wheel: React.FC<WheelProps> = ({
  participants,
  onSpinEnd,
  isSpinning,
  setIsSpinning,
}) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate segments once - equal probability for all participants
  const segments = useMemo(() => {
    if (participants.length === 0) return [];
    const angleSize = 360 / participants.length;
    return participants.map((p, i) => {
      const startAngle = i * angleSize;
      const endAngle = (i + 1) * angleSize;
      return {
        participant: p,
        startAngle,
        endAngle,
        midAngle: startAngle + angleSize / 2,
      };
    });
  }, [participants]);

  // Draw wheel on canvas for better performance with many participants
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || participants.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on screen size for better mobile performance
    const isMobile = window.innerWidth < 768;
    const canvasSize = isMobile ? 400 : 500;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 4;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    segments.forEach((seg) => {
      const startRad = (seg.startAngle - 90) * (Math.PI / 180);
      const endRad = (seg.endAngle - 90) * (Math.PI / 180);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startRad, endRad);
      ctx.closePath();
      ctx.fillStyle = seg.participant.color;
      ctx.fill();

      // Add subtle border between segments
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Don't draw names during spinning - only show colored segments
    // Names will be shown in the WinnerModal after spinning stops
  }, [segments, participants.length, isSpinning]);

  const spinWheel = useCallback(async () => {
    if (participants.length === 0) return;

    // Calculate random winner - equal probability for all
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];
    const winnerSegment = segments[winnerIndex];
    const winnerCenterAngle = winnerSegment.midAngle;

    // Calculate target rotation
    const currentRotationMod = rotation % 360;
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 spins
    const targetRotation =
      rotation +
      360 * extraSpins +
      (360 - winnerCenterAngle - currentRotationMod);

    // Add randomness within segment
    const segmentSize = winnerSegment.endAngle - winnerSegment.startAngle;
    const randomOffset = (Math.random() - 0.5) * (segmentSize * 0.6);

    await controls.start({
      rotate: targetRotation + randomOffset,
      transition: {
        duration: 4 + Math.random() * 2,
        ease: [0.15, 0.25, 0.25, 1],
      },
    });

    setRotation(targetRotation + randomOffset);
    setIsSpinning(false);
    onSpinEnd(winner);
  }, [participants, segments, rotation, controls, setIsSpinning, onSpinEnd]);

  useEffect(() => {
    if (isSpinning && participants.length > 0) {
      spinWheel();
    }
  }, [isSpinning, spinWheel, participants.length]);

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-red-600 drop-shadow-lg filter drop-shadow-md" />
      </div>

      {/* Wheel Container */}
      <motion.div
        className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden relative"
        animate={controls}
        initial={{ rotate: 0 }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full"
        />
      </motion.div>

      {/* Center Cap */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg z-10 flex items-center justify-center border-4 border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-inner" />
      </div>

      {/* Participant count indicator for large lists */}
     
    </div>
  );
};

export default Wheel;
