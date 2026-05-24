import { supabase } from '../lib/supabase';

class StorageClient {
  /**
   * Upload a file to Supabase Storage
   * @param {string} bucketName - The storage bucket
   * @param {string} filePath - Path inside the bucket
   * @param {File} file - The file object to upload
   * @returns {Promise<Object>} Object containing the public URL and any error
   */
  async uploadFile(bucketName, filePath, file) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrlData.publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Download a file from Supabase Storage
   * @param {string} bucketName 
   * @param {string} filePath 
   */
  async downloadFile(bucketName, filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(filePath);

      if (error) {
        throw error;
      }
      return { success: true, data };
    } catch (error) {
      console.error('Storage download error:', error);
      return { success: false, error: error.message };
    }
  }
}

const storageClient = new StorageClient();
export default storageClient;
