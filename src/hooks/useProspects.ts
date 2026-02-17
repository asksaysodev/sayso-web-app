import apiClient from '../config/axios';
import * as Sentry from "@sentry/react";

import { useFiles } from './useFiles';
import { Prospect } from '@/types/coach';

export const useProspects = () => {

  const { handleUploadFiles } = useFiles();

  const handleNewProspect = async (prospect: Prospect): Promise<Prospect> => {

    const prospectData: Prospect = {
      id: crypto.randomUUID(),
      name: prospect.name,
      lastname: prospect.lastname,
      email: prospect.email,
      company: prospect.company
    }

    const newProspect = await createProspect(prospectData);
    if(prospect.files && prospect.files.length > 0) {
      await handleUploadFiles(prospect.files, 'prospect-files', newProspect.id);
      
    }
    return newProspect;
  };

  const createProspect = async (prospect: Prospect): Promise<Prospect> => {
    try {
      const response = await apiClient.post('/prospects/create', { prospect });
      return response.data.data;
    } catch (error) {
      console.error('Error creating prospect:', error);
      Sentry.captureException(error);
      throw error;
    }

  };

  const getAccountProspects = async (): Promise<Prospect[]> => {
    try {
      const response = await apiClient.get('/prospects/account-prospects');
      return response.data.data;
    } catch (error) {
      console.error('Error getting account prospects:', error);
      Sentry.captureException(error);
      throw error;
    }
  };

  const getProspect = async ( prospectId: string ): Promise<Prospect> => {
    try {
      const response = await apiClient.get(`/prospects/${prospectId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting prospect:', error);
      Sentry.captureException(error);
      throw error;
    }
  };

  const saveProspectMeeting = async (prospectId: string, meetingId: string, meetingTopic: string, meetingStartTime: string): Promise<void> => {

    if(!meetingId || !meetingTopic || !meetingStartTime) {
      throw new Error('Meeting ID, topic, and start time are required');
    }

    const data = {
      next_meeting_id: meetingId,
      next_meeting_topic: meetingTopic,
      next_meeting_start_time: meetingStartTime
    }

    try {
      const response = await apiClient.post(`/prospects/save-meeting/${prospectId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error saving prospect meeting:', error);
      Sentry.captureException(error);
      throw error;
    }

  }

  const removeZoomMeeting = async (prospectId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/prospects/remove-zoom-meeting/${prospectId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing zoom meeting:', error);
      Sentry.captureException(error);
      throw error;
    }

  } 

  const updateProspect = async (prospectId: string, updateData: any): Promise<void> => { // $FixTS
    try {
      if(!prospectId || !updateData) {
        throw new Error('Prospect ID and updateData are required');
      }
      await apiClient.put(`/prospects/update-prospect/${prospectId}`, { updateData });
      return
    } catch (error) {
      console.error('Error in updateProspect:', error);
      Sentry.captureException(error);
      throw error;
    }

  } 

  const deleteProspect = async (prospectId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/prospects/delete-prospect/${prospectId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting prospect:', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  return {
    handleNewProspect,
    createProspect,
    getAccountProspects,
    getProspect,
    saveProspectMeeting,
    removeZoomMeeting,
    updateProspect,
    deleteProspect
  };
};
    