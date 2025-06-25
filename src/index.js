import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { GameProjectManager } from './services/gameProjectManager.js';
import { GameTemplateService } from './services/gameTemplateService.js';
import { LinearService } from './services/linearService.js';

class GameDevelopmentMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'game-dev-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.linearService = new LinearService(this.server);
    this.gameTemplateService = new GameTemplateService();
    this.gameProjectManager = new GameProjectManager(
      this.linearService,
      this.gameTemplateService
    );

    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_game_project',
          description: 'Create a new game project with Linear integration and setup',
          inputSchema: {
            type: 'object',
            properties: {
              gameName: {
                type: 'string',
                description: 'Name of the game',
              },
              gameType: {
                type: 'string',
                enum: ['platformer', 'puzzle', 'endless-runner', 'physics-based', 'arcade'],
                description: 'Type of game to create',
              },
              teamId: {
                type: 'string',
                description: 'Linear team ID for project creation',
              },
              projectPath: {
                type: 'string',
                description: 'Path where to create the game project',
              },
            },
            required: ['gameName', 'gameType', 'teamId', 'projectPath'],
          },
        },
        {
          name: 'update_game_knowledge',
          description: 'Update knowledge about game development best practices and technologies',
          inputSchema: {
            type: 'object',
            properties: {
              topics: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'Topics to research and update knowledge about',
              },
            },
            required: ['topics'],
          },
        },
        {
          name: 'get_game_templates',
          description: 'Get available game templates',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'create_game_project':
          return await this.createGameProject(args);
        case 'update_game_knowledge':
          return await this.updateGameKnowledge(args);
        case 'get_game_templates':
          return await this.getGameTemplates();
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async createGameProject(args) {
    try {
      const result = await this.gameProjectManager.createProject(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating game project: ${error.message}`,
          },
        ],
      };
    }
  }

  async updateGameKnowledge(args) {
    try {
      // This would integrate with documentation services
      const updates = await this.gameTemplateService.updateKnowledge(args.topics);
      return {
        content: [
          {
            type: 'text',
            text: `Knowledge updated for topics: ${args.topics.join(', ')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating knowledge: ${error.message}`,
          },
        ],
      };
    }
  }

  async getGameTemplates() {
    const templates = this.gameTemplateService.getAvailableTemplates();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(templates, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Game Development Server running...');
  }
}

const server = new GameDevelopmentMCPServer();
server.run().catch(console.error); 