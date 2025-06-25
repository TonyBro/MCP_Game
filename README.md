# MCP Game Development Server

MCP server for automating the creation of games using React Three Fiber and integration with Linear for project management.

## Features

- 🎮 Automatic game project creation
- 📋 Linear integration for task management
- 🚀 Templates for various game types
- 📱 Mobile-first development approach
- 🎉 Built-in confetti support for celebrations
- 🔧 Best practices and modern technologies

## Installation

1. Clone the repository and go to the directory:
```bash
cd mcp-game-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

4. Add your Linear API key to `.env`:
```
LINEAR_API_KEY=your_linear_api_key_here
```

## Cursor MCP Setup

Add the server to your MCP configuration in Cursor:

```json
{
  "mcpServers": {
    "game-dev": {
      "command": "node",
      "args": ["path/to/mcp-game-server/src/index.js"],
      "env": {
        "LINEAR_API_KEY": "your_linear_api_key_here"
      }
    }
  }
}
```

## Usage

### Create a new game project

```
create_game_project({
  gameName: "My Awesome Game",
  gameType: "platformer", // platformer, puzzle, endless-runner, physics-based, arcade
  teamId: "your-linear-team-id",
  projectPath: "/path/to/create/game"
})
```

### Update knowledge base

```
update_game_knowledge({
  topics: ["react-three-fiber", "game-design", "performance"]
})
```

### Get available templates

```
get_game_templates()
```

## Game Types

- **Platformer** - Platformer with physics and jumping
- **Puzzle** - Grid-based puzzle game with combos
- **Endless Runner** - Endless runner with obstacles
- **Physics-based** - Game with realistic physics
- **Arcade** - Classic arcade game

## Project Structure

Each generated game project includes:

- ✅ Three required screens (Start, Game, Game Over)
- ✅ Confetti on game completion
- ✅ Mobile-first design
- ✅ TypeScript for type safety
- ✅ Vite for fast development
- ✅ TailwindCSS for styling
- ✅ React Three Fiber for 3D graphics
- ✅ Rapier for physics
- ✅ GSAP for animations

## Linear Integration

When creating a project, the following is automatically created:

- A project in Linear with a description
- 3 sprints, each one week long
- Tasks with acceptance criteria and test cases
- Proper distribution of tasks across sprints

## License

MIT 