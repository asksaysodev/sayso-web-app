import { useState } from 'react';
import dayjs from 'dayjs';
import { LuPlus, LuMinus, LuMapPin } from 'react-icons/lu';
import { ConversationItem } from '@/types/coach';
import type { CrmLead } from '@/hooks/integrations/crm/types';
import LpmamaMeter from './components/LpmamaMeter';
import LeadChip from './components/LeadChip';
import Avatar from './components/Avatar';
import ConversationTabs, { ConversationTab } from './components/ConversationTabs';
import CueTab from './components/tabs/CueTab';
import SmartCaptureTab from './components/tabs/SmartCaptureTab';
import PulseTab from './components/tabs/PulseTab';
import AddLeadDropdown from './components/AddLeadDropdown';
import useAttachConversationLead from './hooks/useAttachConversationLead';
import './styles/ConversationCollapsibleItem.css';
import { SquarePen, UserPlus } from 'lucide-react';

interface Props {
    conversation: ConversationItem;
    isOpen: boolean;
    onToggle: () => void;
}

export default function ConversationCollapsibleItem({ conversation, isOpen, onToggle }: Props) {
    const [activeTab, setActiveTab] = useState<ConversationTab>('Cue');
    const { attachLead } = useAttachConversationLead();

    const pulse = conversation.pulse ?? [];
    const city = pulse[0]?.city;

    return (
        <div className={`conv-item${isOpen ? ' conv-item-open' : ''}`}>
            <div
                className="conv-head"
                role="button"
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? onToggle() : undefined}
            >
                <div className="conv-time-col">
                    <span className="conv-time">{dayjs(conversation.created_at).format('h:mm A')}</span>
                    <span className="conv-date">{dayjs(conversation.created_at).format('ddd, MMM D')}</span>
                </div>

                <div className="conv-main">
                    <div className="conv-summary">{conversation.summary ?? 'No summary available.'}</div>
                    <div className="conv-meta">
                        {conversation.lead_type && <LeadChip type={conversation.lead_type} />}
                        {conversation.lead_type && <span className="conv-meta-sep" />}

                        <AddLeadDropdown
                            currentLeadName={conversation.crm_lead_name}
                            trigger={conversation.crm_lead_name
                                ? (
                                    <button className="conv-client-btn">
                                        <Avatar name={conversation.crm_lead_name} />
                                        {conversation.crm_lead_name}
                                        <SquarePen size={11} className='conv-client-edit-icon'/>
                                    </button>
                                ) : (
                                    <button className="conv-add-lead">
                                        <UserPlus size={13}/>
                                        Add lead
                                    </button>
                                )
                            }
                            onSelect={(lead: CrmLead | null) => {
                                attachLead({ conversationId: conversation.id, lead });
                            }}
                        />

                        {city && (
                            <>
                                <span className="conv-meta-sep" />
                                <span className="conv-market">
                                    <LuMapPin size={13} />
                                    {city}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="conv-right">
                    <LpmamaMeter smartCaptures={conversation.smart_captures ?? []} />
                    <span className="conv-toggle">
                        {isOpen ? <LuMinus size={17} /> : <LuPlus size={17} />}
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="conv-body">
                    <ConversationTabs value={activeTab} onChange={setActiveTab} />
                    <div className="conv-tabbody">
                        {activeTab === 'Cue'           && <CueTab insights={conversation.insights ?? []} />}
                        {activeTab === 'Smart Capture' && <SmartCaptureTab smartCaptures={conversation.smart_captures ?? []} />}
                        {activeTab === 'Pulse'         && <PulseTab pulse={pulse} />}
                    </div>
                </div>
            )}
        </div>
    );
}
