import React from 'react';
import { 
  Box, 
  ImageList, 
  ImageListItem, 
  ImageListItemBar, 
  IconButton, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  CircularProgress,
  Paper
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ImageResult } from '../services/imageSearchService';

interface ImageGalleryProps {
  images: ImageResult[];
  loading: boolean;
  query: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, loading, query }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Determine number of columns based on screen size
  const getCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px', 
          width: '100%' 
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Searching for images of "{query}"...
        </Typography>
      </Box>
    );
  }

  if (images.length === 0 && !loading) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          backgroundColor: 'background.default',
          border: '1px dashed',
          borderColor: 'divider'
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No images found for "{query}". Try a different search term.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowY: 'auto', maxHeight: '60vh' }}>
      <ImageList cols={getCols()} gap={16}>
        {images.map((item) => (
          <ImageListItem 
            key={item.id} 
            sx={{ 
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                '& .MuiImageListItemBar-root': {
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              loading="lazy"
              style={{ 
                height: '100%',
                objectFit: 'cover',
                width: '100%'
              }}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={`Source: ${item.source}`}
              sx={{
                transform: 'translateY(100%)',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(0,0,0,0.7)'
              }}
              actionIcon={
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`go to ${item.title}`}
                  onClick={() => window.open(item.sourceUrl, '_blank')}
                >
                  <OpenInNewIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ImageGallery; 