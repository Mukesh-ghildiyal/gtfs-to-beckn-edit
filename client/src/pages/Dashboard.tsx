import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Storage as StorageIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const summaryCards = [
    {
      title: 'Total GTFS Files',
      value: '12',
      icon: <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Active Routes',
      value: '45',
      icon: <EditIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    },
    {
      title: 'Stops',
      value: '156',
      icon: <StorageIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {card.icon}
                  <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/upload')}
            >
              Upload New GTFS Files
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate('/files')}
            >
              Manage GTFS Files
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 