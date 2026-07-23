export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "failed"
  | "cancelled";

export type RiderStatus = "online" | "on_delivery" | "offline" | "break";

export type FailReason =
  | "customer_unavailable"
  | "wrong_address"
  | "refused"
  | "damaged"
  | "other";

export type IssueStatus = "open" | "in_progress" | "resolved";
export type IssueType =
  | "failed_delivery"
  | "wrong_address"
  | "damage"
  | "payment"
  | "rider_conduct"
  | "other";

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  plate: string;
  status: RiderStatus;
  rating: number;
  deliveriesToday: number;
  avgDeliveryMins: number;
  onTimeRate: number;
  avatarColor: string;
  lat: number;
  lng: number;
  zone: string;
  documentsOk: boolean;
  licenseExpiry: string;
  earningsWeek: number;
  activeJobs: number;
  maxJobs: number;
}

export interface Merchant {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  ordersToday: number;
  openOrders: number;
  avgPrepMins: number;
  zone: string;
  settlement: "weekly" | "daily";
}

export interface Delivery {
  id: string;
  trackingCode: string;
  merchantId: string;
  merchantName: string;
  customer: string;
  customerPhone: string;
  pickup: string;
  dropoff: string;
  status: DeliveryStatus;
  riderId: string | null;
  riderName: string | null;
  etaMins: number | null;
  distanceKm: number;
  fee: number;
  codAmount: number;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  createdAt: string;
  assignedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  priority: "standard" | "express" | "same_day";
  otp: string;
  podRequired: boolean;
  podVerified: boolean;
  podMethod: "otp" | "photo" | "otp_photo" | null;
  failReason?: FailReason;
  trackToken: string;
  zone: string;
  notes?: string;
  reattemptOf?: string;
}

export interface Zone {
  id: string;
  name: string;
  hubs: string[];
  ridersOnline: number;
  openOrders: number;
  avgEtaMins: number;
  coverage: "healthy" | "tight" | "critical";
  surge: number;
}

export interface Issue {
  id: string;
  type: IssueType;
  status: IssueStatus;
  title: string;
  detail: string;
  deliveryId?: string;
  trackingCode?: string;
  riderName?: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
  level: "info" | "warn" | "critical";
}

export interface Activity {
  id: string;
  type: "delivery" | "rider" | "alert" | "system";
  message: string;
  time: string;
  meta?: string;
}

export interface TimelineEvent {
  label: string;
  at: string | null;
  done: boolean;
  current?: boolean;
}

export type CodLedgerStatus =
  | "to_collect"
  | "collected"
  | "remitted"
  | "mismatch"
  | "written_off";

export interface CodLedgerEntry {
  id: string;
  deliveryId: string;
  trackingCode: string;
  riderName: string;
  merchantName: string;
  expected: number;
  collected: number | null;
  status: CodLedgerStatus;
  updatedAt: string;
  note?: string;
}

export type SettlementStatus = "draft" | "ready" | "paid";

export interface SettlementRun {
  id: string;
  merchantId: string;
  merchantName: string;
  period: string;
  orders: number;
  gmv: number;
  fees: number;
  payout: number;
  status: SettlementStatus;
  dueAt: string;
}

export interface PodAttempt {
  at: string;
  method: "otp" | "photo";
  result: "success" | "fail";
  detail: string;
}
