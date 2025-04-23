import { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    // Create stars with same properties as original
    const stars = Array.from({length: 100}, () => ({
      x: Math.random()*canvas.width, 
      y: Math.random()*canvas.height, 
      speed: Math.random()*3+1
    }));
    
    // Animation function - kept exactly the same
    function animate() {
      ctx.fillStyle = 'rgba(24,24,36,0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.x = (star.x + star.speed) % canvas.width;
        ctx.fillStyle = 'white';
        ctx.fillRect(star.x, star.y, 2, 2);
      });
      
      requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle window resizing - kept the same
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0c0c1d] font-mono overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0"
      />
      <div className="text-overlay absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-10" style={{textShadow: '0 0 4px rgba(0,0,0,0.7)'}}>
        <h1 className="text-2xl">Frontend Developer</h1>
        <p className="mt-2 text-sm text-[#66ff66]">// Decoding Dev Mysteries for Actual Humans</p>
      </div>
    </div>
  );
};

export default Starfield;