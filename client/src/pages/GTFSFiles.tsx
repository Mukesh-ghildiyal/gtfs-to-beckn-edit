import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { gtfsService, GTFSFile } from '../services/gtfsService';

const GTFSFiles: React.FC = () => {
  const [files, setFiles] = useState<GTFSFile[]>([]);
  const [editingFile, setEditingFile] = useState<GTFSFile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<GTFSFile | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await gtfsService.getFiles();
      setFiles(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load files',
        severity: 'error',
      });
    }
  };

  const handleEdit = (file: GTFSFile) => {
    setEditingFile(file);
  };

  const handleSave = async () => {
    if (editingFile) {
      try {
        const updatedFile = await gtfsService.updateFile(editingFile.id, editingFile);
        setFiles(files.map(f => f.id === updatedFile.id ? updatedFile : f));
        setEditingFile(null);
        setSnackbar({
          open: true,
          message: 'File updated successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to update file',
          severity: 'error',
        });
      }
    }
  };

  const handleCancel = () => {
    setEditingFile(null);
  };

  const handleDelete = (file: GTFSFile) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      try {
        await gtfsService.deleteFile(fileToDelete.id);
        setFiles(files.filter(f => f.id !== fileToDelete.id));
        setDeleteDialogOpen(false);
        setFileToDelete(null);
        setSnackbar({
          open: true,
          message: 'File deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete file',
          severity: 'error',
        });
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        GTFS Files Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  {editingFile?.id === file.id ? (
                    <TextField
                      value={editingFile.name}
                      onChange={(e) =>
                        setEditingFile({ ...editingFile, name: e.target.value })
                      }
                    />
                  ) : (
                    file.name
                  )}
                </TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{file.lastModified}</TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>
                  {editingFile?.id === file.id ? (
                    <>
                      <IconButton onClick={handleSave} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="error">
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(file)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(file)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {fileToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default GTFSFiles; 