// Clock class implementation
export class Clock {
  constructor(size = 200) {
    this.size = size;
    this.canvas = this.createCanvas();
    this.startAnimation();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '20px auto';
    this.canvas.style.border = '2px solid white';
    
    const debugInfo = document.querySelector('.debug-info');
    document.body.insertBefore(this.canvas, debugInfo);
    
    this.ctx = this.canvas.getContext('2d');
    return this.canvas;
  }

  drawHand(angle, length, width, color) {
    angle = angle - Math.PI/2; // Adjust for 12 o'clock position
    const center = this.size/2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(center, center);
    this.ctx.lineTo(
      center + Math.cos(angle) * length,
      center + Math.sin(angle) * length
    );
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

  startAnimation() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }

  update() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.size, this.size);
    
    // Draw clock face
    this.ctx.beginPath();
    this.ctx.arc(this.size/2, this.size/2, this.size/2 - 10, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Fixed red hand at 3pm (90 degrees)
    this.drawHand(Math.PI/2, this.size * 0.4, 6, '#f00');
    
    // Rotating green hand (360 degrees per minute)
    const now = new Date();
    const rotation = (now.getSeconds() + now.getMilliseconds()/1000) * 6 * (Math.PI/180);
    this.drawHand(rotation, this.size * 0.5, 4, '#0f0');
  }
}
