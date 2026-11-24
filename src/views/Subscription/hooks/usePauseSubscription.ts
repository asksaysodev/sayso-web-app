import pauseSubscription from '../services/pauseSubscription';
import type { PauseOption } from '../types';
import useRetentionAction from './useRetentionAction';

export default function usePauseSubscription() {
    return useRetentionAction({
        operation: 'pauseSubscription',
        request: (option: PauseOption) => pauseSubscription(option),
        isUpdated: (subscription) => subscription.pause.state !== 'none',
        alreadyDone: {
            code: 'already_paused',
            toResult: ({ startsAt, resumesAt, priceOnReturn }) => ({ pauseStartsAt: startsAt, resumesAt, priceOnReturn }),
        },
    });
}
