export type Participant = {
    id: string;
    name: string;
    weight: number;
    color: string;
};

export const DEFAULT_PARTICIPANTS: Participant[] = [
    { id: '1', name: 'علی احمدی', weight: 1, color: '#FF6B6B' },
    { id: '2', name: 'مریم محمدی', weight: 1, color: '#4ECDC4' },
    { id: '3', name: 'رضا کریمی', weight: 1, color: '#45B7D1' },
    { id: '4', name: 'زهرا حسینی', weight: 1, color: '#96CEB4' },
    { id: '5', name: 'محمد رضایی', weight: 1, color: '#FFEEAD' },
    { id: '6', name: 'سارا موسوی', weight: 1, color: '#D4A5A5' },
    { id: '7', name: 'امیر نوری', weight: 1, color: '#9B59B6' },
    { id: '8', name: 'فاطمه جعفری', weight: 1, color: '#3498DB' },
];
