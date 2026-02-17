import '../styles/SlackButton.css';
import { useAuth } from '../context/AuthContext';
import { useSlack } from '../hooks/useSlack';
import {SiSlack} from 'react-icons/si'
import { openExternal } from '../utils/helpers/openExternal';

const ConnectSlackButton = () => {
  const { globalUser, updateGlobalUser } = useAuth();
  const { disconnectSlack, connectSlack } = useSlack();


  const handleConnect = async () => {

    if(!globalUser) {
      return;
    }

    if(globalUser?.slack_connected) {
      await disconnectSlack(globalUser?.id);
      updateGlobalUser(globalUser?.email);
    } else {
      const authUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/slack/auth/${globalUser?.id}`;
      openExternal(authUrl);
    }

  };

  return (
    <button onClick={handleConnect} className={`slack-button ${globalUser?.slack_connected ? 'connected' : ''}`} disabled={!globalUser}>
      <SiSlack style={{marginRight: '10px'}} />
      <span>{
        globalUser?.slack_connected ? 'Disconnect Slack' : 'Connect Slack'
      }</span>
    </button>
  );
};

export default ConnectSlackButton;
