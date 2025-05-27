import digits from './digits.json';

// Clock class implementation
export class Clock {
  constructor(size = 60, gridX, gridY) {
    this.size = size;
    this.gridX = gridX;
    this.gridY = gridY;
    this.canvas = this.createCanvas();
    this.mode = 'time';
    this.startTime = Date.now();
    
    // Initial render
    this.update();
    
    // Start animation after 10s
    setTimeout(() => {
      this.mode = 'animate';
      this.startTime = Date.now();
    }, 10000);
    
    this.startAnimation();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '20px auto';
    this.canvas.style.border = 'none'; // Removed border
    
    const debugInfo = document.querySelector('.debug-info');
    document.body.insertBefore(this.canvas, debugInfo);
    
    this.ctx = this.canvas.getContext('2d');
    return this.canvas;
  }

  timeToAngle(timeStr) {
    if (!timeStr) return null;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Calculate hour hand position (30° per hour + 0.5° per minute)
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    
    // Calculate minute hand position (6° per minute)
    const minuteAngle = minutes * 6;
    
    // Return both angles in radians
    return {
      hour: hourAngle * (Math.PI/180),
      minute: minuteAngle * (Math.PI/180)
    };
  }

  getCurrentTimePosition() {
    // Only show in columns 1-3 and rows 1-6 (0-indexed)
    if (this.gridX < 1 || this.gridX > 3 || this.gridY < 1 || this.gridY > 6) {
      return null;
    }
    
    // Get time string for current position
    const segmentY = this.gridY - 1;
    const segmentX = this.gridX - 1;
    const timeStr = digits.hour?.["0"]?.[segmentY]?.[segmentX];
    
    // Convert time string to angles
    return this.timeToAngle(timeStr);
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
    this.ctx.fillStyle = '#222222';
    this.ctx.fill();
    
    // Draw clock center
    this.ctx.beginPath();
    this.ctx.arc(this.size/2, this.size/2, 3, 0, Math.PI*2);
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
    
    const now = Date.now();
    
    if (this.mode === 'time') {
      const angles = this.getCurrentTimePosition();
      if (angles) {
        this.drawHand(angles.minute, this.size * 0.5, 4, '#0f0');
        this.drawHand(angles.hour, this.size * 0.35, 6, '#0f0');
      }
    } else {
      const elapsed = (now - this.startTime) / 1000;
      const rotation = elapsed * 6 * (Math.PI/180);
      
      this.drawHand(rotation, this.size * 0.5, 4, '#0f0');
      this.drawHand(rotation/12, this.size * 0.35, 6, '#0f0');
    }
  }
}
