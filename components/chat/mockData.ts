import { Conversation, Message } from "./types";

// ── Patient-side: conversations with doctors ──────────────────────────────────

export const PATIENT_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participantId: "doc-1",
    participantName: "Dr. Amara Diallo",
    participantRole: "DOCTOR",
    participantInitials: "AD",
    participantSpecialty: "Cardiology",
    isOnline: true,
    lastMessage: "Please share your latest ECG report before the appointment.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 8),
    unreadCount: 2,
  },
  {
    id: "conv-2",
    participantId: "doc-2",
    participantName: "Dr. Sophie Martin",
    participantRole: "DOCTOR",
    participantInitials: "SM",
    participantSpecialty: "General Practice",
    isOnline: false,
    lastMessage: "Your blood work results look good overall.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
  },
  {
    id: "conv-3",
    participantId: "doc-3",
    participantName: "Dr. Kofi Mensah",
    participantRole: "DOCTOR",
    participantInitials: "KM",
    participantSpecialty: "Dermatology",
    isOnline: false,
    lastMessage: "Apply the cream twice daily and avoid direct sunlight.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 27),
    unreadCount: 1,
  },
];

// ── Doctor-side: conversations with patients ──────────────────────────────────

export const DOCTOR_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-a",
    participantId: "pat-1",
    participantName: "Ibrahim Traoré",
    participantRole: "PATIENT",
    participantInitials: "IT",
    isOnline: true,
    lastMessage: "I attached the report you asked for.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 3,
  },
  {
    id: "conv-b",
    participantId: "pat-2",
    participantName: "Fatima Coulibaly",
    participantRole: "PATIENT",
    participantInitials: "FC",
    isOnline: false,
    lastMessage: "Thank you doctor, I will follow your instructions.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 0,
  },
  {
    id: "conv-c",
    participantId: "pat-3",
    participantName: "Moussa Konate",
    participantRole: "PATIENT",
    participantInitials: "MK",
    isOnline: false,
    lastMessage: "Is it normal to feel dizzy after taking the medication?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 30),
    unreadCount: 1,
  },
];

// ── Mock messages per conversation ─────────────────────────────────────────────

const yesterday = (h: number, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(h, m, 0, 0);
  return d;
};

const today = (h: number, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

// Patient view — conv-1 (with Dr. Amara Diallo)
const MESSAGES_CONV_1: Message[] = [
  {
    id: "m1",
    senderId: "doc-1",
    text: "Hello! I reviewed your last appointment notes. How have you been feeling since we adjusted your medication?",
    timestamp: yesterday(9, 15),
    status: "read",
  },
  {
    id: "m2",
    senderId: "patient-me",
    text: "Good morning, Doctor. I have been feeling better overall. The chest tightness has reduced. However, I still get slightly short of breath when climbing stairs.",
    timestamp: yesterday(9, 42),
    status: "read",
  },
  {
    id: "m3",
    senderId: "doc-1",
    text: "That is a positive improvement. The shortness of breath on exertion could be normal at this stage of recovery. I would like to review your ECG before our next session.",
    timestamp: yesterday(10, 5),
    status: "read",
  },
  {
    id: "m4",
    senderId: "patient-me",
    text: "Of course. I had one done last week. Let me upload the file.",
    timestamp: yesterday(10, 8),
    status: "read",
  },
  {
    id: "m5",
    senderId: "patient-me",
    files: [
      {
        id: "f1",
        name: "ECG_Report_March2026.pdf",
        size: 2_340_000,
        mimeType: "application/pdf",
        url: "#",
      },
    ],
    timestamp: yesterday(10, 9),
    status: "read",
  },
  {
    id: "m6",
    senderId: "doc-1",
    text: "Thank you. I will review this shortly. Also, have you been tracking your blood pressure at home?",
    timestamp: yesterday(14, 30),
    status: "read",
  },
  {
    id: "m7",
    senderId: "patient-me",
    text: "Yes, I check it every morning. The readings have been around 130/85 mostly.",
    timestamp: yesterday(15, 0),
    status: "read",
  },
  {
    id: "m8",
    senderId: "doc-1",
    text: "That is slightly elevated but manageable. Please upload your blood pressure log if you have one. I have also attached a dietary guideline that should help.",
    timestamp: today(8, 20),
    files: [
      {
        id: "f2",
        name: "Cardiac_Diet_Guidelines.pdf",
        size: 890_000,
        mimeType: "application/pdf",
        url: "#",
      },
      {
        id: "f3",
        name: "BP_Tracking_Template.xlsx",
        size: 45_000,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "#",
      },
    ],
  },
  {
    id: "m9",
    senderId: "doc-1",
    text: "Please share your latest ECG report before the appointment.",
    timestamp: today(8, 22),
  },
];

// Patient view — conv-2 (with Dr. Sophie Martin)
const MESSAGES_CONV_2: Message[] = [
  {
    id: "m10",
    senderId: "doc-2",
    text: "Hi! Your blood test results came back. Overall everything looks healthy.",
    timestamp: yesterday(11, 0),
    status: "read",
  },
  {
    id: "m11",
    senderId: "patient-me",
    text: "Oh great! I was worried about my iron levels.",
    timestamp: yesterday(11, 15),
    status: "read",
  },
  {
    id: "m12",
    senderId: "doc-2",
    text: "Iron is slightly on the lower end of normal. I recommend eating more iron-rich foods like lentils, spinach, and red meat. No need for supplements yet.",
    timestamp: yesterday(11, 30),
    status: "read",
  },
  {
    id: "m13",
    senderId: "patient-me",
    text: "Understood, thank you Doctor!",
    timestamp: yesterday(11, 45),
    status: "read",
  },
  {
    id: "m14",
    senderId: "doc-2",
    text: "Your blood work results look good overall.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: "read",
  },
];

// Patient view — conv-3 (with Dr. Kofi Mensah)
const MESSAGES_CONV_3: Message[] = [
  {
    id: "m20",
    senderId: "patient-me",
    text: "Doctor, I have a rash on my forearm that started appearing two days ago. I took a photo.",
    timestamp: yesterday(16, 0),
    status: "read",
  },
  {
    id: "m21",
    senderId: "patient-me",
    files: [
      {
        id: "f10",
        name: "rash_photo.jpg",
        size: 1_200_000,
        mimeType: "image/jpeg",
        url: "https://placehold.co/400x300/f3f4f6/9ca3af?text=Photo",
      },
    ],
    timestamp: yesterday(16, 1),
    status: "read",
  },
  {
    id: "m22",
    senderId: "doc-3",
    text: "Thank you for the photo. This looks like contact dermatitis — likely a reaction to something you touched. Did you use any new soap, detergent, or come into contact with plants recently?",
    timestamp: yesterday(17, 20),
  },
  {
    id: "m23",
    senderId: "patient-me",
    text: "Now that you mention it, I tried a new laundry detergent last week.",
    timestamp: yesterday(17, 35),
    status: "read",
  },
  {
    id: "m24",
    senderId: "doc-3",
    text: "That is very likely the cause. Stop using it immediately. Apply the cream twice daily and avoid direct sunlight.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 27),
  },
];

// Doctor view — conv-a (with Ibrahim Traoré)
const MESSAGES_CONV_A: Message[] = [
  {
    id: "ma1",
    senderId: "doctor-me",
    text: "Good morning Ibrahim. I wanted to follow up on your last visit. How are you feeling?",
    timestamp: yesterday(9, 0),
    status: "read",
  },
  {
    id: "ma2",
    senderId: "pat-1",
    text: "Good morning Doctor. I am feeling much better, thank you. The fever has gone down.",
    timestamp: yesterday(9, 20),
  },
  {
    id: "ma3",
    senderId: "doctor-me",
    text: "Excellent news. Please complete the full antibiotic course even if you feel better. Can you share the latest test results from the lab?",
    timestamp: yesterday(9, 35),
    status: "read",
  },
  {
    id: "ma4",
    senderId: "pat-1",
    text: "Yes Doctor, I just picked them up this morning.",
    timestamp: today(8, 10),
  },
  {
    id: "ma5",
    senderId: "pat-1",
    text: "I attached the report you asked for.",
    timestamp: today(8, 11),
    files: [
      {
        id: "fa1",
        name: "Lab_Results_Ibrahim_March2026.pdf",
        size: 1_560_000,
        mimeType: "application/pdf",
        url: "#",
      },
    ],
  },
  {
    id: "ma6",
    senderId: "pat-1",
    text: "Please let me know if everything is alright.",
    timestamp: today(8, 12),
  },
];

// Doctor view — conv-b (with Fatima Coulibaly)
const MESSAGES_CONV_B: Message[] = [
  {
    id: "mb1",
    senderId: "pat-2",
    text: "Doctor, I wanted to ask about the side effects of the new medication you prescribed.",
    timestamp: yesterday(14, 0),
  },
  {
    id: "mb2",
    senderId: "doctor-me",
    text: "Of course, Fatima. Some common side effects include mild nausea and headache in the first few days. These usually subside. If you experience severe dizziness or difficulty breathing, stop the medication and contact me immediately.",
    timestamp: yesterday(14, 30),
    status: "read",
  },
  {
    id: "mb3",
    senderId: "pat-2",
    text: "I see. I had some nausea yesterday but it was mild.",
    timestamp: yesterday(15, 0),
  },
  {
    id: "mb4",
    senderId: "doctor-me",
    text: "That is expected and should pass within 3-4 days. Take the medication after meals to reduce the nausea.",
    timestamp: yesterday(15, 10),
    status: "read",
  },
  {
    id: "mb5",
    senderId: "pat-2",
    text: "Thank you doctor, I will follow your instructions.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

// Doctor view — conv-c (with Moussa Konate)
const MESSAGES_CONV_C: Message[] = [
  {
    id: "mc1",
    senderId: "doctor-me",
    text: "Hello Moussa, I have reviewed your X-ray. There is no fracture. It appears to be a muscle strain.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 32),
    status: "read",
  },
  {
    id: "mc2",
    senderId: "pat-3",
    text: "That is a relief! What should I do for the pain?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 31),
  },
  {
    id: "mc3",
    senderId: "doctor-me",
    text: "Rest the area, apply ice for 20 minutes every few hours for the first two days, then switch to heat. I have prescribed ibuprofen for the inflammation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 31),
    status: "read",
  },
  {
    id: "mc4",
    senderId: "pat-3",
    text: "Is it normal to feel dizzy after taking the medication?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
  },
];

// ── Exported map ──────────────────────────────────────────────────────────────

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-1": MESSAGES_CONV_1,
  "conv-2": MESSAGES_CONV_2,
  "conv-3": MESSAGES_CONV_3,
  "conv-a": MESSAGES_CONV_A,
  "conv-b": MESSAGES_CONV_B,
  "conv-c": MESSAGES_CONV_C,
};
