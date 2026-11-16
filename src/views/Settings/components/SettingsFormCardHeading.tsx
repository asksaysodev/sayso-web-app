interface Props {
    title: string;
    description: string;
}

/** Title + description at the top of a settings form card (Figma 1090:3898). */
export default function SettingsFormCardHeading({ title, description }: Props) {
    return (
        <div className='settings-form-card__heading'>
            <h2 className='settings-form-card__title'>{title}</h2>
            <p className='settings-form-card__description'>{description}</p>
        </div>
    );
}
