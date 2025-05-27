// Main clock controller
class ClockGrid {
    constructor() {
        this.clocks = [];
        this.gridSize = {cols: 15, rows: 8};
        this.initGrid();
        this.startAnimation();
    }

    initGrid() {
        const grid = document.getElementById('clock-grid');
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const clock = new AnalogClock(col, row);
                this.clocks.push(clock);
                grid.appendChild(clock.element);
            }
        }
    }

    startAnimation() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.updateClocks();
        };
        animate();
    }

    updateClocks() {
        this.clocks.forEach(clock => clock.update());
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

    update() {
        this.drawClock();
    }
}

// Initialize the application
new ClockGrid();
