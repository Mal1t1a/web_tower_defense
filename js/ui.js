import { resetGame, startWave, currency, waveNumber, setShowPathIndicator, upgradeTower, autoStartWave, setAutoStartWave, sellTower, waveActive } from "./gameState.js";
import { handleBuildTowerClick, handlePageKeyDown, handlePageKeyUp } from "./eventHandlers.js";

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export const gameUI = document.getElementById('gameUI');
export const editorUI = document.getElementById('editorUI');
export const editorControls = document.getElementById('editorControls');
export const pathControls = document.getElementById('pathControls');
export const selectionControls = document.getElementById('selectionControls');

export const btnSavePath = document.getElementById('btnSavePath');
export const btnLoadPath = document.getElementById('btnLoadPath');
export const btnExportPath = document.getElementById('btnExportPath');
export const btnImportPath = document.getElementById('btnImportPath');

export const btnAddPointStart = document.getElementById('btnAddPointStart');
export const btnAddPointEnd = document.getElementById('btnAddPointEnd');
export const btnClearPath = document.getElementById('btnClearPath');

export const btnAddPointBefore = document.getElementById('btnAddPointBefore');
export const btnAddPointAfter = document.getElementById('btnAddPointAfter');
export const btnDeletePoint = document.getElementById('btnDeletePoint');

export const txtScore = document.getElementById('txtScore');
export const txtWave = document.getElementById('txtWave');
export const txtLives = document.getElementById('txtLives');
export const txtCurrency = document.getElementById('txtCurrency');
export const waveStart = document.getElementById('waveStart');
export const waveClear = document.getElementById('waveClear');

export const btnStartWave = document.getElementById('btnStartWave');
export const btnStopAutoWave = document.getElementById('btnStopAutoWave');
export const btnResetGame = document.getElementById('btnResetGame');
export const btnUpgradeTower = document.getElementById('btnUpgradeTower');
export const btnSellTower = document.getElementById('btnSellTower');

export const buildMenu = document.getElementById('buildMenu');
export const btnBuildArrowTower = document.getElementById('btnBuildArrowTower');
export const btnBuildCannonTower = document.getElementById('btnBuildCannonTower');
export const btnBuildIceTower = document.getElementById('btnBuildIceTower');
export const btnBuildFireTower = document.getElementById('btnBuildFireTower');
export const btnBuildLightningTower = document.getElementById('btnBuildLightningTower');
export const btnBuildSniperTower = document.getElementById('btnBuildSniperTower');

canvas.width = 800;
canvas.height = 600;
let holdTimeHwnd = 0;
let autoStartTicks = 0;

btnStartWave.addEventListener('click', startWave);
btnStopAutoWave.addEventListener('click', () =>
{
	setAutoStartWave(false);
	btnStartWave.style.display = 'block';
	btnStopAutoWave.style.display = 'none';
});
btnStartWave.addEventListener('mousedown', () =>
{
	btnStartWave.classList.add('held');
	holdTimeHwnd = setInterval(() =>
	{
		autoStartTicks++;
		if (autoStartTicks >= 3)
		{
			setAutoStartWave(true);
			btnStartWave.style.display = 'none';
			btnStopAutoWave.style.display = 'block';
			btnStartWave.querySelector('#text').textContent = 'Start Wave';
			if (!waveActive)
			{
				startWave();
			}
			clearInterval(holdTimeHwnd);
		}
		else
		{
			btnStartWave.querySelector('#text').textContent = `Auto Start in ${3 - autoStartTicks}`;
		}
	}, 1000);

	window.addEventListener('mouseup', () =>
	{
		btnStartWave.classList.remove('held');
		autoStartTicks = 0;
		clearInterval(holdTimeHwnd);
		btnStartWave.querySelector('#text').textContent = 'Start Wave';
		window.removeEventListener('mouseup', null);
	});
});
btnResetGame.addEventListener('click', resetGame);
btnUpgradeTower.addEventListener('click', upgradeTower);
btnSellTower.addEventListener('click', sellTower);

btnBuildArrowTower.addEventListener('click', () => handleBuildTowerClick('arrow'));
btnBuildCannonTower.addEventListener('click', () => handleBuildTowerClick('cannon'));
btnBuildIceTower.addEventListener('click', () => handleBuildTowerClick('ice'));
btnBuildFireTower.addEventListener('click', () => handleBuildTowerClick('fire'));
btnBuildLightningTower.addEventListener('click', () => handleBuildTowerClick('lightning'));
btnBuildSniperTower.addEventListener('click', () => handleBuildTowerClick('sniper'));

window.addEventListener('keydown', handlePageKeyDown);
window.addEventListener('keyup', handlePageKeyUp);

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

//TODO: There's gotta be a better way to do this but I'm tired rn and also I might be getting lazy

export function showBuildMenu()
{
	buildMenu.classList.add('active');
};

export function hideBuildMenu()
{
	buildMenu.classList.remove('active');
};

export function showUpgradeButton()
{
	btnUpgradeTower.classList.remove('inactive');
};

export function hideUpgradeButton()
{
	btnUpgradeTower.classList.add('inactive');
};

export function setUpgradeButtonText(cost)
{
	if (cost === 0)
	{
		btnUpgradeTower.textContent = 'Upgrade Tower';
		return;
	}
	btnUpgradeTower.textContent = `Upgrade Tower (${cost})`;
};

export function showSellTowerButton()
{
	btnSellTower.classList.remove('inactive');
};

export function hideSellTowerButton()
{
	btnSellTower.classList.add('inactive');
};

export function setSellTowerButtonText(cost)
{
	if (cost === 0)
	{
		btnSellTower.textContent = 'Sell Tower';
		return;
	}
	btnSellTower.textContent = `Sell Tower (${cost})`;
};
