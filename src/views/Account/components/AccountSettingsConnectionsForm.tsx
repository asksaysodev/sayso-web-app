import { useState, useEffect } from 'react';

import { LuLoader } from 'react-icons/lu';

import slackIcon from '/assets/slack-icon.png';
import { useAuth } from '../../../context/AuthContext';
import { useSlack } from '../../../hooks/useSlack';
import { useToast } from '../../../context/ToastContext';
import { openExternal } from '@/utils/helpers/openExternal';

export default function AccountSettingsConnectionsForm() {

    //STATE
    const [slackConnected, setSlackConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //HOOKS
    const { globalUser, updateGlobalUser } = useAuth();
    const { disconnectSlack } = useSlack();
    const { showToast } = useToast();


    const handleConnectSlackClick = async () => {
    
        if(!globalUser) {
          return;
        }
    
        if(globalUser?.slack_connected) {
          setIsLoading(true);
          await disconnectSlack(globalUser?.id);
          setSlackConnected(false);
          setIsLoading(false);
          updateGlobalUser(globalUser?.email); 
          showToast('success', 'Slack disconnected successfully!');
          
        } else {
          const authUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/slack/auth/${globalUser?.id}`;
          
          try {
            openExternal(authUrl);
          } catch (error) {
            console.error('❌ [ConnectSlackButton] Error calling openExternal:', error);
            window.location.href = authUrl;
          }
        }
      };

    //EFFECTS
    useEffect(() => {
        setSlackConnected(globalUser?.slack_connected || false); 
    }, [globalUser]);

    return (
        <div className='account-settings-connections-container'>
            <div className='account-settings-connections-item-container'>
                <div className='account-settings-connections-item-header'>
                    <div className="account-settings-connections-item-header-icon">
                        <img src={slackIcon} alt="Slack Logo" />
                    </div>
                    <h2>Slack</h2>
                </div>
                <div className='account-settings-connections-item-content'>
                    <p>Get call summaries directly to your Slack channel.</p>
                </div>
                <div className='account-settings-connections-buttons'>
                    <button onClick={() => handleConnectSlackClick()} className={`${slackConnected ? 'connected' : ''}`}>
                        {slackConnected ? 'Disconnect Account' : 'Connect Account'}
                        {isLoading && <LuLoader className='loading-icon' /> }
                    </button>
                </div>
            </div>
        </div>
    )
}