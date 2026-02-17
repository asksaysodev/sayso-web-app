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
  color: var(--blue0);
  cursor: ${({ $isLoading }) => $isLoading ? 'not-allowed' : 'pointer'};
  border: none;
  border-radius: 6px;
  text-align: center;
  transition: all 0.2s ease-in-out;
  width: 100%;
  height: 40px;
  opacity: 0.7;
  font-weight: 500;
  position: relative;
  z-index: 1;
  font-size: 0.95rem;
  text-align: left;

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BtnMain = ({ text, onClick, type = 'button', isDisabled = false, isLoading = false }: Props) => {
  return (
    <StyledButton 
      onClick={onClick} 
      type={type} 
      disabled={isLoading} 
      $isLoading={isLoading}
    >
      {isLoading ? "Loading..." : text}
    </StyledButton>
  );
};

export default BtnMain; 