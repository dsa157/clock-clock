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
- 15×8 clock grid implementation (120 clocks)

### Changed
- Updated Vite CSP configuration to allow inline scripts
- Reduced clock size to 60px for grid layout
- Added horizontal scrolling support
