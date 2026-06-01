/**
 * Follow Up Boss (FUB) type definitions
 *
 * Shapes are based on the live `GET /v1/people` response observed during
 * SAYSO-140 verification. Top-level scalar fields are confirmed; nested
 * collections marked below were collapsed in the verification response and
 * carry an index signature until their inner shape is confirmed.
 */

// ── Nested sub-shapes ──────────────────────────────────────────────

/** Inner shape not fully verified — confirm before relying on specific fields. */
export interface FubLeadEmail {
  value?: string;
  type?: string;
  isPrimary?: boolean | number;
  status?: string;
  [key: string]: unknown;
}

/** Inner shape not fully verified — confirm before relying on specific fields. */
export interface FubLeadPhone {
  value?: string;
  type?: string;
  isPrimary?: boolean | number;
  status?: string;
  [key: string]: unknown;
}

export interface FubLeadAddress {
  type?: string;
  street?: string;
  city?: string;
  state?: string;
  code?: string;
  country?: string;
  zpid?: string;
}

export interface FubCollaborators {
  assigned: boolean;
  id: number;
  role:string;
  name: string;
}

export interface FubLeadPicture {
  small?: string;
  [key: string]: unknown;
}

export interface FubLeadSocialData {
  name?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: string;
  location?: string;
  company?: string;
  title?: string;
  bio?: string;
  topics?: string;
  facebook?: string;
  twitter?: string;
  googleProfile?: string;
  googlePlus?: string;
  linkedIn?: string;
}

// ── Lead (a FUB "person") ──────────────────────────────────────────

export interface FubLead {
  id: number;
  name: string;
  firstName: string | null;
  lastName: string | null;
  type: string | null;

  // Assignment
  assignedTo: string | null;
  assignedUserId: number | null;
  assignedPondId: number | null;
  assignedLenderId: number | null;
  assignedLenderName: string | null;

  // Status / engagement
  claimed: boolean;
  contacted: number;
  delayed: boolean;
  firstToClaimOffer: boolean;
  websiteVisits: number;

  // Pipeline / stage
  stage: string | null;
  stageId: number | null;
  source: string | null;
  sourceId: number | null;
  sourceUrl: string | null;
  createdVia: string | null;
  leadFlowId: number | null;
  price: number | null;

  // Deal
  dealName: string | null;
  dealPrice: number | null;
  dealStage: string | null;
  dealStatus: string | null;
  dealCloseDate: string | null;

  // Timeframe
  timeframeId: number | null;
  timeframeStatus: string | null;
  timeframeDateRange: string | null;
  timeframeUpdated: string | null;

  // Timestamps (ISO 8601 strings)
  created: string;
  updated: string;
  lastActivity: string | null;

  // Collections / nested objects
  emails: FubLeadEmail[];
  phones: FubLeadPhone[];
  addresses: FubLeadAddress[];
  tags: string[];
  collaborators: FubCollaborators[];
  pondMembers: Array<Record<string, unknown>>;
  teamLeaders: Array<Record<string, unknown>>;
  picture: FubLeadPicture | null;
  socialData: FubLeadSocialData | null;

  // FUB may return additional fields not enumerated here.
  [key: string]: unknown;
}

// ── Response envelope ──────────────────────────────────────────────

export interface FubLeadsMetadata {
  collection: string;
  limit: number;
  offset: number;
  total: number;
  next: string | null;
  nextLink: string | null;
}

/** Response shape returned by our backend `GET /fub/leads`. */
export interface FubLeadsResponse {
  leads: FubLead[];
  _metadata: FubLeadsMetadata;
}

// ── Note ───────────────────────────────────────────────────────────

/** Created note returned by FUB `POST /v1/notes`. */
export interface FubNote {
  id: number;
  personId: number;
  subject: string;
  body: string;
  type: string;
  isHtml: boolean;
  isExternal: boolean;
  showContent: boolean;
  systemId: number;
  systemName: string;
  actionPlanId: number | null;
  automationId: number | null;
  createdBy: string;
  createdById: number;
  updatedBy: string;
  updatedById: number;
  created: string;
  updated: string;
}
