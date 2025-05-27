import { Clock } from './clock.js';
import patterns from './patterns.json';

// Create grid of clocks
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.createElement('div');
  gridContainer.id = 'clock-grid';
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = 'repeat(15, 1fr)';
  gridContainer.style.gap = '10px';
  gridContainer.style.padding = '20px';
  
  // Create 15x8 grid (120 clocks)
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 15; x++) {
      const clockWrapper = document.createElement('div');
      clockWrapper.style.display = 'flex';
      clockWrapper.style.justifyContent = 'center';
      
      const clock = new Clock(60, x, y);
      clockWrapper.appendChild(clock.canvas);
      gridContainer.appendChild(clockWrapper);
      
      // Immediately update to show current time
      clock.update();
    }
  }
  
  document.body.insertBefore(gridContainer, document.body.firstChild);
  console.log('Clock grid ready - showing current time for 10 seconds');
});

// Main clock controller
class ClockGrid {
    constructor(containerId) {
        console.log('[DEBUG] Initializing ClockGrid for container:', containerId);
        this.gridElement = document.getElementById(containerId);
        console.log('[DEBUG] Container element:', this.gridElement);
        
        if (!this.gridElement) {
            console.error('[DEBUG ERROR] Container not found:', containerId);
            document.body.innerHTML = '<h1 style="color:red">ERROR: Missing #clock-grid</h1>';
            return;
        }
        
        console.log('[DEBUG] Initializing ClockGrid with visual debug mode');
        
        // Visual debug styling
        document.body.style.backgroundColor = '#222';
        this.gridElement.style.outline = '2px solid lime';
        
        this.clocks = [];
        this.gridSize = {cols: 15, rows: 8};
        this.currentState = 'TIME_DISPLAY';
        this.stateStartTime = Date.now();
        this.stateDurations = {
            'TIME_DISPLAY': 10000,  // 10 sec time display
            'PRE_TRANSITION': 1000, // 1 sec transition
            'INTERMEDIATE_FORM': 10000 // 10 sec pattern display
        };
        this.stateDuration = this.stateDurations[this.currentState];
        this.currentPatternIndex = 0;
        this.lastDebugLog = null;
        
        // Load patterns from imported JSON
        try {
            if (!Array.isArray(patterns)) throw new Error('Invalid pattern format');
            this.patterns = patterns;
            console.log(`Loaded ${patterns.length} patterns from src`);
        } catch (e) {
            console.warn('Using fallback patterns:', e.message);
            this.patterns = [{
                name: "fallback",
                angles: { hour: "0", minute: "0" }
            }];
        }
        
        this.initGrid();
        console.log('[DEBUG] Clocks initialized');
    }

    initGrid() {
        console.log('[DEBUG] Creating canvas elements');
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const clock = new AnalogClock(col, row);
                
                // Visual debug
                clock.element.style.border = '1px solid rgba(255,255,255,0.2)';
                clock.element.style.boxSizing = 'border-box';
                
                this.clocks.push(clock);
                this.gridElement.appendChild(clock.element);
                
                // Make clock at 0,0 show actual time, others show pattern
                if (col === 0 && row === 0) {
                    clock.update();
                } else {
                    clock.displayPattern(45, 180);
                }
            }
        }
        
        console.log('[DEBUG] Grid initialized with', this.clocks.length, 'clocks');
    }

    startAnimation() {
        //console.log('[DEBUG] Starting animation loop');
        const animate = () => {
            requestAnimationFrame(animate);
            try {
                this.updateClocks();
                //console.log('[DEBUG] Animation frame executed'); // Debug log
            } catch (e) {
                console.error('[DEBUG] Animation error:', e);
            }
        };
        animate();
    }

    calculateAngle(expression, clock) {
        try {
            // Simple number case
            if (/^[-+]?\d*\.?\d+$/.test(expression)) {
                return Number(expression) * Math.PI / 180;
            }
            
            // Create evaluation context
            const ctx = {
                col: clock.col,
                row: clock.row,
                time: Date.now(),
                PI: Math.PI,
                // Math functions
                sin: Math.sin,
                cos: Math.cos,
                tan: Math.tan,
                sqrt: Math.sqrt,
                pow: Math.pow,
                random: Math.random
            };
            
            // Tokenize and parse safely
            const tokens = expression.match(/\b\w+\b|[-+*/()]|\d+\.?\d*/g) || [];
            const stack = [];
            const ops = [];
            
            // Shunting-yard algorithm for safe evaluation
            for (const token of tokens) {
                if (token in ctx) {
                    stack.push(ctx[token]);
                } else if (/^\d+\.?\d*$/.test(token)) {
                    stack.push(Number(token));
                } else if (token === '(') {
                    ops.push(token);
                } else if (token === ')') {
                    while (ops.length && ops[ops.length-1] !== '(') {
                        this.applyOp(stack, ops.pop());
                    }
                    ops.pop(); // Remove '('
                } else {
                    while (ops.length && this.precedence(ops[ops.length-1]) >= this.precedence(token)) {
                        this.applyOp(stack, ops.pop());
                    }
                    ops.push(token);
                }
            }
            
            while (ops.length) {
                this.applyOp(stack, ops.pop());
            }
            
            // Convert to radians
            return (stack[0] || 0) * Math.PI / 180;
        } catch (e) {
            console.warn('Angle calculation error:', e);
            return 0;
        }
    }

    precedence(op) {
        switch(op) {
            case '+': case '-': return 1;
            case '*': case '/': return 2;
            default: return 0;
        }
    }

    applyOp(stack, op) {
        const b = stack.pop();
        const a = stack.pop();
        switch(op) {
            case '+': stack.push(a + b); break;
            case '-': stack.push(a - b); break;
            case '*': stack.push(a * b); break;
            case '/': stack.push(a / b); break;
        }
    }

    updateClocks() {
        const now = new Date();
        
        // Debug logging (once per second)
        if (!this.lastDebugLog || now - this.lastDebugLog >= 1000) {
            this.lastDebugLog = now;
            const debugClock = this.clocks.find(c => c.col === 0 && c.row === 0);
            
            if (debugClock) {
                if (this.currentState === 'TIME_DISPLAY') {
                    console.log(`[DEBUG] Clock (0,0) - State: ${this.currentState} Time: ${now.getHours()}h ${now.getMinutes()}m`);
                } else {
                    console.log(`[DEBUG] Clock (0,0) - State: ${this.currentState} ` +
                        `Pattern: ${this.patterns[this.currentPatternIndex].name} ` +
                        `(Angles: ${this.patterns[this.currentPatternIndex].angles.hour}°/${this.patterns[this.currentPatternIndex].angles.minute}°)`);
                }
            }
        }
        
        // Apply current state
        if (this.currentState === 'TIME_DISPLAY') {
            const hours = (now.getHours() % 12) + (now.getMinutes() / 60);
            const hoursAngle = hours * (Math.PI / 6);
            const minutesAngle = now.getMinutes() * (Math.PI / 30);
            
            this.clocks.forEach(clock => {
                clock.displayPattern(hoursAngle, minutesAngle);
            });
        } else {
            const pattern = this.patterns[this.currentPatternIndex];
            this.clocks.forEach(clock => {
                const hoursAngle = this.calculateAngle(pattern.angles.hour, clock);
                const minutesAngle = this.calculateAngle(pattern.angles.minute, clock);
                clock.displayPattern(hoursAngle, minutesAngle);
            });
        }
        
        // State transitions
        const elapsed = Date.now() - this.stateStartTime;
        if (elapsed > this.stateDurations[this.currentState]) {
            this.stateStartTime = Date.now();
            
            switch(this.currentState) {
                case 'TIME_DISPLAY': 
                    this.currentState = 'PRE_TRANSITION';
                    break;
                    
                case 'PRE_TRANSITION': 
                    this.currentState = 'INTERMEDIATE_FORM';
                    this.currentPatternIndex = (this.currentPatternIndex + 1) % this.patterns.length;
                    break;
                    
                case 'INTERMEDIATE_FORM': 
                    this.currentState = 'TIME_DISPLAY';
                    break;
            }
        }
    }

    renderTime(hourAngle, minuteAngle) {
        this.clocks.forEach(clock => {
            clock.displayPattern(hourAngle, minuteAngle);
        });
    }

    renderPattern(pattern, hourAngle, minuteAngle) {
        this.clocks.forEach(clock => {
            const hourPatternAngle = this.calculateAngle(pattern.angles.hour, {time: Date.now()});
            const minutePatternAngle = this.calculateAngle(pattern.angles.minute, {time: Date.now()});
            clock.displayPattern(hourPatternAngle, minutePatternAngle);
        });
    }
}

// Individual analog clock
class AnalogClock {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.createCanvas();
        this.size = 50;
        this.element.width = this.size;
        this.element.height = this.size;
    }

    createCanvas() {
        this.element = document.createElement('canvas');
        this.element.className = 'clock-face';
        this.ctx = this.element.getContext('2d');
    }

    drawClock() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.size, this.size);
        
        // Draw clock face (barely visible dark gray)
        this.ctx.beginPath();
        this.ctx.arc(this.size/2, this.size/2, this.size/2 - 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Get current time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Draw hour hand (thicker)
        this.drawHand(hours % 12 * 30 + minutes * 0.5, this.size * 0.3, 4, '#fff');
        
        // Draw minute hand (thicker)
        this.drawHand(minutes * 6, this.size * 0.4, 3, '#fff');
    }

    drawHand(angle, length, width, color) {
        angle = (angle - 90) * Math.PI / 180;
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

    displayPattern(hourAngle, minuteAngle) {
        // Clear and draw clock face
        this.ctx.clearRect(0, 0, this.size, this.size);
        this.ctx.beginPath();
        this.ctx.arc(this.size/2, this.size/2, this.size/2 - 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Convert angles to proper format (radians, 0 at top)
        const hourRad = (hourAngle * Math.PI / 180) - (Math.PI / 2);
        const minuteRad = (minuteAngle * Math.PI / 180) - (Math.PI / 2);
        
        // Draw hands
        this.drawHand(hourRad, this.size * 0.3, 4, '#fff');
        this.drawHand(minuteRad, this.size * 0.4, 3, '#fff');
    }

    update() {
        this.drawClock();
    }
}

// Initialize the application
console.log('Starting application initialization');

if (window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')) {
    // Load patterns from public directory
    // fetch('/design/patterns.json')
    //     .then(response => {
    //         console.log('Patterns fetch response:', response.status);
    //         if (!response.ok) throw new Error('Patterns load failed');
    //         return response.json();
    //     })
    //     .then(patterns => {
    //         console.log('Patterns successfully loaded:', patterns);
    //         new ClockGrid();
    //     })
    //     .catch(error => {
    //         console.warn('Pattern load error, using fallback:', error);
    //         new ClockGrid();
    //     });
} else {
    new ClockGrid('clock-grid');
}
