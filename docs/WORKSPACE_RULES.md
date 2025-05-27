* do not use any code that vill violate Content Security Policy 
* do not suggest moving files into the public folder. keep them in src

## Test Page Access

- The test clock is available at: `http://localhost:5173/test`
- This routes through Vite's proxy to `/src/test.html`
- Direct file access may not work due to module resolution
