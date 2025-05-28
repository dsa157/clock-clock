// Time display utilities for 4-digit clock

export class TimeDisplay {
  constructor(digitPatterns, initialDigits = '0000') {
    this.digitPatterns = digitPatterns;
    this.currentDigits = initialDigits;
  }

  // Create 15x8 grid for current digits
  createGrid() {
    const gridDef = Array(8).fill().map(() => Array(15).fill(null));
    
    const digitPositions = [
      {digit: this.currentDigits[0], startX: 1, startY: 1},
      {digit: this.currentDigits[1], startX: 4, startY: 1},
      {digit: this.currentDigits[2], startX: 8, startY: 1},
      {digit: this.currentDigits[3], startX: 11, startY: 1}
    ];

    digitPositions.forEach(pos => {
      const digitData = this.digitPatterns[pos.digit] || [];
      for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 3; x++) {
          gridDef[pos.startY + y][pos.startX + x] = digitData[y]?.[x] || null;
        }
      }
    });

    return gridDef;
  }

  // Update with current time (zero-padded)
  updateWithCurrentTime() {
    const now = new Date();
    this.currentDigits = now.getHours().toString().padStart(2, '0') + 
                       now.getMinutes().toString().padStart(2, '0');
    return this.createGrid();
  }

  // Update with custom digits
  updateWithDigits(digits) {
    this.currentDigits = digits.padStart(4, '0').slice(0, 4);
    return this.createGrid();
  }
}
