interface Props {
    title: string;
    icon: React.ReactNode;
    description: string;
    children: React.ReactNode;
    rightContent?: React.ReactNode;
    isLoading: boolean;
}

export default function InformativeCard({ title, icon, description, children, rightContent, isLoading }: Props) {
    if (isLoading) {
        return (
            <div className="informative-card-container">
                <div className="informative-card-header">
                    <div className="informative-card-header-title">
                        <div className="informative-card-icon-skeleton" />
                        <div className="informative-card-title-skeleton" />
                    </div>
                    {rightContent && <div className="informative-card-right-content-skeleton" />}
                </div>

                <div className="informative-card-content-container">
                    <div className="informative-card-content-skeleton" />
                    <div className="informative-card-description-skeleton" />
                </div>
            </div>
        );
    }

    return (
        <div className="informative-card-container">
            <div className="informative-card-header">
                <div className="informative-card-header-title">
                    {icon}
                    <p>{title}</p>
                </div>

                {rightContent && rightContent}
            </div>

            <div className="informative-card-content-container">
                {children && children}

                <p className="informative-card-description">{description}</p>
            </div>
        </div>
    )
}