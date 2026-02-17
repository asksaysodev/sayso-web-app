import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    fieldName: string;
    useDefaultDivWrapper?: boolean;
}

export default function SignalCardField({ fieldName, children, useDefaultDivWrapper = true }: Props) {
    return (
        <div className='signal-card-field'>
            <label htmlFor={fieldName}>{fieldName}</label>

            {useDefaultDivWrapper 
                ? <div className='signal-text-field'>
                    {children}
                </div> 
                : children
            }
        </div>
    )
}