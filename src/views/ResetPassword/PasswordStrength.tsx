import clsx from 'clsx';
import { getPasswordStrength } from './getPasswordStrength';

interface Props {
    password: string;
}

const BAR_COUNT = 4;

export default function PasswordStrength({ password }: Props) {
    const { rules, score, level, label } = getPasswordStrength(password);

    return (
        <div className="resetCardStrength">
            <div className="resetCardStrengthHeader">
                <span className="resetCardStrengthTitle">Estimated strength</span>
                <span className={clsx('resetCardStrengthLabel', `resetCardStrengthLabel--${level}`)} aria-live="polite">
                    {label}
                </span>
            </div>
            <div className="resetCardStrengthBars" aria-hidden="true">
                {Array.from({ length: BAR_COUNT }, (_, index) => (
                    <span
                        key={index}
                        className={clsx(
                            'resetCardStrengthBar',
                            index < score && `resetCardStrengthBar--${level}`,
                        )}
                    />
                ))}
            </div>
            <ul className="resetCardRules">
                {rules.map(rule => (
                    <li key={rule.id} className="resetCardRule">
                        <span
                            className={clsx('resetCardRuleDot', rule.met && 'resetCardRuleDot--met')}
                            aria-hidden="true"
                        />
                        <span className="resetCardRuleText">
                            {rule.label}
                            <span className="resetCardSrOnly">{rule.met ? ' (met)' : ' (not met)'}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
