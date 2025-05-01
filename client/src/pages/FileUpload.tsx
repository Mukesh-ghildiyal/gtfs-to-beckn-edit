import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { gtfsService } from '../services/gtfsService';

interface UploadedFile {
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: file.size,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    for (const file of acceptedFiles) {
      try {
        // First validate the file
        const validationResult = await gtfsService.validateFile(file);
        if (!validationResult.isValid) {
          throw new Error(validationResult.errors.join(', '));
        }

        // Then upload the file
        await gtfsService.uploadFile(file);
        
        setUploadedFiles(prev => {
          const updated = [...prev];
          const fileIndex = prev.findIndex(f => f.name === file.name);
          if (fileIndex !== -1) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              status: 'success',
            };
          }
          return updated;
        });
      } catch (error) {
        setUploadedFiles(prev => {
          const updated = [...prev];
          const fileIndex = prev.findIndex(f => f.name === file.name);
          if (fileIndex !== -1) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed',
            };
          }
          return updated;
        });
        setSnackbar({
          open: true,
          message: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.txt'],
    },
  });

  const handleRemove = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload GTFS Files
      </Typography>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop GTFS files here, or click to select files
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: .txt (CSV)
        </Typography>
      </Paper>

      {uploadedFiles.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files
          </Typography>
          <List>
            {uploadedFiles.map((file) => (
              <ListItem
                key={file.name}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemove(file.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {file.status === 'uploading' ? (
                    <CircularProgress size={24} />
                  ) : file.status === 'success' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${formatFileSize(file.size)} - ${
                    file.status === 'uploading'
                      ? 'Uploading...'
                      : file.status === 'success'
                      ? 'Uploaded successfully'
                      : `Upload failed: ${file.error}`
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload; 