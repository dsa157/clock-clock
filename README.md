## Project Guidelines

Please review the [Workspace Rules](docs/WORKSPACE_RULES.md) for coding standards and contribution guidelines specific to this project.

## Animation System

Each `Clock` manages its own animation state. To animate:

```javascript
// Animate single clock
clock.animateTo('3:45', 2000); // 2 second duration

// Animate grid
grid.animateGrid(startPattern, endPattern, 5000); // 5 second duration
```

Key features:
- Smooth simultaneous hand movement
- Direct path calculation between positions
- Configurable duration (in milliseconds)

# clock-clock