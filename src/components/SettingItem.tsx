interface Props {
    icon?: React.ReactNode;
    title: string;
    description: string;
    rightContent?: React.ReactNode;
}

export default function SettingItem({ icon, title, description, rightContent }: Props) {
    return (
        <div className='w-full flex items-center gap-10 py-5 border-b border-[var(--sayso-border)] last:border-b-0 max-md:flex-col max-md:items-start max-md:gap-4'>
            {icon && (
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[var(--sayso-border)] text-[var(--sayso-darkgray)] shrink-0'>
                    {icon}
                </div>
            )}
            <div className='flex-1 flex flex-col gap-1 text-left'>
                <h3 className='text-[15px] font-medium text-[var(--sayso-dark)] m-0'>{title}</h3>
                <p className='text-sm leading-relaxed text-[var(--sayso-lightgray)] m-0'>{description}</p>
            </div>
            {rightContent && rightContent}
        </div>
    );
}
