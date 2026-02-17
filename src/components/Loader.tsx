import React from 'react';
import '../styles/Loader.css';

interface Props {
  message?: string;
}

const Loader = ({ message = 'Sayso' }: Props) => {
  return (
    <div className="loaderView">
      <div className="loadingContainer">
        <div className="loader"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loader; 