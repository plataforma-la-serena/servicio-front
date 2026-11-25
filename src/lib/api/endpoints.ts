import "server-only";
import type {
  AdminApartment,
  BookingRow,
  BookingStatus,
  ChatDetail,
  ChatSessionRow,
  MetricsSummary,
} from "@/types/admin";
import { apiFetch } from "./client";

export function fetchMetrics() {
  return apiFetch<MetricsSummary>("/metrics");
}

export function fetchApartments() {
  return apiFetch<AdminApartment[]>("/apartments");
}

export function fetchBookings(status?: BookingStatus) {
  const query = status ? `?status=${status}` : "";
  return apiFetch<BookingRow[]>(`/bookings${query}`);
}

export function fetchChatSessions() {
  return apiFetch<ChatSessionRow[]>("/chat-sessions");
}

export function fetchChatDetail(id: string) {
  return apiFetch<ChatDetail>(`/chat-sessions/${id}/messages`);
}
