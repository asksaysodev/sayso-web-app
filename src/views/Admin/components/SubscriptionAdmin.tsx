import { useState } from 'react';
import { LuBadgeAlert } from 'react-icons/lu';
import SaysoButton from '@/components/SaysoButton';
import SaysoModal from '@/components/SaysoModal';
import SettingItem from '@/components/SettingItem';
import { useMutation } from '@tanstack/react-query';
import resetAccountSubscription from '../services/resetAccountSubscription';
import useHasSubscription from '@/hooks/useHasSubscription';
import { useAuth } from '@/context/AuthContext';

export default function SubscriptionAdmin() {
    const [showResetModal, setShowResetModal] = useState(false);
    const hasSubscription = useHasSubscription();
    const { globalUser, updateGlobalUser } = useAuth();

    const { mutate: resetSubscription, isPending, isError } = useMutation({
        mutationFn: resetAccountSubscription,
        mutationKey: ['reset-account-subscription'],
        onSuccess: async () => {
            setShowResetModal(false);
            if (globalUser?.email) await updateGlobalUser(globalUser.email);
        }
    })
    
    const onConfirmResetSubscription = () => {
        if (isPending ||isError) return;
        resetSubscription();
    }
    
    return (
        <div className='subscription-admin-container'>
            <div className='subscription-admin-card danger'>
                <div className='subscription-admin-card-header danger'>
                    <LuBadgeAlert size={16} />
                    <h3>Danger Zone</h3>
                </div>
                <SettingItem
                    title='Reset Subscription'
                    description='Permanently deletes subscription data from this account. The user will lose access immediately and will need to re-subscribe. This action cannot be undone.'
                    rightContent={
                        <SaysoButton
                            disabled={!hasSubscription}
                            label='Reset'
                            variant='error'
                            onClick={() => setShowResetModal(true)}
                        />
                    }
                />
            </div>

            {showResetModal && (
                <SaysoModal
                    title='Reset subscription?'
                    text='Delete subscription data from this account.'
                    isDelete
                    primaryText='Reset subscription'
                    secondaryText='Cancel'
                    onDeny={() => setShowResetModal(false)}
                    onConfirm={onConfirmResetSubscription}
                    isLoading={isPending}
                />
            )}
        </div>
    );
}
