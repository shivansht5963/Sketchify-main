import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

export const useBackgroundAnimation = (tealColor: string = '#4ECDC4', coralColor: string = '#FF6B6B') => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isDarkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    document.querySelector('.floating-dots')?.appendChild(canvas);
    
    const context = canvas.getContext('2d');
    if (!context) return;
    contextRef.current = context;
    
    const resizeCanvas = () => {
      if (canvasRef.current && contextRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
      
      for (let i = 0; i < particleCount; i++) {
        const colors = [
          tealColor + (isDarkMode ? '30' : '20'),
          coralColor + (isDarkMode ? '30' : '20')
        ];
        
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    
    const animateParticles = () => {
      if (!contextRef.current || !canvasRef.current) return;
      
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      particlesRef.current.forEach(particle => {
        if (!contextRef.current || !canvasRef.current) return;
        
        contextRef.current.beginPath();
        contextRef.current.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        contextRef.current.fillStyle = particle.color;
        contextRef.current.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x > canvasRef.current.width || particle.x < 0) {
          particle.speedX *= -1;
        }
        
        if (particle.y > canvasRef.current.height || particle.y < 0) {
          particle.speedY *= -1;
        }
      });
      
      // Draw connections between nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            if (!contextRef.current) return;
            contextRef.current.beginPath();
            contextRef.current.strokeStyle = particlesRef.current[i].color;
            contextRef.current.lineWidth = 0.2;
            contextRef.current.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            contextRef.current.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            contextRef.current.stroke();
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animateParticles();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [tealColor, coralColor]);
}; 