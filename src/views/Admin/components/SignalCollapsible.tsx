import { Signal } from "../types";
import { LuChevronDown, LuChevronRight } from 'react-icons/lu';
import SignalCardField from './SignalCardField';

interface Props {
    signal: Signal;
    isExpanded: boolean;
    handleExpandSignal: (id: string) => void;
}

export default function SignalCollapsible({ signal, isExpanded = false, handleExpandSignal }: Props) {
    const formatSignalName = (name: string) => name.replace(/_/g, ' ');

    return (
        <div className={`signal-collapsible ${isExpanded ? 'expanded' : ''}`} onClick={() => handleExpandSignal(signal.id)}>
            <div className='signal-collapsible-header'>
                <div className='signal-collapsible-header-left'>
                    {isExpanded ? <LuChevronDown size={18} color='var(--sayso-indigo)' /> : <LuChevronRight size={18} color='var(--sayso-lightgray)' />}
                    <h3>{formatSignalName(signal.name)}</h3>
                    {/* <h3>{signal.name}</h3> */}
                </div>
                <span>{signal.lead_type}</span>
            </div>

            <div
                className={`signal-collapsible-content ${isExpanded ? 'expanded' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='signal-collapsible-content-fields'>
                    <SignalCardField fieldName='Description'>
                        <p>{signal.description}</p>
                    </SignalCardField>
                    <SignalCardField fieldName='Instruction'>
                        <p>{signal.instructions}</p>
                    </SignalCardField>
                    {signal.stage_fit && (
                        <SignalCardField fieldName='Stage Fit' useDefaultDivWrapper={false}>
                            <div className='stage-fit-badges'>
                                {Object.entries(signal.stage_fit).map(([stage, value]) => (
                                    <span key={stage} className='stage-fit-badge'>
                                        <span className='stage-fit-label'>{stage}:</span>
                                        <span className='stage-fit-value'>{value}</span>
                                    </span>
                                ))}
                            </div>
                        </SignalCardField>
                    )}
                    {signal.stage_instructions && (
                        <SignalCardField fieldName='Stage-specific Instructions'>
                            <div className='stage-descriptions'>
                                {Object.entries(signal.stage_instructions).map(([stage, text]) => (
                                    <p key={stage} className='stage-description-item'>
                                        <strong>{stage.charAt(0).toUpperCase() + stage.slice(1)}:</strong> {text}
                                    </p>
                                ))}
                            </div>
                        </SignalCardField>
                    )}
                </div>
            </div>
        </div>
    )
}
