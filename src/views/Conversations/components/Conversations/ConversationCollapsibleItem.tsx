import { useState } from 'react';
import dayjs from 'dayjs';
import { PiCaretDown } from 'react-icons/pi';
import { SquarePen, UserPlus } from 'lucide-react';
import { ConversationItem } from '@/types/coach';
import type { CrmLead } from '@/hooks/integrations/crm/types';
import ConversationSignalsPill from './components/ConversationSignalsPill';
import LeadChip from './components/LeadChip';
import Avatar from './components/Avatar';
import ConversationTabs, { ConversationTab } from './components/ConversationTabs';
import CueTab from './components/tabs/CueTab';
import SmartCaptureTab from './components/tabs/SmartCaptureTab';
import PulseTab from './components/tabs/PulseTab';
import AddLeadDropdown from './components/AddLeadDropdown';
import useAttachConversationLead from './hooks/useAttachConversationLead';
import './styles/ConversationCollapsibleItem.css';
import useCrmConnection from '@/hooks/integrations/crm/useCrmConnection';
import ConversationPending from './ConversationPending';
import displayName from '@/views/Organization/shared/utils/displayName';

interface Props {
    conversation: ConversationItem;
    isOpen: boolean;
    isOwn: boolean;
    onToggle: () => void;
}

export default function ConversationCollapsibleItem({ conversation, isOpen, isOwn, onToggle }: Props) {
    const [activeTab, setActiveTab] = useState<ConversationTab>('Cue');
    const { attachLead } = useAttachConversationLead();
    const { isConnected } = useCrmConnection();

    const pulse = conversation.pulse ?? [];
    const time = dayjs(conversation.created_at).format('hh:mm a');
    const date = dayjs(conversation.created_at).format('ddd, MMM DD');
	const isPendingSummary = conversation.summary === 'Creating conversation summary';
    const ownerName = conversation.owner ? displayName(conversation.owner) : null;
    const canAssignLead = isOwn && isConnected;
    const hasLeadSection = canAssignLead || (!isOwn && !!conversation.crm_lead_name);

    return (
        <div className={`conv-item${isOpen ? ' conv-item-open' : ''}`}>
            <div
                className="conv-head"
                role="button"
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') ? onToggle() : undefined}
            >
                <div className="conv-time-col">
                    <span className="conv-date">{date}</span>
                    <span className="conv-time">{time}</span>
                </div>

                <div className="conv-main">
					{
						isPendingSummary 
							? (
								<ConversationPending/>
							) : (
								<div className={"conv-summary"}>{conversation.summary ?? 'No summary available.'}</div>
							)
					}
                    <div className="conv-meta">
                        <span className="conv-time-inline">{time} · {date}</span>
                        <span className="conv-meta-sep conv-meta-sep--after-time" />

                        {ownerName && (
                            <>
                                <span className="conv-client">
                                    <Avatar name={ownerName} />
                                    {ownerName}
                                </span>
                                {(conversation.lead_type || hasLeadSection) && <span className="conv-meta-sep" />}
                            </>
                        )}

                        {conversation.lead_type && <LeadChip type={conversation.lead_type} />}
                        {conversation.lead_type && hasLeadSection && <span className="conv-meta-sep" />}

                        {!isOwn && conversation.crm_lead_name && (
                            <span className="conv-client">
                                <Avatar name={conversation.crm_lead_name} />
                                {conversation.crm_lead_name}
                            </span>
                        )}

                        {canAssignLead && <AddLeadDropdown
                            currentLeadName={conversation.crm_lead_name}
                            trigger={conversation.crm_lead_name
                                ? (
                                    <button className="conv-client-btn">
                                        <Avatar name={conversation.crm_lead_name} />
                                        {conversation.crm_lead_name}
                                        <SquarePen size={11} className="conv-client-edit-icon" />
                                    </button>
                                ) : (
                                    <button className="conv-add-lead">
                                        <UserPlus size={13} />
                                        Add lead
                                    </button>
                                )
                            }
                            onSelect={(lead: CrmLead | null) => {
                                attachLead({ conversationId: conversation.id, lead });
                            }}
                        />}
                    </div>
                </div>

                <div className="conv-meter-wrapper">
                    <ConversationSignalsPill
                        smartCaptures={conversation.smart_captures ?? []}
                        pulse={pulse}
                        appointmentBooked={conversation.appointment_booked}
                    />
                </div>

                <span className="conv-toggle">
                    <PiCaretDown size={16} />
                </span>
            </div>

            {isOpen && (
                <div className="conv-body">
                    <ConversationTabs value={activeTab} onChange={setActiveTab} />
                    <div className="conv-tabbody">
                        {activeTab === 'Cue' && <CueTab insights={conversation.insights ?? []} canRate={isOwn} />}
                        {activeTab === 'Smart Capture' && <SmartCaptureTab smartCaptures={conversation.smart_captures ?? []} appointmentBooked={conversation.appointment_booked} />}
                        {activeTab === 'Pulse' && <PulseTab pulse={pulse} />}
                    </div>
                </div>
            )}
        </div>
    );
}
