import { Account, Company, CreateAccountData, UpdateAccountData } from '@/types/user';
import apiClient from '../config/axios';

export const useAccounts = () => {

  const createAccount = async ( accountData: CreateAccountData ): Promise<Account> => {
    try {
      const response = await apiClient.post('/accounts/create', { accountData });
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
      console.error('Error in updateProspect:', error);
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

  return {
    createAccount,
    getAccount,
    updateAccount,
    getCompanyById
  };
};