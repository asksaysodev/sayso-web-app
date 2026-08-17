/**
 * Coach session type definitions (conversations list and its nested relations).
 */

import { InsightRating } from "@/views/Dashboard/types";

export type LeadType = 'buyer' | 'seller';

type FeatureType = 'cue' | 'recall';

// Conversations list (GET /conversations) — coach_sessions with nested relations
export interface ConversationInsight {
  id: string;
  session_id: string;
  message: string;
  lead_type: LeadType;
  feature: FeatureType;
  rating: InsightRating | null;
  created_at: string;
}

export interface ConversationPulse {
  id: string;
  session_id: string;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  property_type: string | null;
  median_price: number | null;
  median_price_per_sqft: number | null;
  median_days_on_market: number | null;
  new_listings: number | null;
  market_dynamics: string | null;
  price_trend_direction: string | null;
  price_trend_change_percent: number | null;
  created_at: string;
}

export interface ConversationSmartCapture {
  id: string;
  session_id: string;
  topic: string;
  content: string;
  created_at: string;
}

export interface ConversationItem {
  id: string;
  created_at: string;
  ended_at: string | null;
  duration_in_minutes: number | null;
  lead_type: LeadType | null;
  crm_lead_name: string | null;
  summary: string | null;
  appointment_booked: boolean | null;
  insights: ConversationInsight[];
  pulse: ConversationPulse[];
  smart_captures: ConversationSmartCapture[];
}

export interface GetConversationsResponse {
  conversations: ConversationItem[];
  total: number;
  hasNextPage: boolean;
  page: number;
}
