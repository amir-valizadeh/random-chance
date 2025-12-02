export const translations = {
    en: {
        // Header
        appName: "VIRAD",
        appSubtitle: "Wheel",

        // Buttons
        spin: "SPIN",
        spinning: "SPINNING...",
        close: "Close",
        removeWinner: "Remove Winner",
        add: "Add",

        // Modes
        wheelMode: "Wheel",
        slotMode: "Slot Machine",

        // Participant List
        participants: "Participants",
        participantCount: (count: number) => `Participants (${count})`,
        name: "Name",
        weight: "Weight",
        noParticipants: "No participants yet. Add some or import from Excel!",
        addParticipantsPrompt: "Add participants to start!",

        // Stats
        quickStats: "Quick Stats",
        totalWeight: "Total Weight",

        // Winner Modal
        winner: "WINNER!",

        // Tooltips
        importTooltip: "Import Excel/CSV",
        exportTooltip: "Export",
        soundTooltip: "Toggle Sound",
        themeTooltip: "Toggle Theme",
        languageTooltip: "Switch Language",
    },
    fa: {
        // Header
        appName: "ویراد",
        appSubtitle: "چرخ",

        // Buttons
        spin: "چرخش",
        spinning: "در حال چرخش...",
        close: "بستن",
        removeWinner: "حذف برنده",
        add: "افزودن",

        // Modes
        wheelMode: "چرخ",
        slotMode: "اسلات",

        // Participant List
        participants: "شرکت‌کنندگان",
        participantCount: (count: number) => `شرکت‌کنندگان (${count})`,
        name: "نام",
        weight: "وزن",
        noParticipants: "هنوز شرکت‌کننده‌ای وجود ندارد. اضافه کنید یا از اکسل وارد کنید!",
        addParticipantsPrompt: "برای شروع شرکت‌کننده اضافه کنید!",

        // Stats
        quickStats: "آمار سریع",
        totalWeight: "مجموع وزن",

        // Winner Modal
        winner: "برنده!",

        // Tooltips
        importTooltip: "وارد کردن اکسل/CSV",
        exportTooltip: "خروجی گرفتن",
        soundTooltip: "تغییر صدا",
        themeTooltip: "تغییر تم",
        languageTooltip: "تغییر زبان",
    },
};

export type Language = 'en' | 'fa';
export type TranslationKey = keyof typeof translations.en;
