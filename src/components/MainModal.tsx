import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MainModal.css';
import Loader from './Loader';

interface Props {
  title: string;
  text: string;
  actionButtons?: React.ReactNode;
  onDeny: () => void;
  onConfirm: () => void;
  isModalLoading?: boolean;
}

const MainModal = ({
  title,
  text,
  actionButtons,
  onDeny,
  onConfirm,
  isModalLoading
}: Props) => {
  return (
    <div className="mainModal">
      <div className="mainModalContainer">
        {isModalLoading ? (
          <div className="modalLoader">
            <Loader />
          </div>
        ) : (
          <>
            <div className="modalHeader">
              <h2>{title}</h2>
            </div>
            <div className="modalContent">
              <p>{text}</p>
            </div>
            <div className="modalActions">
              {actionButtons ? (
                actionButtons
              ) : (
                <>
                  <button 
                    className="modalBtn denyBtn" 
                    onClick={onDeny}
                  >
                    Cancel
                  </button>
                  <button 
                    className="modalBtn confirmBtn" 
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

MainModal.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  actionButtons: PropTypes.node,
  onDeny: PropTypes.func,
  onConfirm: PropTypes.func,
  isModalLoading: PropTypes.bool
};

MainModal.defaultProps = {
  actionButtons: null,
  onDeny: () => {},
  onConfirm: () => {},
  isModalLoading: false
};

export default MainModal; 