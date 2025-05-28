import digits from './digits.json';
import { TimeDisplay } from './time-display.js';

const DIGITS = digits;

export class Clock {
  constructor(canvas, timeStr) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.timeStr = timeStr;
    this.animationId = null;
    if (timeStr !== null && timeStr !== undefined) this.update();
  }

  timeToAngle(timeStr) {
    if (!timeStr) return { hour: 0, minute: 0 };
    
    try {
      const [h, m] = timeStr.split(':').map(Number);
      
      // Ensure we have valid numbers
      const hour = Number.isFinite(h) ? h : 0;
      const minute = Number.isFinite(m) ? m : 0;
      
      return {
        hour: (hour % 12) * 30 + minute * 0.5,
        minute: minute * 6
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
    // Debug check for NaN values
    if (isNaN(hourAngle) || isNaN(minuteAngle)) {
      console.error('[Clock] NaN angles detected - resetting to 0');
      hourAngle = 0;
      minuteAngle = 0;
    }
    this.drawClock(hourAngle, minuteAngle);
  }

  animateTo(targetTime, duration = 1000, callback) {
    const startAngles = this.timeToAngle(this.timeStr);
    const targetAngles = this.timeToAngle(targetTime === 'Current Time' ? TimeDisplay.getCurrentTime() : targetTime);
    
    let startTime = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentHour = startAngles.hour + (targetAngles.hour - startAngles.hour) * progress;
      const currentMinute = startAngles.minute + (targetAngles.minute - startAngles.minute) * progress;
      
      this.updateAngles(currentHour, currentMinute);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.timeStr = targetTime;
        if (callback) callback();
      }
    };
    
    requestAnimationFrame(animate);
  }

  drawClock(hourAngle, minuteAngle) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw clock face
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    const rootStyles = getComputedStyle(document.documentElement);
    const hourThickness = parseFloat(rootStyles.getPropertyValue('--hour-hand-thickness'));
    const minuteThickness = parseFloat(rootStyles.getPropertyValue('--minute-hand-thickness'));
    const hourLength = parseFloat(rootStyles.getPropertyValue('--hour-hand-length'));
    const minuteLength = parseFloat(rootStyles.getPropertyValue('--minute-hand-length'));
    const faceColor = rootStyles.getPropertyValue('--clock-face-color') || '#111';
    const borderColor = rootStyles.getPropertyValue('--clock-border-color') || '#333';

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = faceColor;
    this.ctx.fill();
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Draw hands
    this.drawHand(hourAngle, radius * hourLength, hourThickness);
    
    this.drawHand(minuteAngle, radius * minuteLength, minuteThickness);
  }

  drawHand(angle, length, thickness) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Save context state
    this.ctx.save();
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(
      centerX + Math.sin(angle * Math.PI / 180) * length,
      centerY - Math.cos(angle * Math.PI / 180) * length
    );
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = thickness;
    this.ctx.stroke();
    
    // Restore context state
    this.ctx.restore();
  }

  static interpolateTime(startTime, endTime, progress) {
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
