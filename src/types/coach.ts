/**
 * Sales Coach type definitions
 */

import { InsightRating } from "@/views/Dashboard/types";

// Signal types
export type SignalType =
  | 'pain_point'
  | 'economic_impact'
  | 'decision_maker'
  | 'objection';

export interface Signal {
  signal: SignalType;
  detected: boolean;
  quote: string | null;
}

export interface SignalsMap {
  pain_points: SignalData;
  economic_impact: SignalData;
  decision_makers: SignalData;
  objections: SignalData;
}

export interface SignalData {
  detected: boolean;
  quote: string | null;
}

// Dynamic Context types
export interface DynamicContext {
  prospectContext: ContextItem[];
  accountContext: ContextItem[];
}

export interface ContextItem {
  text: string;
  similarity: string | number;
  metadata?: Record<string, unknown>;
}

// Insight types
export interface InsightResponse {
  Insight: 'yes' | 'no';
  Message: string;
}

export interface CoachInsight {
  id?: string;
  message: string;
  timestamp: number;
  type?: InsightType;
}

export type InsightType = 'suggestion' | 'warning' | 'info' | 'success';

// Call Progress types
export type CallProgress =
  | 'opening'
  | 'discovery'
  | 'presentation'
  | 'objection_handling'
  | 'closing'
  | 'follow_up';

// Coach run parameters
export interface RunCoachParams {
  conversationContext: string;
  insights: CoachInsight[];
  signals: Signal[];
  callProgress: CallProgress;
  prospectId: string;
}

export interface DynamicContextRequest {
  prospectId: string;
  accountId: string;
  conversationContext?: string;
}

// Chat completion types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Conversation types
export interface ConversationTurn {
  speaker: 'USER' | 'PROSPECT';
  text: string;
  timestamp?: number;
}

export interface Conversation {
  id: string;
  turns: ConversationTurn[];
  startedAt: number;
  endedAt?: number;
}

// Coach session state
export interface CoachSessionState {
  isActive: boolean;
  callId: string | null;
  prospectId: string | null;
  callProgress: CallProgress;
  signals: Signal[];
  insights: CoachInsight[];
  conversationHistory: ConversationTurn[];
  dynamicContext: DynamicContext | null;
}

// Prospect types (related to coach functionality)
export interface Prospect {
  id: string;
  name: string;
  lastname: string;
  email?: string;
  files?: File[];
  company?: string;
}

export interface InsightMessage {
  message: string;
  isIceBreaker: boolean;
}

// Shared types
export type LeadType = 'buyer' | 'seller';
export enum LeadTypeEnum {
  BUYER = 'buyer',
  SELLER = 'seller',
}
export type LeadTypeFilter = 'all' | LeadType;
export type FeatureType = 'cue' | 'recall';

export interface Insight {
  id: string;
  timestamp: string;
  message: string;
  lead_type: LeadType;
  session_id: string;
  feature: FeatureType;
  expiresAt?: number;
  createdAt?: number;
  priority?: number;
  rating?: InsightRating;
}

export interface InsightGroup {
  date: string;
  insights: Insight[];
}

export interface GetInsightsResponse {
  insights: InsightGroup[];
  hasNextPage: boolean;
}

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