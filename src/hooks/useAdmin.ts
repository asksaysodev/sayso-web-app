import { Signal } from '@/types/coach';
import apiClient from '../config/axios';

export const useAdmin = () => {

  const postCueSignals = async ( leadType: string, signals: Signal[] ): Promise<void> => {
    try {
      if(!leadType || !signals) {
        throw new Error('Lead type and signals are required');
      }
      console.log('📤 [useAdmin] Sending request to post cue signals:', { leadType, signalsCount: signals.length });
      const response = await apiClient.post('/support/cue/signals', { leadType, signals });
      console.log('✅ [useAdmin] Received response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [useAdmin] Error posting cue signals:', error);
      console.error('❌ [useAdmin] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to post cue signals';
      throw new Error(errorMessage);
    }
  };


  return {
    postCueSignals
  };
};

