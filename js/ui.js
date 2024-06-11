import { resetGame, startWave, currency, waveNumber, setShowPathIndicator } from "./gameState.js";
import { handleBuildTowerClick } from "./eventHandlers.js";

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export const txtScore = document.getElementById('txtScore');
export const txtWave = document.getElementById('txtWave');
export const txtLives = document.getElementById('txtLives');
export const txtCurrency = document.getElementById('txtCurrency');
export const btnStartWave = document.getElementById('btnStartWave');
export const btnResetGame = document.getElementById('btnResetGame');
export const buildMenu = document.getElementById('buildMenu');
export const btnBuildArrowTower = document.getElementById('btnBuildArrowTower');
export const btnBuildCannonTower = document.getElementById('btnBuildCannonTower');
export const btnBuildIceTower = document.getElementById('btnBuildIceTower');
export const btnBuildFireTower = document.getElementById('btnBuildFireTower');
export const btnBuildLightningTower = document.getElementById('btnBuildLightningTower');
export const waveStart = document.getElementById('waveStart');
export const waveClear = document.getElementById('waveClear');

canvas.width = 800;
canvas.height = 600;

btnStartWave.addEventListener('click', startWave);
btnResetGame.addEventListener('click', resetGame);
btnBuildArrowTower.addEventListener('click', () => handleBuildTowerClick('arrow'));
btnBuildCannonTower.addEventListener('click', () => handleBuildTowerClick('cannon'));
btnBuildIceTower.addEventListener('click', () => handleBuildTowerClick('ice'));
btnBuildFireTower.addEventListener('click', () => handleBuildTowerClick('fire'));
btnBuildLightningTower.addEventListener('click', () => handleBuildTowerClick('lightning'));

export function updateScore(score)
{
	txtScore.textContent = `Score: ${score}`;
};

export function updateWave(wave)
{
	txtWave.textContent = `Wave: ${wave}`;
};

export function updateLives(lives)
{
	txtLives.textContent = `Lives: ${lives}`;
};

export function updateCurrency(currency)
{
	txtCurrency.textContent = `Currency: ${currency}`;
	buildMenu.querySelectorAll('button').forEach(button =>
	{
		const cost = button.dataset.cost;
		if (cost && currency < cost)
		{
			button.classList.add('inactive');
		}
		else
		{
			button.classList.remove('inactive');
		}
	});
};

export function setActiveWaveUI()
{
	return new Promise((resolve, reject) =>
	{
		btnStartWave.classList.add('inactive');
		setShowPathIndicator(false);
		waveStart.querySelector('h1').textContent = `Wave ${waveNumber}`;
		waveStart.classList.remove('inactive');
		waveStart.addEventListener('animationend', (event) =>
		{
			if (event.animationName === 'shrink')
			{
				waveStart.classList.add('inactive');
				resolve();
			}
		});
	});
};

export function setInactiveWaveUI()
{
	return new Promise((resolve, reject) =>
	{
		setShowPathIndicator(true);
		if (waveNumber > 0)
		{
			waveClear.classList.remove('inactive');
			waveClear.addEventListener('animationend', (event) =>
			{
				if (event.animationName === 'shrink')
				{
					btnStartWave.classList.remove('inactive');
					waveClear.classList.add('inactive');
					resolve();
				}
			});
		}
		else
		{
			waveClear.classList.add('inactive');
			btnStartWave.classList.remove('inactive');
			resolve();
		}
	});
};

export function showBuildMenu()
{
	buildMenu.classList.add('active');
};

export function hideBuildMenu()
{
	buildMenu.classList.remove('active');
};
