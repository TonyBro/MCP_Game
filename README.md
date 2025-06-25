# MCP Game Development Server

MCP-сервер для автоматизации создания игр с использованием React Three Fiber и интеграцией с Linear для управления проектами.

## Возможности

- 🎮 Автоматическое создание игровых проектов
- 📋 Интеграция с Linear для управления задачами
- 🚀 Шаблоны для различных типов игр
- 📱 Mobile-first подход к разработке
- 🎉 Встроенная поддержка конфетти для празднования побед
- 🔧 Лучшие практики и современные технологии

## Установка

1. Клонируйте репозиторий и перейдите в директорию:
```bash
cd mcp-game-server
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```

4. Добавьте ваш Linear API ключ в `.env`:
```
LINEAR_API_KEY=your_linear_api_key_here
```

## Настройка в Cursor

Добавьте сервер в конфигурацию MCP в Cursor:

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

## Использование

### Создание нового игрового проекта

```
create_game_project({
  gameName: "My Awesome Game",
  gameType: "platformer", // platformer, puzzle, endless-runner, physics-based, arcade
  teamId: "your-linear-team-id",
  projectPath: "/path/to/create/game"
})
```

### Обновление базы знаний

```
update_game_knowledge({
  topics: ["react-three-fiber", "game-design", "performance"]
})
```

### Получение доступных шаблонов

```
get_game_templates()
```

## Типы игр

- **Platformer** - Платформер с физикой и прыжками
- **Puzzle** - Головоломка с сеткой и комбинациями
- **Endless Runner** - Бесконечный раннер с препятствиями
- **Physics-based** - Игра с реалистичной физикой
- **Arcade** - Классическая аркадная игра

## Структура проекта

Каждый созданный игровой проект включает:

- ✅ Три обязательных экрана (Start, Game, Game Over)
- ✅ Конфетти при завершении игры
- ✅ Mobile-first дизайн
- ✅ TypeScript для типобезопасности
- ✅ Vite для быстрой разработки
- ✅ TailwindCSS для стилизации
- ✅ React Three Fiber для 3D графики
- ✅ Rapier для физики
- ✅ GSAP для анимаций

## Linear интеграция

При создании проекта автоматически создается:

- Проект в Linear с описанием
- 3 спринта по неделе каждый
- Задачи с критериями приемки и тест-кейсами
- Правильное распределение задач по спринтам

## Лицензия

MIT 