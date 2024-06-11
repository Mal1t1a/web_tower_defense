import { Enemy } from './Enemy.js';
import { path } from './Path.js';
import { EventEmitter } from './eventEmitter.js';
import { updateScore, updateWave, updateLives, updateCurrency, setActiveWaveUI, setInactiveWaveUI, hideUpgradeButton, showUpgradeButton } from './ui.js';
import { CircleParticle, SquareParticle, TextParticle } from './particles/index.js';

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

export async function startWave()
{
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
};

export function endWave()
{
	waveActive = false;
	setInactiveWaveUI();
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
			const type = Math.random() > 0.5 ? 'basic' : 'fast';
			const speed = type === 'basic' ? 100 : 200;
			let healthMultiplier = waveNumber; // Increase health with each wave
			const enemy = new Enemy(path, speed, type);
			if (waveNumber % 5 === 0 && enemiesSpawned >= enemiesPerWave-1)
			{
				healthMultiplier *= 2;
				enemy.color = { r: 255, g: 255, b: 0, a: 1 };
			}
			enemy.health *= healthMultiplier;
			enemy.maxHealth *= healthMultiplier;
			enemy.bounty += waveNumber - 1;
			enemies.push(enemy);
			retObj = enemy;
			enemiesSpawned++;
			enemySpawnTimer = 1 / enemySpawnRate;
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
};

export function decreaseCurrency(amount)
{
	currency -= amount;
	updateCurrency(currency);
	checkShowUpgradeButton();
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
		textParticle(400, 300, `-${amount} Lives`, {r: 255, g: 0, b: 0}, 50, 2, '48px Arial');
	}
	else
	{
		textParticle(400, 300, `-${amount} Life`, {r: 255, g: 0, b: 0}, 50, 2, '48px Arial');
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

	updateScore(score);
	updateWave(waveNumber);
	updateCurrency(currency);
	updateLives(lives);
	setMousePosition(null, null);
	setSelectedPosition(null, null);
	hideUpgradeButton();
	setInactiveWaveUI();
};

export function setMousePosition(x, y)
{
	mouseX = x;
	mouseY = y;
};

export function setSelectedPosition(x, y)
{
	selectedX = x;
	selectedY = y;
};

export function setShowPathIndicator(value)
{
	showPathIndicator = value;
};

export function checkShowUpgradeButton()
{
	if (selectedX === null || selectedY === null)
	{
		return;
	}

	const tower = towers.find(tower => tower.x === selectedX && tower.y === selectedY);
	if (tower && currency >= tower.upgradeCost)
	{
		showUpgradeButton();
	}
	else
	{
		hideUpgradeButton();
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
	}
};