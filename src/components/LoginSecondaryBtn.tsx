import { LuLoader } from 'react-icons/lu';
import '../styles/Buttons.css';

interface Props {
  text: string;
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isDelete?: boolean;
}

const LoginSecondaryBtn = ({ text, onClick, isDisabled = false, isLoading = false, isDelete = false }: Props) => {
  return (
    <button 
      className={`main-primary-button ${isLoading ? 'loading' : '' } ${isDelete ? 'delete' : ''}`} 
      onClick={onClick} 
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

export default LoginSecondaryBtn; 