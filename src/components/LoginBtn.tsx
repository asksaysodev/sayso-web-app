import { LuLoader } from 'react-icons/lu';
import '../styles/Buttons.css';

interface Props {
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isDelete?: boolean;
  isSecondary?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const LoginBtn = ({ text, onClick, isDisabled = false, isLoading = false, isDelete = false, isSecondary = false, type = 'button' }: Props) => {
  return (
    <button 
      type={type}
      className={`login-primary-button ${isLoading ? 'loading' : '' } ${isDelete ? 'delete' : ''} ${isSecondary ? 'secondary' : ''}`} 
      onClick={onClick ? onClick : undefined} 
      disabled={isDisabled}
      data-loading={isLoading}>
        <p>{text}</p>
        {isLoading && (
          <div className="button-loader">
            <LuLoader />
          </div>
        )}
    </button>
  );
};

export default LoginBtn; 