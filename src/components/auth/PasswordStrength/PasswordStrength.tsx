import clsx from 'clsx';
import { getPasswordStrength } from './getPasswordStrength';
import './PasswordStrength.css';

interface Props {
    password: string;
}

const BAR_COUNT = 4;

export default function PasswordStrength({ password }: Props) {
    const { rules, score, level, label } = getPasswordStrength(password);

    return (
        <div className="passwordStrength">
            <div className="passwordStrengthHeader">
                <span className="passwordStrengthTitle">Estimated strength</span>
                <span className={clsx('passwordStrengthLabel', `passwordStrengthLabel--${level}`)} aria-live="polite">
                    {label}
                </span>
            </div>
            <div className="passwordStrengthBars" aria-hidden="true">
                {Array.from({ length: BAR_COUNT }, (_, index) => (
                    <span
                        key={index}
                        className={clsx(
                            'passwordStrengthBar',
                            index < score && `passwordStrengthBar--${level}`,
                        )}
                    />
                ))}
            </div>
            <ul className="passwordStrengthRules">
                {rules.map(rule => (
                    <li key={rule.id} className="passwordStrengthRule">
                        <span
                            className={clsx('passwordStrengthRuleDot', rule.met && 'passwordStrengthRuleDot--met')}
                            aria-hidden="true"
                        />
                        <span className="passwordStrengthRuleText">
                            {rule.label}
                            <span className="passwordStrengthSrOnly">{rule.met ? ' (met)' : ' (not met)'}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
