import React, { useState } from 'react';
import { LuUpload } from 'react-icons/lu';
import '../styles/NewFileInput.css';

interface Props {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

const NewFileInput = ({ 
  id, 
  onChange, 
  accept = ".docx,.pdf,.txt,.doc",
  disabled = false,
  className = ''
}: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if we're leaving the container entirely
    if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    
    // Validate file types
    const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
    const validFiles = files.filter(file => {
      const fileExtension = '.' + (file?.name.split('.').pop() ?? '').toLowerCase();
      return acceptedTypes.includes(fileExtension);
    });

    if (validFiles.length > 0) {
      // Create a synthetic event object that matches the onChange signature
      const syntheticEvent = {
        target: {
          files: validFiles,
          value: validFiles.map(f => f.name).join(', ')
        }
      };
      onChange(syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div 
      className={`new-file-input-container ${isDragOver ? 'drag-over' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={id}
        onChange={onChange}
        className="customFileInput"
        style={{ display: 'none' }}
        accept={accept}
        disabled={disabled}
      />
      <label htmlFor={id} className="customFileLabel" style={{margin:'0', cursor: 'pointer'}}>
        <LuUpload />
        <p><span>Click to upload</span> or drag and drop</p>
        <p>.docx, .pdf, .txt, .doc files (max 300mb)</p>
      </label>
    </div>
  );
};

export default NewFileInput;