import React from 'react';
import '../styles/FileInput.css';

interface Props {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
}
const FileInput = ({ 
  id, 
  onChange, 
  label = "Choose File",
  accept,
  disabled = false,
  className = ''
}: Props) => {
  return (
    <div className={`customFileInputWrapper ${className}`}> 
      <input
        type="file"
        id={id}
        onChange={onChange}
        className="customFileInput"
        style={{ display: 'none' }}
        accept={accept}
        disabled={disabled}
      />
      <label htmlFor={id} className="customFileLabel" style={{margin:'0'}}>
        {label}
      </label>
    </div>
  );
};

export default FileInput; 