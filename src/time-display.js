// Time display utilities for 4-digit clock

export class TimeDisplay {
  static nullTime = "4:10";

  constructor(digitPatterns, patterns) {
    this.digitPatterns = digitPatterns;
    this.patterns = patterns;
    console.log('[TimeDisplay] Initialized with digit patterns:', Object.keys(digitPatterns));
  }

  // Create 15x8 grid for current digits
  createGrid() {
    console.log('[TimeDisplay] Creating grid for digits:', this.currentDigits);
    const gridDef = Array(8).fill().map(() => Array(15).fill(null));
    
    const digitPositions = [
      {digit: this.currentDigits[0], startX: 1, startY: 1},
      {digit: this.currentDigits[1], startX: 4, startY: 1},
      {digit: this.currentDigits[2], startX: 8, startY: 1},
      {digit: this.currentDigits[3], startX: 11, startY: 1}
    ];

    //console.log('[TimeDisplay] Digit positions:', digitPositions);
    
    digitPositions.forEach(pos => {
      const digitData = this.digitPatterns[pos.digit] || [];
      console.log(`[TimeDisplay] Processing digit ${pos.digit} with data:`, digitData);
      
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
    console.log('[TimeDisplay] Current digits:', this.currentDigits);
    const grid = this.createGrid();
    console.log('[TimeDisplay] Generated grid:', grid);
    return grid;
  }

  // Update with custom digits
  updateWithDigits(digits) {
    this.currentDigits = digits.padStart(4, '0').slice(0, 4);
    return this.createGrid();
  }

  getTemplateGrid() {
    // Return the base template with borders
    return [
      Array(15).fill(TimeDisplay.nullTime),
      [TimeDisplay.nullTime, ...Array(13).fill(null), TimeDisplay.nullTime],
      [TimeDisplay.nullTime, ...Array(13).fill(null), TimeDisplay.nullTime],
      [TimeDisplay.nullTime, ...Array(13).fill(null), TimeDisplay.nullTime],
      [TimeDisplay.nullTime, ...Array(13).fill(null), TimeDisplay.nullTime],
      [TimeDisplay.nullTime, ...Array(13).fill(null), TimeDisplay.nullTime],
      [TimeDisplay.nullTime, ...Array(13).fill(null), TimeDisplay.nullTime],
      Array(15).fill(TimeDisplay.nullTime)
    ];
  }

  getCurrentTimeGrid() {
    const template = this.getTemplateGrid();
    const now = new Date();
    const currentDigits = now.getHours().toString().padStart(2, '0') + 
                       now.getMinutes().toString().padStart(2, '0');
    
    const digitPositions = [
      {digit: currentDigits[0], startX: 1, startY: 1},
      {digit: currentDigits[1], startX: 4, startY: 1},
      {digit: currentDigits[2], startX: 8, startY: 1},
      {digit: currentDigits[3], startX: 11, startY: 1}
    ];
    
    digitPositions.forEach(pos => {
      const digitData = this.digitPatterns[pos.digit] || [];
      for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 3; x++) {
          template[pos.startY + y][pos.startX + x] = digitData[y]?.[x] || null;
        }
      }
    });
    
    return template;
  }

  getBorderedTimeGrid() {
    const currentTimePattern = this.patterns.find(p => p.name === 'Current Time');
    if (!currentTimePattern) {
      console.error('Current Time pattern not found');
      return this.getCurrentTimeGrid();
    }

    const updatedTimeGrid = this.getCurrentTimeGrid();
    const borderedGrid = JSON.parse(JSON.stringify(currentTimePattern.grid));
    
    // Merge time into bordered template
    for (let i = 0; i < updatedTimeGrid.length && i < borderedGrid.length; i++) {
      for (let j = 0; j < updatedTimeGrid[i].length && j < borderedGrid[i].length; j++) {
        if (updatedTimeGrid[i][j] !== null) {
          borderedGrid[i][j] = updatedTimeGrid[i][j];
        }
      }
    }
    
    return borderedGrid;
  }
}
