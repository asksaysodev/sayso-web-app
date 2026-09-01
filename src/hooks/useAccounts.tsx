import { Account, Company, CreateAccountData, UpdateAccountData } from '@/types/user';
import apiClient from '../config/axios';
import { supabase } from '@/config/supabase';

export const useAccounts = () => {

  const createAccount = async ( accountData: CreateAccountData ): Promise<Account> => {
    try {
      const response = await apiClient.post('/accounts/create', { accountData });

      // The access token was minted at sign-up, before the account existed and before the
      // server wrote the company_id claim into app_metadata. Refresh so the session that
      // continues into the dashboard actually carries it — otherwise the user holds a
      // claimless token until it happens to expire, and looks correctly signed in while
      // being invisible to any policy scoped on that claim.
      //
      // Non-fatal: the account is already created, and the next natural refresh picks the
      // claim up. Failing the signup here would be worse than a delayed claim.
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Error refreshing session after account creation:', refreshError);
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
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
    createAccount,
    getAccount,
    updateAccount,
    updateCompany,
    getCompanyById
  };
};