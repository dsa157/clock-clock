import digits from './digits.json';

const DIGITS = digits;

export class Clock {
  constructor(canvas, timeStr) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.timeStr = timeStr;
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
}

export class ClockGrid {
  constructor(container, gridDef) {
    this.container = container;
    this.gridDef = gridDef;
    this.clocks = [];
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.container.style.display = 'grid';
    this.container.style.gridTemplateRows = `repeat(${this.gridDef.length}, 60px)`;
    this.container.style.gridTemplateColumns = `repeat(${this.gridDef[0].length}, 60px)`;
    this.container.style.gap = '5px';
    
    this.clocks = [];
    for (let y = 0; y < this.gridDef.length; y++) {
      for (let x = 0; x < this.gridDef[y].length; x++) {
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 60;
        this.container.appendChild(canvas);
        
        const timeStr = this.gridDef[y][x];
        const clock = new Clock(canvas, timeStr);
        this.clocks.push({ x, y, clock });
      }
    }
  }

  update(gridDef) {
    console.log('ClockGrid.update() called with:', gridDef);
    if (gridDef) this.gridDef = gridDef;
    
    this.clocks.forEach(({x, y, clock}) => {
      const timeStr = this.gridDef[y][x];
      console.log(`Updating clock at (${x},${y}) with time:`, timeStr);
      clock.update(timeStr);
    });
  }
}
