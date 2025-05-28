# Changelog

## 2025-05-27
### Removed
- Deleted deprecated `test-clock.js` file
  - Functionality moved to `clock.js` module

### Added
- Temporary test clock implementation for debugging
  - Fixed red hand at 3pm (90°)
  - Rotating green hand (360°/minute)
  - Debug information display
- 10-second time display phase before animations
- Synchronized transition timing across all clocks

### Changed
- Updated Vite CSP configuration to allow inline scripts
- Reduced clock size to 60px for grid layout
- Added horizontal scrolling support

## [Unreleased]
### Added
- Created shared `TimeDisplay` class in `time-display.js`

### Changed
- Refactored time display logic in `index.html` and `test-4digit.html` to use new shared implementation

### Removed
- Removed duplicate grid creation logic from multiple files
