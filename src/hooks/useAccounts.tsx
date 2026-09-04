import { Account, Company, SignupData, UpdateAccountData } from '@/types/user';
import apiClient from '../config/axios';

export const useAccounts = () => {

  /**
   * Creates the auth user and the domain rows in one server-side call (SAYSO-387).
   *
   * Unauthenticated: this runs before any session exists, which is the point — the server
   * sets company_id in app_metadata at creation, so the first token the caller receives
   * from signInWithPassword already carries the claim. No refresh, no second round trip.
   *
   * Does NOT sign the user in. The caller does that afterwards.
   */
  const signup = async (data: SignupData): Promise<{ id: string; email: string; role: string; company_id: string }> => {
    const response = await apiClient.post('/accounts/signup', data);
    return response.data.data;
  };

  const getAccount = async (email: string): Promise<Account> => {
    try {
      const response = await apiClient.get(`/accounts/${email}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting account:', error);
      throw error;
    }
  };

  const updateAccount = async (updateData: UpdateAccountData): Promise<void> => {
    try {
      if(!updateData) {
        throw new Error('Update data is required');
      }
      await apiClient.put(`/accounts/update-account`, { updateData });
      return
    } catch (error) {   
      console.error('Error in updateAccount:', error);
      throw error;
    }

  } 

  const getCompanyById = async (companyId: string): Promise<Company> => {
    try {
      const response = await apiClient.get(`/accounts/company/${companyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting company:', error);
      throw error;
    }
  }

  const updateCompany = async (updateData: Record<string, string | null>): Promise<void> => {
    try {
      if (!updateData) {
        throw new Error('Update data is required');
      }
      await apiClient.put('/companies/update', { updateData });
    } catch (error) {
      console.error('Error in updateCompany:', error);
      throw error;
    }
  };

  return {
    signup,
    getAccount,
    updateAccount,
    updateCompany,
    getCompanyById
  };
};