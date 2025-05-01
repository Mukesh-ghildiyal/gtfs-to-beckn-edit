import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface GTFSFile {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  size: string;
}

export const gtfsService = {
  async getFiles(): Promise<GTFSFile[]> {
    const response = await axios.get(`${API_BASE_URL}/gtfs/files`);
    return response.data;
  },

  async updateFile(fileId: string, data: Partial<GTFSFile>): Promise<GTFSFile> {
    const response = await axios.put(`${API_BASE_URL}/gtfs/files/${fileId}`, data);
    return response.data;
  },

  async deleteFile(fileId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/gtfs/files/${fileId}`);
  },

  async uploadFile(file: File): Promise<GTFSFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/gtfs/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async validateFile(file: File): Promise<{ isValid: boolean; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/gtfs/files/validate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 