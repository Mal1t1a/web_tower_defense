import { drawGrid, drawPath, clearCanvas, drawGhostedTower, drawSelection } from './js/drawing.js';
import { towers, enemies, particles, enemySpawnTimer, score, lives, gameOver, waveNumber, enemiesPerWave, enemiesSpawned, waveActive, currency, startWave, addEnemy, resetGame, increaseScore, increaseCurrency, decreaseCurrency, setGameOver, decreaseLives, mouseX, mouseY, selectedX, selectedY, setMousePosition, showPathIndicator, setPathEditing, setGridSize, currentPath, isPathEditing } from './js/gameState.js';
import { handleCanvasClick, isOccupied, isOnPath, handleCanvasMouseMove } from './js/eventHandlers.js';
import { ctx, canvas } from './js/ui.js';
import { PathIndicator } from './js/PathIndicator.js';
import { Editor } from './js/Editor.js';

const pathIndicators = [
	new PathIndicator({ path: currentPath, offset: 0 }),
	new PathIndicator({ path: currentPath, offset: 4 }),
	new PathIndicator({ path: currentPath, offset: 14 }),
	new PathIndicator({ path: currentPath, offset: 19 }),
];

const FPS = 60;
const FRAME_DURATION = 1000 / FPS;
let speedMultiplier = 1;

function updateGameLogic(deltaTime)
{
	if (gameOver)
	{
		return;
	}

	particles.forEach((particle, index) =>
	{
		if (particle.update(deltaTime))
		{
			particles.splice(index, 1);
		}
	});

	towers.forEach(tower =>
	{
		tower.shoot(enemies, deltaTime);
		tower.update(enemies, deltaTime);
	});

	enemies.forEach((enemy, index) =>
	{
		enemy.move(deltaTime);

		// Check if enemy reached the end of the path
		if (enemy.currentPoint >= currentPath.length - 1)
		{
			enemies.splice(index, 1);
			decreaseLives(1); // Decrease base health when an enemy reaches the end
			if (lives <= 0)
			{
				setGameOver();
			}
		}
		else if (enemy.health <= 0)
		{
			increaseScore(enemy.bounty); // Increase score when an enemy is defeated
			increaseCurrency(enemy.bounty); // Increase currency when an enemy is defeated
			enemies.splice(index, 1);
		}
	});

	if (addEnemy(deltaTime))
	{
		console.log("Spawned enemy");
	}

	if (showPathIndicator)
	{
		// pathIndicator.move(deltaTime);
		pathIndicators.forEach(indicator => indicator.move(deltaTime));
	}
}

function renderGame()
{
	if (gameOver)
	{
		ctx.fillStyle = 'red';
		ctx.font = '50px Arial';
		ctx.textAlign = 'center';
		ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
		requestAnimationFrame(renderGame);
		return;
	}

	clearCanvas();
	drawGrid(ctx, canvas.width, canvas.height);
	drawPath(ctx, currentPath);

	towers.forEach(tower =>
	{
		tower.draw(ctx);
		tower.projectiles.forEach(projectile => projectile.draw(ctx));
	});

	enemies.forEach((enemy, index) =>
	{
		enemy.draw(ctx);
	});

	if (isPathEditing)
	{
		if (mouseX !== null && mouseY !== null)
		{
			drawGhostedTower(mouseX, mouseY, 'rgba(255, 255, 255, 0.25)');
		}
	}
	else
	{
		if (mouseX !== null && mouseY !== null)
		{
			if (isOnPath(mouseX, mouseY))
			{
				drawGhostedTower(mouseX, mouseY, 'rgba(255, 0, 0, 0.5)');
			}
			else if (isOccupied(mouseX, mouseY))
			{
				drawGhostedTower(mouseX, mouseY, 'rgba(0, 125, 255, 0.15)');
			}
			else
			{
				drawGhostedTower(mouseX, mouseY, 'rgba(255, 255, 255, 0.25)');
			}
		}
	
		if (selectedX !== null && selectedY !== null)
		{
			if (!isOccupied(selectedX, selectedY) && !isOnPath(selectedX, selectedY))
			{
				ctx.shadowColor = `rgba(0, 125, 255, 1)`;
				ctx.shadowBlur = 5;
				drawSelection(selectedX, selectedY, 'rgba(0, 125, 255, 0.5)');
				ctx.shadowBlur = 0;
			}
			else if (isOnPath(selectedX, selectedY))
			{
				drawGhostedTower(selectedX, selectedY, 'rgba(255, 0, 0, 0.5)');
			}
			else if (isOccupied(selectedX, selectedY))
			{
				ctx.shadowColor = `rgba(0, 125, 255, 1)`;
				ctx.shadowBlur = 5;
				drawSelection(selectedX, selectedY, 'rgba(0, 125, 255, 0.5)');
				ctx.shadowBlur = 0;
			}
		}
	}

	if (showPathIndicator)
	{
		// pathIndicator.draw(ctx);
		pathIndicators.forEach(indicator => indicator.draw(ctx));
	}

	particles.forEach(particle => particle.draw(ctx));

	requestAnimationFrame(renderGame);
}

function gameUpdateLoop()
{
	const deltaTime = (FRAME_DURATION / 1000) * speedMultiplier;
	updateGameLogic(deltaTime);
}

if (window.location.hash === "#edit")
{
	setPathEditing(true);
	setGridSize(20);

	const editor = new Editor({ FPS, FRAME_DURATION, speedMultiplier });
	// setInterval(editor.update.bind(editor), FRAME_DURATION);
	// requestAnimationFrame(editor.render.bind(editor));
}
else
{
	setInterval(gameUpdateLoop, FRAME_DURATION);
	requestAnimationFrame(renderGame);

	canvas.addEventListener('click', (event) => handleCanvasClick(event, canvas));
	canvas.addEventListener('mousemove', (event) => handleCanvasMouseMove(event, canvas));
	canvas.addEventListener('mouseleave', () => setMousePosition(null, null));

	resetGame();
}