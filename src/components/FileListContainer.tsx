import React from 'react';

interface Props {
  files: any[];
  onRemoveFile: (id: string) => void;
  title?: string;
  isEditing: boolean;
}

const FileListContainer = ({ files, onRemoveFile, title = "Selected Files:", isEditing }: Props) => {
  if (!files || files.length === 0) return null;

  return (
    <div 
      className="selected-files" 
      style={{ 
        margin: '20px 0', 
        color: 'var(--blue0)', 
        border: '1px solid var(--gray3)', 
        borderRadius: '6px', 
        padding: '10px', 
        backgroundColor: 'white',
        width: '100%'
      }}
    >
      <h3 style={{ 
        textAlign: 'left', 
        marginBottom: '10px',
        fontSize: '0.95rem',
        fontWeight: '500'
      }}>{title}</h3>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        margin: 0,
        width: '100%'
      }}>
        {files.map((file, idx) => (
          <li key={idx} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '6px',
            width: '100%'
          }}>
            <span style={{ 
              marginRight: '10px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '90%',
              textAlign: 'left'
            }}>- {file.file_name || file.name}</span>
            {onRemoveFile && isEditing && (
              <button 
                type="button" 
                onClick={() => onRemoveFile(file.id)} 
                style={{ 
                  color: '#ff4444', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1.1rem',
                  flexShrink: 0,
                  padding: '0 5px'
                }}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileListContainer; 