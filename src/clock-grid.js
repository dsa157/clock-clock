import { TimeDisplay } from './time-display.js';
import { Clock } from './clock.js';

const DIGITS = {}; // Removed since it's not used in ClockGrid

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
    return Array(8).fill().map(() => Array(15).fill(TimeDisplay.nullTime));
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
        
        // Initialize all clocks in a cleared state
        const clock = new Clock(canvas, undefined);
        this.clocks[y][x] = clock;
      }
    }
  }

  update(gridDef) {
    if (gridDef) this.gridDef = gridDef;
    
    this.clocks.forEach((row, y) => {
      row.forEach((clock, x) => {
        const timeStr = this.gridDef[y][x];
        clock.update(timeStr);
      });
    });
  }

  animateAllTo(targetGrid, duration = 1000) {
    console.log('[Animation] Starting grid animation');
    
    // First clear all clocks to ensure consistent starting state
    this.clocks.forEach(row => row.forEach(clock => {
      clock.ctx.clearRect(0, 0, clock.canvas.width, clock.canvas.height);
    }));
    
    setTimeout(() => {
      let startTime = null;
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        this.clocks.forEach((row, y) => {
          row.forEach((clock, x) => {
            const startTimeStr = this.gridDef[y][x] === null ? TimeDisplay.nullTime : this.gridDef[y][x];
            const targetTimeStr = targetGrid[y][x] === null ? TimeDisplay.nullTime : targetGrid[y][x];
            
            const startAngles = clock.timeToAngle(startTimeStr);
            const targetAngles = clock.timeToAngle(targetTimeStr);
            
            const currentHour = startAngles.hour + (targetAngles.hour - startAngles.hour) * progress;
            const currentMinute = startAngles.minute + (targetAngles.minute - startAngles.minute) * progress;
            
            clock.updateAngles(currentHour, currentMinute);
          });
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          console.log('[Animation] Grid animation complete');
          this.gridDef = targetGrid;
        }
      };
      
      requestAnimationFrame(animate);
    }, 2000); // Use transitionDelay from transitions.json
  }

  animateGrid(startGrid, endGrid, duration, callback) {
    let completed = 0;
    const total = this.rows * this.cols;
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const isCurrentTime = endGrid[row][col] === 'Current Time';
        
        // Skip animation for Current Time clocks (they handle it themselves)
        if (isCurrentTime) {
          completed++;
          if (completed === total && callback) callback();
          continue;
        }
        
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
