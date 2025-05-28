import { Clock } from './clock.js';
import { ClockGrid } from './clock-grid.js';
import patterns from './patterns.json';
import digits from './digits.json';

// Digit positions for 4-digit display
const DIGIT_POSITIONS = [
  {startX: 1, startY: 1},  // First digit (HH)
  {startX: 4, startY: 1},  // Second digit (HH)
  {startX: 8, startY: 1},  // Third digit (MM)
  {startX: 11, startY: 1}  // Fourth digit (MM)
];

const DIGITS = digits;

function updateTimeDisplay() {
  const now = new Date();
  const timeDigits = now.getHours().toString().padStart(2, '0') + 
                    now.getMinutes().toString().padStart(2, '0');

  document.querySelectorAll('#clock-grid .clock-face canvas').forEach(canvas => {
    const x = parseInt(canvas.dataset.x);
    const y = parseInt(canvas.dataset.y);
    
    // Update only digit positions
    for (let i = 0; i < 4; i++) {
      const pos = DIGIT_POSITIONS[i];
      if (x >= pos.startX && x < pos.startX + 3 &&
          y >= pos.startY && y < pos.startY + 6) {
        const digit = timeDigits[i];
        const digitX = x - pos.startX;
        const digitY = y - pos.startY;
        
        // Get time string directly from digits.json
        const timeStr = DIGITS[digit]?.[digitY]?.[digitX] || null;
        
        canvas.__clock.currentDigit = digit;
        canvas.__clock.gridX = digitX;
        canvas.__clock.gridY = digitY;
        canvas.__clock.time = timeStr;
        canvas.__clock.update();
        return;
      }
    }
    
    // For non-digit positions
    canvas.__clock.time = null;
    canvas.__clock.update();
  });
}

// Create grid of clocks
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.createElement('div');
  gridContainer.id = 'clock-grid';
  
  // Create grid definition for ClockGrid
  const gridDef = Array(8).fill().map(() => Array(15).fill(null));
  
  // Initialize ClockGrid
  const clockGrid = new ClockGrid(gridContainer, gridDef);
  document.body.insertBefore(gridContainer, document.body.firstChild);
  
  // Initialize individual clocks
  clockGrid.clocks.forEach((row, y) => {
    row.forEach((clock, x) => {
      // Mark digit positions
      for (let i = 0; i < 4; i++) {
        const pos = DIGIT_POSITIONS[i];
        if (x >= pos.startX && x < pos.startX + 3 &&
            y >= pos.startY && y < pos.startY + 6) {
          clock.canvas.__clock = clock;
          clock.canvas.dataset.x = x;
          clock.canvas.dataset.y = y;
          break;
        }
      }
    });
  });
  
  // Initial update and set interval
  updateTimeDisplay();
  setInterval(updateTimeDisplay, 1000);
});
