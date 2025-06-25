// Example usage of MCP Game Development Server

// 1. First, update knowledge about game development technologies
await updateGameKnowledge({
  topics: ['react-three-fiber', 'game-design', 'performance']
})

// 2. Get available game templates
const templates = await getGameTemplates()
console.log('Available templates:', templates)

// 3. Create a new game project
const result = await createGameProject({
  gameName: 'Space Invaders 3D',
  gameType: 'arcade',
  teamId: 'your-linear-team-id',
  projectPath: '/Users/username/projects'
})

// The MCP server will:
// - Create a Linear project with sprints and tasks
// - Ask for confirmation to proceed
// - Generate the complete game codebase
// - Provide setup instructions

// Example response structure:
/*
{
  status: 'success',
  message: 'Game project created successfully!',
  linearProject: {
    project: { id: '...', name: 'Space Invaders 3D - arcade Game' },
    sprints: [ ... ],
    issues: [ ... ]
  },
  projectPath: '/Users/username/projects/space-invaders-3d',
  setupInstructions: '...',
  nextSteps: [
    'cd /Users/username/projects/space-invaders-3d',
    'npm install',
    'npm run dev'
  ]
}
*/ 