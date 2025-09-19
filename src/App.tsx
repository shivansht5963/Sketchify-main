import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './theme/ThemeContext';
import { Box, CircularProgress } from '@mui/material';
import Canvas from './pages/Canvas';
import CanvasAIAssistant from './pages/CanvasAIAssistant';
import NotFound from './pages/Notfound';
import CanvasImageSearch from './pages/CanvasImageSearch';
import CanvasToImage from './pages/CanvasToImage';
import CanvasToCode from './pages/CanvasToCode';
import CanvasMathSolver from './pages/CanvasMathSolver';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Loading component
const Loading = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/canvas" element={<Canvas />} />
            <Route path="/canvas-ai-assistant" element={<CanvasAIAssistant />} />
            <Route path="/canvas-image-search" element={<CanvasImageSearch />} />
            <Route path="/canvas-to-image" element={<CanvasToImage />} />
            <Route path="/canvas-to-code" element={<CanvasToCode />} />
            <Route path="/canvas-math-solver" element={<CanvasMathSolver />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App; 