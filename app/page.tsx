"use client";

import React, { useState, useEffect } from "react";
import Wheel from "@/components/Wheel";
import SlotMachine from "@/components/SlotMachine";
import WinnerModal from "@/components/WinnerModal";
import { Participant, DEFAULT_PARTICIPANTS } from "@/types";
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Languages,
  CircleDot,
  Rows3,
  Trophy,
  X,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { playSpinSound } from "@/lib/sound";
import { useLanguage } from "@/contexts/LanguageContext";
import * as XLSX from "xlsx";

type PickerMode = "wheel" | "slot";

interface WinnerRecord {
  participant: Participant;
  timestamp: number;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
  "#E67E22",
  "#2ECC71",
  "#F39C12",
  "#1ABC9C",
  "#E74C3C",
  "#8E44AD",
  "#27AE60",
];

export default function Home() {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [participants, setParticipants] =
    useState<Participant[]>(DEFAULT_PARTICIPANTS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [winnersHistory, setWinnersHistory] = useState<WinnerRecord[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>("wheel");

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("virad-participants");
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load participants", e);
      }
    }

    const savedMode = localStorage.getItem("virad-picker-mode");
    if (savedMode === "wheel" || savedMode === "slot") {
      setPickerMode(savedMode);
    }

    const savedHistory = localStorage.getItem("virad-winners-history");
    if (savedHistory) {
      try {
        setWinnersHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load winners history", e);
      }
    }

    // Check system preference for dark mode
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
    }
  }, []);

  // Save to localStorage whenever participants change
  useEffect(() => {
    localStorage.setItem("virad-participants", JSON.stringify(participants));
  }, [participants]);

  // Save mode preference
  useEffect(() => {
    localStorage.setItem("virad-picker-mode", pickerMode);
  }, [pickerMode]);

  // Save winners history
  useEffect(() => {
    localStorage.setItem(
      "virad-winners-history",
      JSON.stringify(winnersHistory)
    );
  }, [winnersHistory]);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSpinEnd = (selectedWinner: Participant) => {
    setWinner(selectedWinner);
    // Add to history
    setWinnersHistory((prev) => [
      { participant: selectedWinner, timestamp: Date.now() },
      ...prev.slice(0, 9), // Keep last 10 winners
    ]);
    // Automatically remove winner from participants list
    setParticipants((prev) => prev.filter((p) => p.id !== selectedWinner.id));
  };

  const handleRemoveWinner = () => {
    if (winner) {
      setParticipants(participants.filter((p) => p.id !== winner.id));
      setWinner(null);
    }
  };

  const handleSpinClick = () => {
    if (isSpinning || participants.length === 0) return;
    setIsSpinning(true);
  };

  const clearWinnersHistory = () => {
    setWinnersHistory([]);
  };

  // Import participants from CSV/Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, {
          type: "binary",
          cellText: false,
          cellDates: false,
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // Use header: 1 to ensure first row is treated as headers
        // Use raw: false to get formatted values which preserves leading zeros
        const data = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: false,
        }) as any[];

        if (!data || data.length === 0) {
          alert(isRTL ? "فایل خالی است" : "File is empty");
          return;
        }

        // Get headers from first row
        const headers = data[0] as string[];
        const rows = data.slice(1); // Skip header row

        // Find column indices
        const nameColIndex = headers.findIndex(
          (h) =>
            h &&
            (h.toString().toLowerCase().includes("name") ||
              h.toString().toLowerCase().includes("نام"))
        );
        const phoneColIndex = headers.findIndex(
          (h) =>
            h &&
            (h.toString().toLowerCase().includes("phone") ||
              h.toString().toLowerCase().includes("تلفن") ||
              h.toString().toLowerCase().includes("موبایل"))
        );

        if (nameColIndex === -1) {
          alert(
            isRTL
              ? "ستون نام پیدا نشد. لطفا فایل را بررسی کنید."
              : "Name column not found. Please check your file."
          );
          return;
        }

        const newParticipants = rows
          .filter((row) => row && row[nameColIndex]) // Filter out empty rows
          .map((row, i) => {
            const fullName = String(
              row[nameColIndex] || `User ${i + 1}`
            ).trim();

            // Get phone number and preserve leading zeros
            let phoneNumber = "";
            if (
              phoneColIndex !== -1 &&
              row[phoneColIndex] !== undefined &&
              row[phoneColIndex] !== null
            ) {
              const phoneValue = row[phoneColIndex];

              // Try to get the formatted text value from the cell to preserve leading zeros
              const cellAddress = XLSX.utils.encode_cell({
                r: i + 1,
                c: phoneColIndex,
              });
              const cell = ws[cellAddress];

              if (cell && cell.w) {
                // Use the formatted text value which preserves leading zeros
                phoneNumber = String(cell.w).trim();
              } else {
                // Fallback: convert to string
                phoneNumber = String(phoneValue).trim();

                // If it's a number that lost its leading zero (Excel converts 0912... to 912...)
                // Check if it's 10 digits and doesn't start with 0, then add it back
                // This handles Iranian phone numbers that start with 0
                if (
                  !phoneNumber.startsWith("0") &&
                  !isNaN(Number(phoneNumber))
                ) {
                  if (phoneNumber.length === 10) {
                    phoneNumber = "0" + phoneNumber;
                  } else if (phoneNumber.length === 9) {
                    // Sometimes Excel might remove both leading zeros
                    phoneNumber = "0" + phoneNumber;
                  }
                }
              }
            }

            // Generate instagramId from name
            const cleanName = fullName
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "");
            const instagramId = `@${cleanName}_${i + 1}`;

            return {
              id: crypto.randomUUID(),
              instagramId,
              fullName,
              phoneNumber,
              color: COLORS[i % COLORS.length],
            };
          });

        if (newParticipants.length === 0) {
          alert(
            isRTL
              ? "هیچ شرکت‌کننده‌ای در فایل پیدا نشد"
              : "No participants found in file"
          );
          return;
        }

        setParticipants(newParticipants);
        alert(
          isRTL
            ? `${newParticipants.length} شرکت‌کننده با موفقیت وارد شد`
            : `${newParticipants.length} participants imported successfully`
        );
      } catch (error) {
        console.error("Error reading file:", error);
        alert(
          isRTL
            ? "خطا در خواندن فایل. لطفا فرمت فایل را بررسی کنید."
            : "Error reading file. Please check the file format."
        );
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  // Export participants to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      participants.map((p) => ({
        instagramId: p.instagramId,
        "full name": p.fullName,
        "phone number": p.phoneNumber,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, "virad-participants.xlsx");
  };

  // Export participants to CSV
  const exportToCSV = () => {
    const csvContent = XLSX.utils.sheet_to_csv(
      XLSX.utils.json_to_sheet(
        participants.map((p) => ({
          instagramId: p.instagramId,
          "full name": p.fullName,
          "phone number": p.phoneNumber,
        }))
      )
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "virad-participants.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Effect to play ticking sound while spinning
  useEffect(() => {
    if (isSpinning && isSoundEnabled) {
      const interval = setInterval(() => {
        playSpinSound();
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isSpinning, isSoundEnabled]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="p-3 sm:p-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
            V
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t.appName}{" "}
            <span className="text-blue-600 dark:text-blue-400 font-light">
              {t.appSubtitle}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Import/Export buttons */}
          <label
            className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title={t.importTooltip}>
            <Upload size={18} className="sm:w-5 sm:h-5" />
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={exportToCSV}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-blue-600"
            title={t.exportCsvTooltip}>
            <Download size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={exportToExcel}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-green-600"
            title={t.exportTooltip}>
            <FileSpreadsheet size={18} className="sm:w-5 sm:h-5" />
          </button>
          {/* Mode Toggle */}
          <div className="flex bg-gray-200 dark:bg-gray-800 rounded-full p-1 mr-1 sm:mr-2">
            <button
              onClick={() => setPickerMode("wheel")}
              className={`p-1.5 sm:p-2 rounded-full transition-all touch-manipulation ${
                pickerMode === "wheel"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              title={t.wheelMode}>
              <CircleDot
                size={16}
                className={`sm:w-[18px] sm:h-[18px] ${
                  pickerMode === "wheel" ? "text-blue-600" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setPickerMode("slot")}
              className={`p-1.5 sm:p-2 rounded-full transition-all touch-manipulation ${
                pickerMode === "slot"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              title={t.slotMode}>
              <Rows3
                size={16}
                className={`sm:w-[18px] sm:h-[18px] ${
                  pickerMode === "slot" ? "text-purple-600" : ""
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => setLanguage(language === "en" ? "fa" : "en")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            title={t.languageTooltip}>
            <Languages size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            title={t.soundTooltip}>
            {isSoundEnabled ? (
              <Volume2 size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <VolumeX size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            title={t.themeTooltip}>
            {isDarkMode ? (
              <Sun size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <Moon size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
        {/* Left Column: Picker */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] lg:min-h-[70vh] relative">
          <div className="mb-8 relative z-10 w-full">
            {pickerMode === "wheel" ? (
              <Wheel
                participants={participants}
                onSpinEnd={handleSpinEnd}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            ) : (
              <SlotMachine
                participants={participants}
                onSpinEnd={handleSpinEnd}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            )}
          </div>

          <button
            onClick={handleSpinClick}
            disabled={isSpinning || participants.length === 0}
            className={`
                    relative z-20 px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-2xl font-black tracking-widest text-white shadow-xl transform transition-all touch-manipulation min-h-[44px] sm:min-h-auto
                    ${
                      isSpinning || participants.length === 0
                        ? "bg-gray-400 cursor-not-allowed scale-95"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-2xl hover:from-blue-500 hover:to-purple-500 active:scale-95"
                    }
                `}>
            {isSpinning ? t.spinning : t.spin}
          </button>

          {participants.length === 0 && (
            <p className="mt-4 text-red-500 font-medium animate-pulse">
              {t.addParticipantsPrompt}
            </p>
          )}
        </div>

        {/* Right Column: Winners History */}
        {winnersHistory.length > 0 && (
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/30 shadow-lg">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                  <Trophy size={14} className="sm:w-4 sm:h-4" />
                  <span className="truncate">
                    {isRTL ? "برندگان اخیر" : "Recent Winners"}
                  </span>
                </h3>
                <button
                  onClick={clearWinnersHistory}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 touch-manipulation">
                  <Trash2 size={12} />
                  <span className="hidden sm:inline">
                    {isRTL ? "پاک کردن" : "Clear"}
                  </span>
                </button>
              </div>
              <div className="space-y-2 max-h-28 sm:max-h-32 overflow-y-auto custom-scrollbar">
                {winnersHistory.map((record, index) => (
                  <div
                    key={record.timestamp}
                    className="flex flex-col gap-1 text-xs sm:text-sm bg-white/50 dark:bg-gray-800/50 rounded-lg px-2 sm:px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 font-bold text-xs">
                        #{index + 1}
                      </span>
                      <div
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: record.participant.color }}
                      />
                      <span className="font-medium truncate flex-1 text-xs sm:text-sm">
                        {record.participant.fullName}
                      </span>
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        {new Date(record.timestamp).toLocaleTimeString(
                          isRTL ? "fa-IR" : "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    {record.participant.phoneNumber && (
                      <div className="flex items-center gap-2 pl-5 sm:pl-6">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                          📞 {record.participant.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onRemoveWinner={handleRemoveWinner}
      />
    </main>
  );
}
