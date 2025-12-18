export type Participant = {
  id: string;
  instagramId: string;
  fullName: string;
  phoneNumber: string;
  color: string;
};

export const DEFAULT_PARTICIPANTS: Participant[] = [
  {
    id: "1",
    instagramId: "@ali_ahmadi",
    fullName: "علی احمدی",
    phoneNumber: "09123456789",
    color: "#FF6B6B",
  },
  {
    id: "2",
    instagramId: "@maryam_mohammadi",
    fullName: "مریم محمدی",
    phoneNumber: "09123456790",
    color: "#4ECDC4",
  },
  {
    id: "3",
    instagramId: "@reza_karimi",
    fullName: "رضا کریمی",
    phoneNumber: "09123456791",
    color: "#45B7D1",
  },
  {
    id: "4",
    instagramId: "@zahra_hosseini",
    fullName: "زهرا حسینی",
    phoneNumber: "09123456792",
    color: "#96CEB4",
  },
  {
    id: "5",
    instagramId: "@mohammad_rezaei",
    fullName: "محمد رضایی",
    phoneNumber: "09123456793",
    color: "#FFEEAD",
  },
  {
    id: "6",
    instagramId: "@sara_mousavi",
    fullName: "سارا موسوی",
    phoneNumber: "09123456794",
    color: "#D4A5A5",
  },
  {
    id: "7",
    instagramId: "@amir_nouri",
    fullName: "امیر نوری",
    phoneNumber: "09123456795",
    color: "#9B59B6",
  },
  {
    id: "8",
    instagramId: "@fateme_jafari",
    fullName: "فاطمه جعفری",
    phoneNumber: "09123456796",
    color: "#3498DB",
  },
];
