import React from 'react';
import styled from 'styled-components';

interface Props {
  text: string;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  isDisabled?: boolean;
  isLoading?: boolean;
}

const StyledButton = styled.button<{ $isLoading: boolean }>`
  background: none;
  color: var(--blue1);
  cursor: ${({ $isLoading }) => $isLoading ? 'not-allowed' : 'pointer'};
  border: 1px solid var(--blue1); 
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s ease-in-out;
  width: 100%;
  height: 40px;
  opacity: ${({ $isLoading }) => ($isLoading ? '0.7' : '1')};
  position: relative;
  z-index: 1;
  font-size: 0.95rem;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BtnSecondary = ({ text, onClick, type = 'button', isDisabled = false, isLoading = false, style = {} }: Props) => {
  return (
    <StyledButton 
      onClick={onClick} 
      type={type} 
      disabled={isLoading} 
      $isLoading={isLoading}
      style={style}
    >
      {isLoading ? "Loading..." : text}
    </StyledButton>
  );
};

export default BtnSecondary; 