// Clock implementation
document.addEventListener('DOMContentLoaded', () => {
    const size = 200;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.display = 'block';
    canvas.style.margin = '20px auto';
    canvas.style.border = '2px solid white';
    
    // Insert before debug info
    const debugInfo = document.querySelector('.debug-info');
    document.body.insertBefore(canvas, debugInfo);
    
    const ctx = canvas.getContext('2d');
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Clear canvas
        ctx.clearRect(0, 0, size, size);
        
        // Draw clock face
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2 - 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Fixed red hand at 3pm (90 degrees)
        drawHand(Math.PI/2, size * 0.4, 6, '#f00');
        
        // Rotating green hand (360 degrees per minute)
        const now = new Date();
        const rotation = (now.getSeconds() + now.getMilliseconds()/1000) * 6 * (Math.PI/180);
        drawHand(rotation, size * 0.5, 4, '#0f0');
    }
    
    function drawHand(angle, length, width, color) {
        angle = angle - Math.PI/2; // Adjust for 12 o'clock position
        const center = size/2;
        
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(
            center + Math.cos(angle) * length,
            center + Math.sin(angle) * length
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }
    
    // Start animation
    animate();
});

export {}; // Ensure this is recognized as a module
