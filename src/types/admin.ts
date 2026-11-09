export interface AdminSession {
  id: string;
  email: string;
}

export interface UpcomingBooking {
  id: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  customerPhone: string;
  apartment: { id: string; title: string };
}

export interface MetricsSummary {
  apartmentsActive: number;
  bookingsPending: number;
  bookingsConfirmed: number;
  sessionsTotal: number;
  sessionsPaused: number;
  confirmedRevenue: number;
  upcoming: UpcomingBooking[];
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface AdminApartment {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  features: string[];
  images: string[];
  isActive: boolean;
}

export interface BookingRow {
  id: string;
  apartmentId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  customerPhone: string;
  notes: string | null;
  apartment?: { id: string; title: string; pricePerNight: number };
}

export type MessageRole = "USER" | "ASSISTANT" | "OPERATOR" | "SYSTEM";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ChatSessionRow {
  id: string;
  phoneNumber: string;
  botActive: boolean;
  lastInteraction: string;
  messages: ChatMessage[];
}

export interface ChatDetail {
  session: Omit<ChatSessionRow, "messages">;
  messages: ChatMessage[];
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}
