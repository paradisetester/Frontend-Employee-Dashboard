import React, { useState } from 'react';
import api from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

const ApplyLeave = () => {
  const [leaveData, setLeaveData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData({
      ...leaveData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.applyLeave(leaveData);
      console.log('Leave applied successfully:', response);
      navigate('/leave-status');
    } catch (err) {
      console.error('Error applying leave:', err);
      setError('Failed to apply for leave. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          📝 Apply for Leave
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 3 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="startDate"
            label="Start Date"
            type="date"
            name="startDate"
            InputLabelProps={{
              shrink: true,
            }}
            value={leaveData.startDate}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="endDate"
            label="End Date"
            type="date"
            name="endDate"
            InputLabelProps={{
              shrink: true,
            }}
            value={leaveData.endDate}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="reason"
            label="Reason"
            name="reason"
            multiline
            rows={4}
            value={leaveData.reason}
            onChange={handleChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Apply for Leave'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApplyLeave;
