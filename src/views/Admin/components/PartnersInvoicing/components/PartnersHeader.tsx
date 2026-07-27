import '../styles/PartnersHeader.css';

interface Props {
    count?: number;
}

export default function PartnersHeader({ count }: Props) {
    return (
        <div className="partners-header">
            <h2 className="partners-header__title">Partners</h2>
            {count !== undefined && (
                <span className="partners-header__count">
                    {count} {count === 1 ? 'partner' : 'partners'}
                </span>
            )}
        </div>
    );
}
