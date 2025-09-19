import axios from 'axios';

// API Keys from environment variables with fallbacks
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY || 'pogDlbImlFebL3VyFGD5PvEjBTPSWzzrjSqV8GHez-I';
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY || '49000944-99d3b88ade1655685e032343f';
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || '1WqfnKiKVaEQq2M2lAVZpjgB3oWCRC8veCNGJgyqB1NVv8TPSFzcQRSO';

// Image result interface
export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  source: string; // 'unsplash', 'pixabay', 'pexels', 'picsum'
  sourceUrl: string;
}

/**
 * Fetch images from Unsplash API
 */
const searchUnsplash = async (query: string, perPage: number = 10): Promise<ImageResult[]> => {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: perPage
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`
      }
    });

    return response.data.results.map((item: any) => ({
      id: `unsplash-${item.id}`,
      url: item.urls.regular,
      thumbnailUrl: item.urls.small,
      title: item.alt_description || query,
      source: 'unsplash',
      sourceUrl: item.links.html
    }));
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return [];
  }
};

/**
 * Fetch images from Pixabay API
 */
const searchPixabay = async (query: string, perPage: number = 10): Promise<ImageResult[]> => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        per_page: perPage,
        image_type: 'photo'
      }
    });

    return response.data.hits.map((item: any) => ({
      id: `pixabay-${item.id}`,
      url: item.largeImageURL,
      thumbnailUrl: item.previewURL,
      title: item.tags || query,
      source: 'pixabay',
      sourceUrl: item.pageURL
    }));
  } catch (error) {
    console.error('Error fetching from Pixabay:', error);
    return [];
  }
};

/**
 * Fetch images from Pexels API
 */
const searchPexels = async (query: string, perPage: number = 10): Promise<ImageResult[]> => {
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query,
        per_page: perPage
      },
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

    return response.data.photos.map((item: any) => ({
      id: `pexels-${item.id}`,
      url: item.src.large,
      thumbnailUrl: item.src.medium,
      title: item.alt || query,
      source: 'pexels',
      sourceUrl: item.url
    }));
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return [];
  }
};

/**
 * Get random images from Lorem Picsum
 */
const getPicsumImages = (count: number = 10): ImageResult[] => {
  return Array.from({ length: count }).map((_, index) => {
    const randomId = Math.floor(Math.random() * 1000);
    return {
      id: `picsum-${randomId}-${index}`,
      url: `https://picsum.photos/id/${randomId}/800/600`,
      thumbnailUrl: `https://picsum.photos/id/${randomId}/400/300`,
      title: 'Random Image',
      source: 'picsum',
      sourceUrl: `https://picsum.photos/id/${randomId}`
    };
  });
};

/**
 * Search images from all sources and combine results
 */
export const searchImages = async (query: string): Promise<ImageResult[]> => {
  try {
    // Start all API calls concurrently
    const [unsplashResults, pixabayResults, pexelsResults] = await Promise.all([
      searchUnsplash(query),
      searchPixabay(query),
      searchPexels(query)
    ]);

    // Get some random Picsum images
    const picsumResults = getPicsumImages(5);

    // Combine and shuffle results to mix sources
    const allResults = [...unsplashResults, ...pixabayResults, ...pexelsResults, ...picsumResults];
    
    return shuffleArray(allResults);
  } catch (error) {
    console.error('Error searching images:', error);
    return [];
  }
};

// Helper to shuffle array for variety in results
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
} 