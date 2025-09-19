import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const theme = useTheme();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement registration logic
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(45deg, #1A2027 30%, #0A1929 90%)'
          : 'linear-gradient(45deg, #F5F5F5 30%, #E0E0E0 90%)',
        py: 12,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 2,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join Sketchify and start creating amazing things!
              </Typography>
            </Box>

            <TextField
              label="Full Name"
              variant="outlined"
              required
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              required
              fullWidth
            />

            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #FF5555, #45B7D1)',
                },
              }}
            >
              Register
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                }}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;