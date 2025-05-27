Technical Requirements for Analog-Clock-Based Morphing Digital Clock

Overview
A clock that displays time using a 15×8 grid of small analog clocks. The hands of these clocks rotate and synchronize through visually distinct intermediate patterns, ultimately aligning to form a legible HH:MM digital-style time display for several seconds at the end of each minute.

Each clock has:
* Minute hand
* Hour hand
* No second hand
* Hands can move clockwise or counterclockwise
* Hands may rotate at different speeds to hit target orientations at a synchronized timestamp

Reference
This clock design is based on the Kinetic Wall Clock in The Art Collection at Mercedes Benz Stadium. A video of its behavior is available here:
ihttps://www.youtube.com/watch?v=utK3WYRB_ww

Look & Feel
Grid size: 15 columns × 8 rows = 120 small clocks

Each clock face has:

* A visible recessed circular outline
* Two hands (hour and minute)
* The overall look resembles a mechanical display built from synchronized rotating clock faces

Behavior Cycle (Every Minute)
Phase Name	Duration	Description
Pre-Transition 1	~5 s	Clocks begin to shift, rotating hands in waves or ripples
Intermediate Form 1	~5 s	Hands align to form abstract collective shapes
Pre-Transition 2	~5 s	Clocks begin to shift, rotating hands in waves or ripples
Intermediate Form 2	~5 s	Hands align to form abstract collective shapes
Pre-Transition 3	~5 s	Clocks begin to shift, rotating hands in waves or ripples
Intermediate Form 3	~5 s	Hands align to form abstract collective shapes
Pre-Transition 4	~5 s	Clocks begin to shift, rotating hands in waves or ripples
Intermediate Form 4	~5 s	Hands align to form abstract collective shapes
Pre-Transition 5	~5 s	Clocks begin to shift, rotating hands in waves or ripples
Intermediate Form 5	~5 s	Hands align to form abstract collective shapes
Time Display	10 s	Clocks align hands to form digital HH:MM time

Each of the 5 intermediate forms will be determined from an entry in patterns.json

🔣 Digit Display in 15×8 Grid
Each digit spans approx. 3×5 clocks
Time format: HH:MM, total of 4 digits + 1 colon separator
Typical layout:
H1: columns 1–3
H2: columns 4–6
Colon: columns 7–8 (2 clocks aligned vertically)
M1: columns 9–11
M2: columns 12–14
Digit rows: typically rows 2–6 (5 rows used)
Remaining clocks are used for transitions and effects

Variable Rotation Rates
Each clock can rotate its hands at independent speeds, allowing:
* Staggered transitions
* Spiraling patterns
* Synchronized arrivals to final form
* Rotation rate is dynamically calculated:
* Based on current angle and target angle
* Adjusted to finish within a predefined segment duration (e.g., 2 seconds)

Intermediate Named Forms
These are collective shapes formed by the grid during the transition phase:

Shape Name	Description
Swirl In	Hands form a spiral shape across the grid, either clockwise or counterclockwise
Wave Sweep	Rows or columns animate hands like a ripple or ocean wave
Arrowhead	All clocks point toward a center or directional vector (like → or ↓)
Spokes	Radiating lines from center, forming a radial starburst
Windmill	All hands rotate around shared angles in coordinated spinning motion
Crisscross	Hands form X patterns across the grid, mirrored diagonals
Columns	Hands align vertically down the grid in cascading rows
Blank Tilt	All clocks tilt hands at same diagonal, e.g., 45°/225° angles
Digital Grid Ghost	A faded preview outline of the digits appears ahead of time

Look & Feel
1. Digit Composition
* Each large digit (0–9) is composed of a grid of miniature analog clocks.
* Each analog clock is a circular face with visible minute and hour (or second) hands.
* Hands are rendered clearly and are distinguishable by color or thickness.

2. Grid Structure
* 15x8 2D grid to define each digit shape.
* Grid spacing and clock size must scale fluidly based on screen size.

3. Color & Theme
* Configurable: Default is white hands on black background.
* Option to use themes with custom clock face and hand styles.
* Optional: Background or hand glow effect for aesthetic enhancement.

Behavior
1. Time Representation
* Clock displays real-time HH:MM using morphing digit shapes.
* Each digit morphs on change using motion of analog clock hands.

2. Clock Hand Control
* Each mini-clock is rotated to point its hands in a specific direction that contributes to the overall digit shape.
* Morphing between digits is achieved by rotating the hands of the clocks from one configuration to another.
* Hands can move clockwise or counter-clockwise for shortest path.
* Rotation is fluid and can use easing (e.g., easeInOut).

3. Digit Animation Logic
* On digit change (e.g., from 1 to 2), each clock transitions its hands from current to new target angles.
* Optional: use morphing interpolation to smoothly animate hand transitions.
* Clocks not involved in forming a digit can fade or idle with subtle motion.

Implementation Requirements
1. Digit Map Encoding
Each digit (0–9) is mapped to a 2D grid of target hand directions (e.g., vectors or angle pairs) in digits.json.

The entire font set is essentially a dictionary of digit→clock hand configurations.

2. Hand Animation
Animate via:
* Rotation transformations on hand elements (SVG/CSS/WebGL/native).
* Use shortest rotation direction (clockwise or counterclockwise).
* Synchronize hand movement timing across all clocks involved in a transition.

3. Performance
* GPU-accelerated rendering is strongly recommended (Canvas/WebGL/SpriteKit).
* Batch updates to minimize draw calls when possible.
* Frame rate target: 60fps on most devices.

