export class LinearService {
  constructor(server) {
    this.server = server; // MCP server instance
  }

  async createProject(teamId, projectData) {
    // Формируем параметры для Linear
    const { name, description, gameType } = projectData;
    return await this.server.callTool({
      server: 'Linear',
      name: 'createProject',
      arguments: {
        name,
        description: `${description}\n\nGame Type: ${gameType}`,
        teamId,
        state: 'planned',
      },
    });
  }

  async createSprints(teamId, sprints) {
    const createdSprints = [];
    for (const sprint of sprints) {
      const cycle = await this.server.callTool({
        server: 'Linear',
        name: 'createCycle',
        arguments: {
          name: sprint.name,
          startsAt: sprint.startDate,
          endsAt: sprint.endDate,
          teamId: sprint.teamId,
        },
      });
      createdSprints.push(cycle);
    }
    return createdSprints;
  }

  async createIssue(issueData) {
    return await this.server.callTool({
      server: 'Linear',
      name: 'createIssue',
      arguments: {
        title: issueData.title,
        description: issueData.description,
        teamId: issueData.teamId,
        projectId: issueData.projectId,
        cycleId: issueData.sprintId,
        priority: issueData.priority || 3,
        labelIds: issueData.labelIds || [],
      },
    });
  }

  async createGameDevelopmentStructure(teamId, gameName, gameType) {
    // Формируем структуру проекта
    const project = await this.createProject(teamId, {
      name: `${gameName} - ${gameType} Game`,
      description: this.generateProjectDescription(gameName, gameType),
      gameType,
    });
    const sprints = this.generateSprintPlan(teamId);
    const tasks = this.generateGameTasks(gameType);
    const createdSprints = await this.createSprints(teamId, sprints);
    const createdIssues = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const sprintIndex = Math.floor(i / 3);
      const sprint = createdSprints[Math.min(sprintIndex, createdSprints.length - 1)];
      const issue = await this.createIssue({
        ...task,
        teamId,
        projectId: project.id,
        sprintId: sprint?.id,
      });
      createdIssues.push(issue);
    }
    return {
      project,
      sprints: createdSprints,
      issues: createdIssues,
    };
  }

  generateProjectDescription(gameName, gameType) {
    return `## ${gameName}

### Overview
A ${gameType} game built with React Three Fiber, featuring modern web technologies and best practices.

### Tech Stack
- React Three Fiber for 3D graphics
- Rapier for physics simulation
- GSAP for animations
- TypeScript for type safety
- Vite for fast development
- TailwindCSS for styling

### Game Features
- Mobile-first responsive design
- Desktop compatibility
- Start screen with game introduction
- Engaging gameplay mechanics
- Game over screen with score display and confetti celebration
- Play again functionality

### Development Approach
- Agile methodology with defined sprints
- Test-driven development with clear acceptance criteria
- Progressive enhancement for different devices
- Performance optimization for smooth gameplay`;
  }

  generateSprintPlan(teamId) {
    const now = new Date();
    const sprints = [];

    // Sprint 1: Foundation (1 week)
    sprints.push({
      name: 'Sprint 1: Foundation & Setup',
      teamId,
      startDate: now.toISOString(),
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Sprint 2: Core Gameplay (1 week)
    sprints.push({
      name: 'Sprint 2: Core Gameplay',
      teamId,
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Sprint 3: Polish & Optimization (1 week)
    sprints.push({
      name: 'Sprint 3: Polish & Optimization',
      teamId,
      startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return sprints;
  }

  generateGameTasks(gameType) {
    const commonTasks = [
      {
        title: 'Project Setup & Configuration',
        description: `## Task: Setup development environment

### Description
Initialize the project with all required dependencies and configurations.

### Acceptance Criteria
- [ ] Vite project created with React and TypeScript
- [ ] All dependencies installed (@react-three/fiber, @react-three/drei, @react-three/rapier, etc.)
- [ ] TailwindCSS configured
- [ ] Basic folder structure created
- [ ] Git repository initialized
- [ ] Development server runs without errors

### Test Cases
1. Run \`npm install\` - should complete without errors
2. Run \`npm run dev\` - should start development server
3. Open browser - should see initial React app`,
        priority: 1,
      },
      {
        title: 'Create Start Screen',
        description: `## Task: Implement game start screen

### Description
Create an engaging start screen with game title and start button.

### Acceptance Criteria
- [ ] Attractive layout with game title
- [ ] "Start Game" button prominently displayed
- [ ] Responsive design for mobile and desktop
- [ ] Smooth transition to game screen
- [ ] Background animation or visual effects

### Test Cases
1. Load game - should show start screen first
2. Click "Start Game" - should transition to game
3. Resize window - layout should adapt
4. Test on mobile device - should be touch-friendly`,
        priority: 2,
      },
      {
        title: 'Implement Game Over Screen',
        description: `## Task: Create game over screen with confetti

### Description
Implement the game over screen with score display and celebration effects.

### Acceptance Criteria
- [ ] Display final score prominently
- [ ] Show "Play Again" button
- [ ] Trigger confetti explosion on game end
- [ ] Confetti uses 4 custom colors
- [ ] Smooth transition from game to game over screen

### Test Cases
1. Complete game - should show game over screen
2. Verify confetti appears with correct colors
3. Click "Play Again" - should restart game
4. Check confetti parameters match requirements`,
        priority: 3,
      },
      {
        title: 'Mobile Optimization',
        description: `## Task: Optimize game for mobile devices

### Description
Ensure the game runs smoothly on mobile devices with proper controls and performance.

### Acceptance Criteria
- [ ] Touch controls implemented and responsive
- [ ] Performance maintains 60 FPS on mid-range devices
- [ ] UI elements sized appropriately for touch
- [ ] Viewport locked to prevent zoom/scroll
- [ ] Orientation handling (portrait/landscape)

### Test Cases
1. Test on iPhone/Android - controls should work
2. Monitor FPS on mobile - should stay above 30 FPS minimum
3. Touch targets - minimum 44x44px
4. Pinch zoom - should be disabled
5. Screen rotation - game should adapt`,
        priority: 2,
      },
      {
        title: 'Performance Optimization',
        description: `## Task: Optimize game performance

### Description
Implement performance optimizations for smooth gameplay.

### Acceptance Criteria
- [ ] Implement object pooling for frequently created/destroyed objects
- [ ] Use LOD (Level of Detail) for complex meshes
- [ ] Optimize texture sizes and formats
- [ ] Implement frustum culling
- [ ] Monitor and optimize draw calls

### Test Cases
1. Profile with Chrome DevTools - identify bottlenecks
2. Draw calls should be under 100
3. Memory usage should be stable (no leaks)
4. FPS should remain above 30 on low-end devices`,
        priority: 3,
      },
    ];

    const gameSpecificTasks = this.getGameSpecificTasks(gameType);
    
    return [...commonTasks, ...gameSpecificTasks];
  }

  getGameSpecificTasks(gameType) {
    const tasksByType = {
      platformer: [
        {
          title: 'Create Player Character',
          description: `## Task: Implement player character with controls

### Description
Create a 3D player character with movement controls.

### Acceptance Criteria
- [ ] 3D character model rendered
- [ ] Keyboard controls for desktop (WASD/Arrow keys)
- [ ] Touch controls for mobile
- [ ] Jump mechanics implemented
- [ ] Smooth character animations

### Test Cases
1. Press movement keys - character should move
2. Press jump - character should jump with physics
3. Test on mobile - touch controls should work
4. Character should collide with platforms`,
          priority: 1,
        },
        {
          title: 'Design Level System',
          description: `## Task: Create platform levels

### Description
Implement a level system with platforms and obstacles.

### Acceptance Criteria
- [ ] At least 3 different platform types
- [ ] Procedural or designed levels
- [ ] Collision detection working
- [ ] Camera follows player
- [ ] Level progression system

### Test Cases
1. Player lands on platforms correctly
2. Player falls when missing platforms
3. Camera tracks player movement
4. Level difficulty increases`,
          priority: 2,
        },
      ],
      puzzle: [
        {
          title: 'Create Puzzle Grid System',
          description: `## Task: Implement puzzle grid mechanics

### Description
Create the core puzzle grid system with interactions.

### Acceptance Criteria
- [ ] Grid system implemented (e.g., 8x8)
- [ ] Pieces/tiles can be selected
- [ ] Valid moves highlighted
- [ ] Smooth animations for moves
- [ ] Touch and click support

### Test Cases
1. Click/tap piece - should select it
2. Make valid move - should animate smoothly
3. Make invalid move - should be prevented
4. Grid should be responsive to screen size`,
          priority: 1,
        },
        {
          title: 'Implement Puzzle Logic',
          description: `## Task: Add puzzle solving mechanics

### Description
Implement the core puzzle solving logic and win conditions.

### Acceptance Criteria
- [ ] Move validation implemented
- [ ] Score/combo system
- [ ] Win condition detection
- [ ] Difficulty progression
- [ ] Hint system (optional)

### Test Cases
1. Valid moves increase score
2. Invalid moves are blocked
3. Win condition triggers game over
4. Combos multiply score correctly`,
          priority: 2,
        },
      ],
      'endless-runner': [
        {
          title: 'Create Runner Character',
          description: `## Task: Implement auto-running character

### Description
Create a character that automatically runs forward.

### Acceptance Criteria
- [ ] Character runs automatically
- [ ] Jump on tap/click/spacebar
- [ ] Double jump or slide mechanics
- [ ] Smooth animations
- [ ] Responsive controls

### Test Cases
1. Character starts running on game start
2. Tap/click triggers jump
3. Can't jump while already jumping (unless double jump)
4. Character speed increases over time`,
          priority: 1,
        },
        {
          title: 'Implement Obstacle System',
          description: `## Task: Create procedural obstacles

### Description
Generate obstacles and collectibles procedurally.

### Acceptance Criteria
- [ ] Random obstacle generation
- [ ] Different obstacle types
- [ ] Collectible items (coins, power-ups)
- [ ] Difficulty increases over time
- [ ] Fair spacing between obstacles

### Test Cases
1. Obstacles spawn continuously
2. Collision with obstacles ends game
3. Collectibles increase score
4. No impossible obstacle combinations`,
          priority: 2,
        },
      ],
      'physics-based': [
        {
          title: 'Setup Physics World',
          description: `## Task: Configure Rapier physics

### Description
Setup the physics world with proper parameters.

### Acceptance Criteria
- [ ] Rapier physics initialized
- [ ] Gravity configured correctly
- [ ] Physics debug mode available
- [ ] Performance optimized
- [ ] Collision groups setup

### Test Cases
1. Objects fall with realistic gravity
2. Collisions detected accurately
3. Physics runs at stable framerate
4. No physics glitches or explosions`,
          priority: 1,
        },
        {
          title: 'Create Interactive Objects',
          description: `## Task: Implement physics-based gameplay objects

### Description
Create objects that interact with physics realistically.

### Acceptance Criteria
- [ ] Various object shapes/sizes
- [ ] Different material properties
- [ ] Player can interact with objects
- [ ] Objects respond to forces
- [ ] Satisfying physics feedback

### Test Cases
1. Objects stack realistically
2. Throwing/launching objects works
3. Different materials behave differently
4. No objects fall through floor`,
          priority: 2,
        },
      ],
      arcade: [
        {
          title: 'Create Game Controls',
          description: `## Task: Implement arcade-style controls

### Description
Create responsive controls for arcade gameplay.

### Acceptance Criteria
- [ ] Instant response to input
- [ ] Support keyboard and touch
- [ ] Visual feedback on actions
- [ ] Customizable control sensitivity
- [ ] No input lag

### Test Cases
1. Controls respond immediately
2. Multiple inputs handled correctly
3. Touch controls work on mobile
4. Visual feedback matches input`,
          priority: 1,
        },
        {
          title: 'Implement Scoring System',
          description: `## Task: Create engaging scoring mechanics

### Description
Implement score system with multipliers and combos.

### Acceptance Criteria
- [ ] Base scoring implemented
- [ ] Combo system for chains
- [ ] Score multipliers
- [ ] High score tracking
- [ ] Visual score feedback

### Test Cases
1. Actions increase score correctly
2. Combos multiply score
3. High score persists
4. Score displays update smoothly`,
          priority: 2,
        },
      ],
    };

    return tasksByType[gameType] || [];
  }
} 