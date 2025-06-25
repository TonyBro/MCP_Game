import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

export class GameProjectManager {
  constructor(linearService, gameTemplateService) {
    this.linearService = linearService;
    this.gameTemplateService = gameTemplateService;
  }

  async createProject(args) {
    const { gameName, gameType, teamId, projectPath } = args;
    
    console.log(chalk.blue('\n🎮 Creating game project...\n'));
    
    // Step 1: Update knowledge base
    const knowledgeSpinner = ora('Updating knowledge base...').start();
    try {
      await this.gameTemplateService.updateKnowledge([
        'react-three-fiber',
        'game-design',
        'performance',
      ]);
      knowledgeSpinner.succeed('Knowledge base updated');
    } catch (error) {
      knowledgeSpinner.fail('Failed to update knowledge base');
    }

    // Step 2: Create Linear project structure (via MCP tool call)
    const linearSpinner = ora('Creating Linear project...').start();
    let linearProject;
    try {
      linearProject = await this.linearService.createGameDevelopmentStructure(
        teamId,
        gameName,
        gameType
      );
      linearSpinner.succeed('Linear project created successfully');
      
      console.log(chalk.green('\n✅ Linear project setup complete!'));
      console.log(chalk.yellow(`\nProject: ${linearProject.project.name}`));
      console.log(chalk.yellow(`Sprints: ${linearProject.sprints.length}`));
      console.log(chalk.yellow(`Tasks: ${linearProject.issues.length}`));
    } catch (error) {
      linearSpinner.fail('Failed to create Linear project');
      throw error;
    }

    // Step 3: Ask for confirmation to proceed
    const confirmation = await this.askForConfirmation(linearProject);
    
    if (!confirmation.proceed) {
      return {
        status: 'cancelled',
        message: 'Project creation cancelled by user',
        linearProject,
      };
    }

    // Step 4: Generate game template
    const templateSpinner = ora('Generating game template...').start();
    let generatedPath;
    try {
      generatedPath = await this.gameTemplateService.generateGameTemplate(
        gameType,
        gameName,
        projectPath
      );
      templateSpinner.succeed('Game template generated');
    } catch (error) {
      templateSpinner.fail('Failed to generate game template');
      throw error;
    }

    // Step 5: Create setup instructions
    const setupInstructions = this.generateSetupInstructions(gameName, generatedPath);

    return {
      status: 'success',
      message: 'Game project created successfully!',
      linearProject,
      projectPath: generatedPath,
      setupInstructions,
      nextSteps: [
        `cd ${generatedPath}`,
        'npm install',
        'npm run dev',
      ],
    };
  }

  async askForConfirmation(linearProject) {
    console.log(chalk.cyan('\n📋 Project Summary:'));
    console.log(chalk.white(`
Project Name: ${linearProject.project.name}
Total Sprints: ${linearProject.sprints.length}
Total Tasks: ${linearProject.issues.length}

Sprint Breakdown:
${linearProject.sprints.map((sprint, index) => {
  const sprintIssues = linearProject.issues.filter(
    issue => issue.cycleId === sprint.id
  );
  return `  ${index + 1}. ${sprint.name} - ${sprintIssues.length} tasks`;
}).join('\n')}
    `));

    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'The Linear project has been created. Do you want to proceed with generating the game code?',
        default: true,
      },
    ]);

    return answer;
  }

  generateSetupInstructions(gameName, projectPath) {
    return `
${chalk.bold.green('🎉 Game Project Setup Complete!')}

${chalk.bold('Project Details:')}
- Name: ${gameName}
- Location: ${projectPath}

${chalk.bold('Next Steps:')}

1. ${chalk.cyan('Navigate to your project:')}
   ${chalk.gray('$')} cd ${projectPath}

2. ${chalk.cyan('Install dependencies:')}
   ${chalk.gray('$')} npm install

3. ${chalk.cyan('Start development server:')}
   ${chalk.gray('$')} npm run dev

4. ${chalk.cyan('Open your browser:')}
   Navigate to ${chalk.underline('http://localhost:5173')}

${chalk.bold('Development Tips:')}
- The game follows mobile-first design principles
- All screens (Start, Game, Game Over) are pre-configured
- Confetti celebration is integrated on game completion
- Physics are powered by Rapier
- 3D graphics use React Three Fiber

${chalk.bold('Linear Integration:')}
- Your project board is ready in Linear
- Tasks are organized into 3 sprints
- Each task has acceptance criteria and test cases
- Update task status as you complete them

${chalk.yellow('Happy game development! 🎮')}
`;
  }
} 