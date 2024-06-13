import { path01, path02, path03, path04 } from './paths/index.js';
import { EventEmitter } from './eventEmitter.js';
import { updateScore, updateWave, updateLives, updateCurrency, setActiveWaveUI, setInactiveWaveUI, hideUpgradeButton, showUpgradeButton, setUpgradeButtonText, showSellTowerButton, hideSellTowerButton, setSellTowerButtonText, showBuildMenu, hideBuildMenu, editorUI, gameUI } from './ui.js';
import { CircleParticle, SquareParticle, TextParticle } from './particles/index.js';
import { BasicEnemy, BossEnemy, FastEnemy } from './enemies/index.js';
import { isOnPath, isOccupied } from './eventHandlers.js';

export const towers = [];
export const enemies = [];
export const particles = [];
export let enemySpawnTimer = 0;
export let enemySpawnRate = 1; //per second
export let score = 0;
export let lives = 0;
export let gameOver = false;
export let waveNumber = 0;
export let enemiesPerWave = 0;
export let enemiesSpawned = 0;
export let waveActive = false;
export let currency = 0;
export let mouseX = null;
export let mouseY = null;
export let selectedX = null;
export let selectedY = null;
export let showPathIndicator = true;
export let autoStartWave = false;
export let currentPath = path03;
export let waveIsActivating = false;
export let waveIsDeactivating = false;
export let difficulty = 1;
export let isPathEditing = false;
export let gridSize = 40;

export let selectedRNGPath = RandomNumber(1, 4);
for (var i = 0; i < 10; i++)
{
	selectedRNGPath = RandomNumber(1, 4);
}

switch (selectedRNGPath)
{
	case 1:
		currentPath = path01;
		break;
	case 2:
		currentPath = path02;
		break;
	case 3:
		currentPath = path03;
		break;
	case 4:
		currentPath = path04;
		break;
}

export function RandomNumber(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function startWave()
{
	if (waveActive || waveIsActivating || waveIsDeactivating || gameOver)
	{
		return;
	}
	waveIsActivating = true;
	waveNumber++;
	enemiesPerWave += 2;
	enemiesSpawned = 0;
	enemySpawnRate += 0.1;

	if (waveNumber % 5 === 0)
	{
		enemiesPerWave += 5;
		enemySpawnRate += 0.5;
	}

	updateScore(score);
	updateWave(waveNumber);
	updateCurrency(currency);
	updateLives(lives);
	await setActiveWaveUI();
	waveActive = true;
	waveIsActivating = false;
};

export async function endWave()
{
	waveActive = false;
	if (autoStartWave)
	{
		startWave();
	}
	else
	{
		waveIsDeactivating = true;
		await setInactiveWaveUI();
		waveIsDeactivating = false;
	}
};

export function particleExplosion(x, y, color, amount = 10)
{
	for (let i = 0; i < amount; i++)
	{
		const particle = new SquareParticle(x, y, 1 + (Math.random() * 2), color, Math.random() * Math.PI * 2, Math.random() * 50);
		particles.push(particle);
	}
}

export function textParticle(x, y, text, color, speed, lifetime = 1, font = '28px Arial', textAlign = 'center')
{
	const particle = new TextParticle(x, y, text, color, speed, lifetime, font, textAlign);
	particles.push(particle);
}

export function addEnemy(deltaTime)
{
	let retObj = null;
	if (waveActive && enemiesSpawned < enemiesPerWave)
	{
		if (enemySpawnTimer > 0)
		{
			enemySpawnTimer -= deltaTime;
		}
		if (enemySpawnTimer <= 0)
		{
			//rng between 1 and 2
			const rngEnemy = Math.floor(Math.random() * 2) + 1;
			let enemy = null;
			let healthMultiplier = waveNumber; // Increase health with each wave

			switch (rngEnemy)
			{
				case 1:
					enemy = new BasicEnemy({ path: currentPath });
					break;
				case 2:
					enemy = new FastEnemy({ path: currentPath });
					break;
			}

			if (waveNumber % 5 === 0)
			{
				let bossWaveNumber = waveNumber / 5;
				if (enemiesSpawned >= enemiesPerWave - bossWaveNumber)
				{
					enemy = new BossEnemy({ path: currentPath });
					healthMultiplier *= 3;
				}
			}

			enemy.health *= healthMultiplier;
			enemy.maxHealth *= healthMultiplier;
			enemy.bounty += waveNumber - 1;
			enemies.push(enemy);

			enemiesSpawned++;
			enemySpawnTimer = 1 / enemySpawnRate;

			retObj = enemy;
		}
	}
	if (enemiesSpawned >= enemiesPerWave && enemies.length === 0 && waveActive)
	{
		endWave();
	}
	return retObj;
};

export function increaseScore(points)
{
	score += points;
	updateScore(score);
};

export function increaseCurrency(amount)
{
	currency += amount;
	updateCurrency(currency);
	checkShowUpgradeButton();
	checkShowSellTowerButton();
};

export function decreaseCurrency(amount)
{
	currency -= amount;
	updateCurrency(currency);
	checkShowUpgradeButton();
	checkShowSellTowerButton();
};

export function increaseLives(amount)
{
	lives += amount;
	updateLives(lives);
};

export function decreaseLives(amount)
{
	lives -= amount;
	updateLives(lives);
	if (amount > 1)
	{
		textParticle(400, 300, `-${amount} Lives`, { r: 255, g: 0, b: 0 }, 50, 2, '48px Arial');
	}
	else
	{
		textParticle(400, 300, `-${amount} Life`, { r: 255, g: 0, b: 0 }, 50, 2, '48px Arial');
	}
};

export function setGameOver()
{
	gameOver = true;
};

export function resetGame()
{
	particles.length = 0;
	towers.length = 0;
	enemies.length = 0;
	enemySpawnTimer = 0;
	enemySpawnRate = 1;
	score = 0;
	lives = 10;
	gameOver = false;
	waveNumber = 0;
	enemiesPerWave = 5;
	enemiesSpawned = 0;
	waveActive = false;
	currency = 50;
	mouseX = null;
	mouseY = null;
	selectedX = null;
	selectedY = null;
	showPathIndicator = true;
	autoStartWave = false;
	waveIsActivating = false;
	waveIsDeactivating = false;
	difficulty = 1;
	isPathEditing = false;
	gridSize = 40;

	updateScore(score);
	updateWave(waveNumber);
	updateCurrency(currency);
	updateLives(lives);
	setMousePosition(null, null);
	setSelectedPosition(null, null);
	hideUpgradeButton();
	hideSellTowerButton();
	setInactiveWaveUI();
	setUpgradeButtonText(0);
	setSellTowerButtonText(0);
};

export function setMousePosition(x, y)
{
	mouseX = x;
	mouseY = y;
};

export function setSelectedPosition(x, y)
{
	if (selectedX === x && selectedY === y)
	{
		hideBuildMenu();
		checkShowSellTowerButton();
		checkShowUpgradeButton();
		selectedX = null;
		selectedY = null;
		return;
	}
	selectedX = x;
	selectedY = y;

	if (isOnPath(x, y))
	{
		hideBuildMenu();
	}
	else if (isOccupied(x, y))
	{
		hideBuildMenu();
	}
	else
	{
		showBuildMenu();
	}
	checkShowSellTowerButton();
	checkShowUpgradeButton();
};

export function setShowPathIndicator(value)
{
	showPathIndicator = value;
};

export function checkShowUpgradeButton()
{
	if (selectedX === null || selectedY === null)
	{
		hideUpgradeButton();
		setUpgradeButtonText(0);
		return;
	}

	const tower = towers.find(tower => tower.x === selectedX && tower.y === selectedY);
	if (tower && currency >= tower.upgradeCost)
	{
		showUpgradeButton();
		setUpgradeButtonText(tower.upgradeCost);
	}
	else
	{
		hideUpgradeButton();
		if (tower)
		{
			setUpgradeButtonText(tower.upgradeCost);
		}
		else
		{
			setUpgradeButtonText(0);
		}
	}
};

export function upgradeTower()
{
	if (selectedX === null || selectedY === null)
	{
		return;
	}

	const tower = towers.find(tower => tower.x === selectedX && tower.y === selectedY);
	if (tower && currency >= tower.upgradeCost)
	{
		let cost = tower.upgradeCost;
		tower.upgrade();
		decreaseCurrency(cost);
		checkShowUpgradeButton();
	}
};

export function sellTower()
{
	if (selectedX === null || selectedY === null)
	{
		return;
	}

	const tower = towers.find(tower => tower.x === selectedX && tower.y === selectedY);
	if (tower)
	{
		let value = Math.round(tower.upgradeCost / 2 * 0.75);
		increaseCurrency(value);
		towers.splice(towers.indexOf(tower), 1);
		checkShowSellTowerButton();
		checkShowUpgradeButton();
		showBuildMenu();
	}
};

export function checkShowSellTowerButton()
{
	if (selectedX === null || selectedY === null)
	{
		hideSellTowerButton();
		setSellTowerButtonText(0);
		return;
	}

	const tower = towers.find(tower => tower.x === selectedX && tower.y === selectedY);
	if (tower)
	{
		showSellTowerButton();
		setSellTowerButtonText(Math.round(tower.upgradeCost / 2 * 0.75));
	}
	else
	{
		hideSellTowerButton();
		setSellTowerButtonText(0);
	}

}

export function setAutoStartWave(value)
{
	autoStartWave = value;
};

export function setEnemyPath(newPath)
{
	currentPath = newPath;
};

export function setDifficulty(value)
{
	difficulty = value;
};

export function setPathEditing(value)
{
	isPathEditing = value;
	editorUI.style.display = value ? 'flex' : 'none';
	gameUI.style.display = value ? 'none' : 'block';
};

export function setGridSize(value)
{
	gridSize = value;
};
