import apiClient from '../config/axios';

export interface StoredFile {
  id: string;
  type: string;
  parent_id: string;
  file_path: string;
  file_size: number;
  file_name: string;
  file_type: string;
  account_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface FetchFilesResponse {
  files: StoredFile[];
}

export const useFiles = () => {


  const handleParseFile = async (fileSignedUrl: string, originalFileId: string, folderId: string): Promise<void> => {
    try {
      const response = await apiClient.post('/files/parse/' + folderId, {
        file_url: fileSignedUrl,
        original_file_id: originalFileId
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in handleParseFile:', error);
      throw error;
    }
  };

  const uploadFile = async (file: File, type: string, parentId: string): Promise<StoredFile> => {
    if(!file) {
      console.error('No file provided');
      throw new Error('No file provided');
    }

    if(!type) {
      console.error('No type provided');
      throw new Error('No type provided');
    }

    if(!parentId) {
      console.error('No parentId provided');
      throw new Error('No parentId provided');
    }

    try {
      // Create FormData instance
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('parent_id', parentId);

      const response = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const handleUploadFiles = async (files: File[], type: string, parentId: string): Promise<StoredFile[]> => {
    if(!files || files.length === 0) {
      console.error('No files provided');
      return [];
    }

    if(!type) {
      console.error('No type provided');
      return [];
    }

    if(!parentId) {
      console.error('No parentId provided');
      return [];
    }

    const uploadedFiles: StoredFile[] = [];

    for (const file of files) {
      try {
        // Create FormData instance
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('parent_id', parentId);

        const response = await apiClient.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        uploadedFiles.push(response.data);

      } catch (error) {
        console.error('Error in handleUploadFile:', error);
        throw error;
      }
    }

    return uploadedFiles;
  };

  const fetchFiles = async (parentId: string): Promise<FetchFilesResponse> => {
    const response = await apiClient.get('/files/fetch/' + parentId);
    return response.data;
  }

  const removeFile = async (fileId: string): Promise<void> => {
    const response = await apiClient.delete('/files/remove/' + fileId);
    return response.data;
  }

  return {
    handleParseFile,
    uploadFile,
    handleUploadFiles,
    fetchFiles,
    removeFile
  };
}; 