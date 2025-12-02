'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Participant } from '@/types';
import { Trash2, Plus, Upload, Download, Search, X, FileSpreadsheet, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useLanguage } from '@/contexts/LanguageContext';

interface ParticipantListProps {
    participants: Participant[];
    setParticipants: (participants: Participant[]) => void;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71', '#F39C12', '#1ABC9C', '#E74C3C', '#8E44AD', '#27AE60'];

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 8;
const BUFFER_ITEMS = 3;

// Farsi names data
const FARSI_FIRST_NAMES = [
    'علی', 'محمد', 'حسین', 'رضا', 'امیر', 'مهدی', 'احمد', 'جواد', 'کیان', 'آرش',
    'پارسا', 'سینا', 'دانیال', 'یاسین', 'امیرحسین', 'محمدرضا', 'علیرضا', 'سعید', 'مجید', 'حمید',
    'مریم', 'زهرا', 'فاطمه', 'سارا', 'نازنین', 'لیلا', 'پریسا', 'شیما', 'مینا', 'نگار',
    'ریحانه', 'یاسمن', 'نیلوفر', 'سحر', 'مهسا', 'الهام', 'شبنم', 'فرشته', 'سمیرا', 'زینب'
];

const FARSI_LAST_NAMES = [
    'احمدی', 'محمدی', 'حسینی', 'رضایی', 'کریمی', 'موسوی', 'جعفری', 'نوری', 'صادقی', 'رحیمی',
    'اکبری', 'میرزایی', 'هاشمی', 'علوی', 'کاظمی', 'طاهری', 'مرادی', 'قاسمی', 'یوسفی', 'عباسی'
];

const ENGLISH_FIRST_NAMES = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rose', 'Sam', 'Tom',
    'Emma', 'James', 'Sophia', 'William', 'Ava', 'Benjamin', 'Isabella', 'Lucas', 'Luna', 'Mason'
];

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, setParticipants }) => {
    const { t, isRTL } = useLanguage();
    const [newName, setNewName] = useState('');
    const [newWeight, setNewWeight] = useState(1);
    const [scrollTop, setScrollTop] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter participants by search
    const filteredParticipants = useMemo(() => {
        if (!searchQuery.trim()) return participants;
        const query = searchQuery.toLowerCase();
        return participants.filter(p => p.name.toLowerCase().includes(query));
    }, [participants, searchQuery]);

    // Virtual scrolling calculations
    const totalHeight = filteredParticipants.length * ITEM_HEIGHT;
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_ITEMS);
    const endIndex = Math.min(
        filteredParticipants.length,
        Math.ceil((scrollTop + VISIBLE_ITEMS * ITEM_HEIGHT) / ITEM_HEIGHT) + BUFFER_ITEMS
    );
    const visibleItems = filteredParticipants.slice(startIndex, endIndex);
    const offsetY = startIndex * ITEM_HEIGHT;

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const addParticipant = () => {
        if (!newName.trim()) return;
        const color = COLORS[participants.length % COLORS.length];
        const newParticipant: Participant = {
            id: crypto.randomUUID(),
            name: newName.trim(),
            weight: Math.max(1, newWeight),
            color,
        };
        setParticipants([...participants, newParticipant]);
        setNewName('');
        setNewWeight(1);
    };

    const removeParticipant = (id: string) => {
        setParticipants(participants.filter(p => p.id !== id));
    };

    const updateWeight = (id: string, weight: number) => {
        setParticipants(participants.map(p => p.id === id ? { ...p, weight: Math.max(1, weight) } : p));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws) as any[];

            const newParticipants = data.map((row, i) => ({
                id: crypto.randomUUID(),
                name: String(row.Name || row.name || row['نام'] || `User ${i + 1}`),
                weight: Math.max(1, Number(row.Weight || row.weight || row['وزن'] || 1)),
                color: COLORS[i % COLORS.length]
            }));

            setParticipants(newParticipants);
        };
        reader.readAsBinaryString(file);
        e.target.value = '';
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(participants.map(p => ({ Name: p.name, Weight: p.weight })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Participants");
        XLSX.writeFile(wb, "virad-participants.xlsx");
    };

    // Download sample CSV
    const downloadSampleCSV = () => {
        const sampleData = isRTL ? [
            { 'نام': 'علی احمدی', 'وزن': 1 },
            { 'نام': 'مریم محمدی', 'وزن': 2 },
            { 'نام': 'رضا کریمی', 'وزن': 1 },
            { 'نام': 'زهرا حسینی', 'وزن': 3 },
            { 'نام': 'محمد رضایی', 'وزن': 1 },
        ] : [
            { Name: 'Alice Smith', Weight: 1 },
            { Name: 'Bob Johnson', Weight: 2 },
            { Name: 'Charlie Brown', Weight: 1 },
            { Name: 'Diana Wilson', Weight: 3 },
            { Name: 'Eve Davis', Weight: 1 },
        ];
        
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sample");
        XLSX.writeFile(wb, isRTL ? "نمونه-شرکت‌کنندگان.xlsx" : "sample-participants.xlsx");
    };

    const clearAll = () => {
        if (window.confirm(isRTL ? 'آیا مطمئن هستید که می‌خواهید همه را حذف کنید؟' : 'Are you sure you want to remove all participants?')) {
            setParticipants([]);
        }
    };

    // Generate Farsi test data
    const generateFarsiData = (count: number = 50) => {
        const testData: Participant[] = [];
        for (let i = 0; i < count; i++) {
            const firstName = FARSI_FIRST_NAMES[Math.floor(Math.random() * FARSI_FIRST_NAMES.length)];
            const lastName = FARSI_LAST_NAMES[Math.floor(Math.random() * FARSI_LAST_NAMES.length)];
            testData.push({
                id: crypto.randomUUID(),
                name: `${firstName} ${lastName}`,
                weight: Math.floor(Math.random() * 3) + 1,
                color: COLORS[i % COLORS.length],
            });
        }
        setParticipants(testData);
    };

    // Generate English test data
    const generateEnglishData = (count: number = 50) => {
        const testData: Participant[] = [];
        for (let i = 0; i < count; i++) {
            const name = ENGLISH_FIRST_NAMES[i % ENGLISH_FIRST_NAMES.length];
            testData.push({
                id: crypto.randomUUID(),
                name: `${name} ${Math.floor(i / ENGLISH_FIRST_NAMES.length) + 1}`,
                weight: Math.floor(Math.random() * 3) + 1,
                color: COLORS[i % COLORS.length],
            });
        }
        setParticipants(testData);
    };

    return (
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t.participantCount(participants.length)}</h2>
                <div className="flex gap-1">
                    <button 
                        onClick={downloadSampleCSV} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-green-600" 
                        title={isRTL ? 'دانلود نمونه CSV' : 'Download Sample CSV'}
                    >
                        <FileSpreadsheet size={18} />
                    </button>
                    <label className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title={t.importTooltip}>
                        <Upload size={18} />
                        <input type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button onClick={exportToExcel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title={t.exportTooltip}>
                        <Download size={18} />
                    </button>
                    {participants.length > 0 && (
                        <button onClick={clearAll} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors text-red-500" title={isRTL ? 'حذف همه' : 'Clear all'}>
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Add new participant */}
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={t.name}
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[44px] sm:min-h-auto"
                    onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                />
                <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    placeholder={t.weight}
                    className="w-14 sm:w-16 px-2 py-3 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center min-h-[44px] sm:min-h-auto"
                    min="1"
                />
                <button
                    onClick={addParticipant}
                    className="p-3 sm:p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation min-h-[44px] sm:min-h-auto"
                >
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                </button>
            </div>

            {/* Search (show for large lists) */}
            {participants.length > 10 && (
                <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isRTL ? 'جستجو...' : 'Search participants...'}
                        className="w-full pl-9 pr-10 py-3 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[44px] sm:min-h-auto"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-manipulation p-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            )}

            {/* Virtualized participant list */}
            <div 
                ref={containerRef}
                className="overflow-y-auto custom-scrollbar rounded-lg"
                style={{ height: Math.min(VISIBLE_ITEMS * ITEM_HEIGHT, totalHeight + 20), maxHeight: 400 }}
                onScroll={handleScroll}
            >
                <div style={{ height: totalHeight, position: 'relative' }}>
                    <div style={{ transform: `translateY(${offsetY}px)` }}>
                        {visibleItems.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 mb-1"
                                style={{ borderLeftColor: p.color, height: ITEM_HEIGHT - 4 }}
                            >
                                <span className="font-medium flex-1 truncate text-sm">{p.name}</span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <span className="text-xs text-gray-400">{isRTL ? 'و:' : 'W:'}</span>
                                    <input
                                        type="number"
                                        value={p.weight}
                                        onChange={(e) => updateWeight(p.id, Number(e.target.value))}
                                        className="w-12 sm:w-10 px-1 py-1 sm:py-0.5 text-xs border rounded bg-transparent text-center min-h-[32px] sm:min-h-auto"
                                        min="1"
                                    />
                                </div>
                                <button
                                    onClick={() => removeParticipant(p.id)}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex-shrink-0 touch-manipulation min-w-[44px] sm:min-w-auto"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Empty state with generator options */}
            {participants.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="mb-4">{t.noParticipants}</p>
                    
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={downloadSampleCSV}
                            className="w-full py-2 px-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
                        >
                            📥 {isRTL ? 'دانلود نمونه CSV' : 'Download Sample CSV'}
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => generateFarsiData(50)}
                                className="py-2 px-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium"
                            >
                                🇮🇷 {isRTL ? '۵۰ نام فارسی' : '50 Farsi Names'}
                            </button>
                            <button
                                onClick={() => generateEnglishData(50)}
                                className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                            >
                                🇬🇧 {isRTL ? '۵۰ نام انگلیسی' : '50 English Names'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtered results info */}
            {searchQuery && filteredParticipants.length !== participants.length && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                    {isRTL 
                        ? `نمایش ${filteredParticipants.length} از ${participants.length}`
                        : `Showing ${filteredParticipants.length} of ${participants.length}`
                    }
                </div>
            )}
        </div>
    );
};

export default ParticipantList;
