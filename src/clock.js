import digits from './digits.json';

export class Clock {
  constructor(canvas, gridX, gridY, currentDigit) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d'); // Initialize context immediately
    this.gridX = gridX;
    this.gridY = gridY;
    this.currentDigit = currentDigit; // Ensure this is set
    this.mode = 'time';
    this.startTime = Date.now();
    this.hasLogged = false;
    
    // Initial render
    this.update();
    
    // Start animation after 10s
    setTimeout(() => {
      this.mode = 'animate';
      this.startTime = Date.now();
    }, 10000);
    
    this.startAnimation();
  }

  getCurrentTimePosition() {
    // Return null for null inputs or edge positions
    if (this.gridX === null || this.gridY === null || 
        this.gridY < 0 || this.gridY >= 6) {
      return null;
    }
    
    if (!this.currentDigit || !digits[this.currentDigit] || 
        !digits[this.currentDigit][this.gridY] || 
        !digits[this.currentDigit][this.gridY][this.gridX]) {
      return null;
    }
    
    return digits[this.currentDigit][this.gridY][this.gridX];
  }

  timeToAngle(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') {
      return { hour: 0, minute: 0 };
    }
    
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return {
        hour: (hours % 12) * 30 + minutes * 0.5,
        minute: minutes * 6
      };
    } catch {
      return { hour: 0, minute: 0 };
    }
  }

  update() {
    const timeStr = this.getCurrentTimePosition();
    
    if (!timeStr) {
      if (!this.hasLogged) {
        console.debug(`Empty clock at (${this.gridX},${this.gridY})`);
        this.hasLogged = true;
      }
      return;
    }
    
    if (!this.hasLogged) {
      console.debug(`Rendering digit ${this.currentDigit} at (${this.gridX},${this.gridY}): Time=${timeStr}`);
      this.hasLogged = true;
    }
    
    const angles = this.timeToAngle(timeStr);
    this.drawClock(angles.hour, angles.minute);
  }

  drawClock(hourAngle, minuteAngle) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    // Draw clock face
    this.ctx.beginPath();
    this.ctx.arc(
      this.ctx.canvas.width/2, 
      this.ctx.canvas.height/2, 
      Math.min(this.ctx.canvas.width, this.ctx.canvas.height)/2 - 2, 
      0, 
      Math.PI * 2
    );
    this.ctx.fillStyle = '#111111';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Only draw hands if angles are provided
    if (hourAngle !== null && minuteAngle !== null) {
      this.drawHand(hourAngle, 0.3, 4);   // Hour hand
      this.drawHand(minuteAngle, 0.45, 2); // Minute hand
    }
  }

  drawHand(angle, length, width) {
    angle = (angle - 90) * Math.PI / 180;
    const centerX = this.ctx.canvas.width/2;
    const centerY = this.ctx.canvas.height/2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(
      centerX + length * Math.min(this.ctx.canvas.width, this.ctx.canvas.height)/2 * Math.cos(angle),
      centerY + length * Math.min(this.ctx.canvas.width, this.ctx.canvas.height)/2 * Math.sin(angle)
    );
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

  startAnimation() {
    const animate = () => {
      this.update();
      requestAnimationFrame(animate);
    };
    animate();
  }
}
