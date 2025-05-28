import digits from './digits.json';

const DIGITS = digits;

export class Clock {
  constructor(canvas, timeStr) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.timeStr = timeStr;
    this.animationId = null;
    if (timeStr !== null) this.update();
  }

  timeToAngle(timeStr) {
    if (!timeStr) return { hour: 0, minute: 0 };
    try {
      const [h, m] = timeStr.split(':').map(Number);
      return {
        hour: (h % 12) * 30 + m * 0.5,
        minute: m * 6
      };
    } catch {
      return { hour: 0, minute: 0 };
    }
  }

  update(timeStr) {
    if (timeStr === null) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    if (timeStr) this.timeStr = timeStr;
    const angles = this.timeToAngle(this.timeStr);
    this.drawClock(angles.hour, angles.minute);
  }

  updateAngles(hourAngle, minuteAngle) {
    this.drawClock(hourAngle, minuteAngle);
  }

  animateTo(targetTime, duration, callback) {
    const startTime = Date.now();
    const endTime = startTime + duration;
    const startAngles = this.timeToAngle(this.timeStr);
    const targetAngles = this.timeToAngle(targetTime);
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      
      // Interpolate angles
      const currentHour = startAngles.hour + (targetAngles.hour - startAngles.hour) * progress;
      const currentMinute = startAngles.minute + (targetAngles.minute - startAngles.minute) * progress;
      
      this.updateAngles(currentHour, currentMinute);
      
      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.timeStr = targetTime;
        if (callback) callback();
      }
    };
    
    cancelAnimationFrame(this.animationId);
    animate();
  }

  drawClock(hourAngle, minuteAngle) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    const rootStyles = getComputedStyle(document.documentElement);
    const hourThickness = parseFloat(rootStyles.getPropertyValue('--hour-hand-thickness'));
    const minuteThickness = parseFloat(rootStyles.getPropertyValue('--minute-hand-thickness'));
    const hourLength = parseFloat(rootStyles.getPropertyValue('--hour-hand-length'));
    const minuteLength = parseFloat(rootStyles.getPropertyValue('--minute-hand-length'));

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw clock face
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#111';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Draw hands
    this.drawHand(hourAngle, radius * hourLength, hourThickness);
    this.drawHand(minuteAngle, radius * minuteLength, minuteThickness);
  }

  drawHand(angle, length, thickness) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(
      centerX + Math.sin(angle * Math.PI / 180) * length,
      centerY - Math.cos(angle * Math.PI / 180) * length
    );
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = thickness;
    this.ctx.lineCap = 'butt';
    this.ctx.stroke();
  }

  // Static method for time interpolation (doesn't need instance)
  static interpolateTime(startTime, endTime, progress) {
    // Linear progress (remove easing to prevent jumps)
    
    // Parse positions
    const [startH, startM] = (startTime || '4:10').split(':').map(Number);
    const [endH, endM] = (endTime || '4:10').split(':').map(Number);
    
    // Linear interpolation for each hand
    const currentH = startH + (endH - startH) * progress;
    const currentM = startM + (endM - startM) * progress;
    
    // Format as time string
    const hour = (Math.round(currentH) % 12 + 12) % 12 || 12;
    const minute = (Math.round(currentM) % 60 + 60) % 60;
    
    return `${hour}:${minute.toString().padStart(2, '0')}`;
  }
}

export class ClockGrid {
  constructor(container, gridDef) {
    this.container = container;
    
    // Validate grid structure
    if (!this.constructor.isValidGrid(gridDef)) {
      console.warn('Invalid grid - using fallback');
      gridDef = this.constructor.createFallbackGrid();
    }

    this.gridDef = gridDef;
    this.clocks = [];
    this.rows = gridDef.length;
    this.cols = gridDef[0].length;
    this.render();
  }

  static isValidGrid(grid) {
    return Array.isArray(grid) && 
           grid.length === 8 && 
           grid.every(row => Array.isArray(row) && row.length === 15);
  }

  static createFallbackGrid() {
    return Array(8).fill().map(() => Array(15).fill(0));
  }

  render() {
    this.container.innerHTML = '';
    this.container.style.display = 'grid';
    this.container.style.gridTemplateRows = `repeat(${this.rows}, 60px)`;
    this.container.style.gridTemplateColumns = `repeat(${this.cols}, 60px)`;
    this.container.style.gap = '5px';
    
    this.clocks = [];
    for (let y = 0; y < this.rows; y++) {
      this.clocks[y] = [];
      for (let x = 0; x < this.cols; x++) {
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 60;
        this.container.appendChild(canvas);
        
        const timeStr = this.gridDef[y][x];
        const clock = new Clock(canvas, timeStr);
        this.clocks[y][x] = clock;
      }
    }
  }

  update(gridDef) {
    // console.log('ClockGrid.update() called with:', gridDef);
    if (gridDef) this.gridDef = gridDef;
    
    this.clocks.forEach((row, y) => {
      row.forEach((clock, x) => {
        const timeStr = this.gridDef[y][x];
        // console.log(`Updating clock at (${x},${y}) with time:`, timeStr);
        clock.update(timeStr);
      });
    });
  }

  // Animate between two grid states
  animateGrid(startGrid, endGrid, duration, callback) {
    let completed = 0;
    const total = this.rows * this.cols;
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.clocks[row][col].animateTo(
          endGrid[row][col], 
          duration,
          () => {
            completed++;
            if (completed === total && callback) callback();
          }
        );
      }
    }
  }

  static interpolateTime(startTime, endTime, progress) {
    return Clock.interpolateTime(startTime, endTime, progress);
  }
}
