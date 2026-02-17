import { Signal } from "@/views/Admin/types";
import { LeadType, Prospect } from "@/types/coach";

export type CoachFeature = 'cue' | 'recall';

export interface SessionData {
    sessionId: string;
    prospectId?: string;
    timestamp?: number;
    session?: unknown;
}

export interface CueInsight {
    id: string;
    message: string;
    createdAt: number;
    priority?: number;
    expiresAt?: number;
    appointmentBooked?: boolean;
}

export interface AudioState {
    isCompressing: boolean;
    isUploading: boolean;
}

export interface CueState {
    isResettingCueSession: boolean;
    insightsQueue: CueInsight[];
    currentInsight: CueInsight | null;
    isInsightDisplaying: boolean;
    leadType: LeadType | null;
    isInsightsLayoutOpen: boolean;
    hasReceivedFirstInsight: boolean;
    unseenInsightsCount: number;
}

export interface RecallState {
    selectedProspect: Prospect | null;
    prospects: Prospect[];
    isLoadingProspects: boolean;
    prospectsError: string | null;
    signals: Signal[];
}

export interface RecordingResult {
    micFilePath?: string;
    systemFilePath?: string;
    duration?: number;
}

export interface RecordingParams {
    sessionId: string;
    prospectId: string;
    metadata: {
        sessionId: string;
        prospectId: string;
        timestamp: number;
    };
}

export interface CoachWindowStore {
    // ========== SHARED STATE ========== //
    isCoachActive: boolean;
    isCoachLoading: boolean;
    callDurationInSeconds: number;
    sessionData: SessionData | null;
    coachFeature: CoachFeature;
    error: string | null;
    audio: AudioState;
    cue: CueState;
    recall: RecallState;

    // ========== PERMISSIONS STATE ========== //
    showPermissionsModal: boolean;
    needsSystemSettings: boolean;

    // ========== SHARED ACTIONS ========== //
    setIsCoachActive: (isCoachActive: boolean) => void;
    setIsCoachLoading: (isCoachLoading: boolean) => void;
    setCoachFeature: (coachFeature: CoachFeature) => void;
    clearError: () => void;
    shared_resetCoach: () => void;
    incrementCallDuration: () => void;
    resetCallDuration: () => void;

    // ========== PERMISSIONS ACTIONS ========== //
    requestPermissions: () => Promise<boolean>;
    closePermissionsModal: () => void;
    openCoachWindow: () => Promise<boolean>;
    closeCoachWindow: () => void;

    // ========== RECALL ACTIONS ========== //
    recall_createNewSessionData: (prospectId: string) => SessionData | null;
    setSelectedProspect: (selectedProspect: Prospect) => void;
    setProspects: (prospects: Prospect[]) => void;
    recall_fetchProspects: () => Promise<void>;
    recall_startDualChannelRecording: (prospectId: string) => Promise<RecordingResult | undefined>;
    recall_handleStopRecording: () => Promise<unknown>;
    setSignals: (signals: Signal[]) => void;
    recall_resetCoach: () => void;

    // ========== CUE ACTIONS ========== //
    setLeadType: (leadType: LeadType | null) => void;
    cue_createNewSession: (leadType: LeadType | null) => Promise<SessionData>;
    cue_handleStartCue: () => Promise<void>;
    cue_handleStopCue: () => Promise<void>;
    cue_stopSession: (sessionId: string) => Promise<SessionData>;
    cue_resetStates: () => void;
    cue_onPressResetSession: () => Promise<void>;
    cue_removeInsight: (insightId: string) => void;
    cue_addInsight: (insight: Omit<CueInsight, 'createdAt'> & { createdAt?: number }) => void;
    cue_showNext: () => void;
    cue_setIsInsightsLayoutOpen: (isInsightsLayoutOpen: boolean) => void;
    cue_setHasReceivedFirstInsight: (hasReceivedFirstInsight: boolean) => void;
    cue_incrementUnseenInsightsCount: () => void;
    cue_resetUnseenInsightsCount: () => void;
}