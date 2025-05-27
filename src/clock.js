import digits from './digits.json';

const DIGITS = digits;

export class Clock {
  constructor(canvas, gridX, gridY, currentDigit, isStatic = false) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d'); 
    this.gridX = gridX;
    this.gridY = gridY;
    this.currentDigit = currentDigit; 
    this.mode = isStatic ? 'static' : 'time';
    this.startTime = Date.now();
    this.hasLogged = false;
    
    // Initial render
    this.update();
    
    if (!isStatic) {
      setTimeout(() => {
        this.mode = 'animate';
        this.startTime = Date.now();
      }, 10000);
      this.startAnimation();
    }
  }

  getCurrentTimePosition() {
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
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;
  
    // Get computed CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    const hourThickness = parseFloat(rootStyles.getPropertyValue('--hour-hand-thickness'));
    const minuteThickness = parseFloat(rootStyles.getPropertyValue('--minute-hand-thickness'));
    const hourLength = parseFloat(rootStyles.getPropertyValue('--hour-hand-length'));
    const minuteLength = parseFloat(rootStyles.getPropertyValue('--minute-hand-length'));

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    // Draw clock face
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#111';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Draw hour hand
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(
      centerX + Math.sin(hourAngle * Math.PI / 180) * radius * hourLength,
      centerY - Math.cos(hourAngle * Math.PI / 180) * radius * hourLength
    );
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = hourThickness;
    this.ctx.lineCap = 'butt';
    this.ctx.stroke();
  
    // Draw minute hand
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(
      centerX + Math.sin(minuteAngle * Math.PI / 180) * radius * minuteLength,
      centerY - Math.cos(minuteAngle * Math.PI / 180) * radius * minuteLength
    );
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = minuteThickness;
    this.ctx.lineCap = 'butt';
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
