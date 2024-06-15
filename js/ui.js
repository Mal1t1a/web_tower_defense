import { resetGame, startWave, currency, waveNumber, setShowPathIndicator, upgradeTower, autoStartWave, setAutoStartWave, sellTower, waveActive, setShowGlow, showGlow, setSpeedMultiplier } from "./gameState.js";
import { handleBuildTowerClick, handleButtonResetGameCancelClick, handleButtonResetGameClick, handleButtonResetGameConfirmClick, handleButtonStartWaveEvents, handleButtonStopAutoWaveClick, handleButtonToggleGlowClick, handleCloseSettingsButtonClick, handlePageKeyDown, handlePageKeyUp, handleSettingsButtonClick } from "./eventHandlers.js";

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export const gameUI = document.getElementById('gameUI');

export const settingsUI = document.getElementById('settingsUI');
export const confirmReset = document.getElementById('confirmReset');
export const btnResetGameConfirm = document.getElementById('btnResetGameConfirm');
export const btnResetGameCancel = document.getElementById('btnResetGameCancel');
export const btnToggleGlow = document.getElementById('btnToggleGlow');
export const btnCloseSettings = document.getElementById('btnCloseSettings');

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
export const btnSettings = document.getElementById('btnSettings');

export const buildMenu = document.getElementById('buildMenu');
export const btnBuildArrowTower = document.getElementById('btnBuildArrowTower');
export const btnBuildCannonTower = document.getElementById('btnBuildCannonTower');
export const btnBuildIceTower = document.getElementById('btnBuildIceTower');
export const btnBuildFireTower = document.getElementById('btnBuildFireTower');
export const btnBuildLightningTower = document.getElementById('btnBuildLightningTower');
export const btnBuildSniperTower = document.getElementById('btnBuildSniperTower');

export const speeds = document.getElementById('speeds');

export let holdTimeHwnd = 0;
export let holdTimeStart = 0;
export let autoStartTicks = 0;

canvas.width = 800;
canvas.height = 600;

for (let i = 0; i < speeds.children.length; i++)
{
	let btnSpeed = speeds.children[i];
	btnSpeed.addEventListener('click', () => setSpeedMultiplier(btnSpeed.dataset.speed));
}

btnResetGame.addEventListener('click', handleButtonResetGameClick);
btnResetGameConfirm.addEventListener('click', handleButtonResetGameConfirmClick);
btnResetGameCancel.addEventListener('click', handleButtonResetGameCancelClick);
btnToggleGlow.addEventListener('click', handleButtonToggleGlowClick);

btnStartWave.addEventListener('mousedown', handleButtonStartWaveEvents);
btnStartWave.addEventListener('touchstart', handleButtonStartWaveEvents);
btnStopAutoWave.addEventListener('click', handleButtonStopAutoWaveClick);
btnUpgradeTower.addEventListener('click', upgradeTower);
btnSellTower.addEventListener('click', sellTower);
btnSettings.addEventListener('click', handleSettingsButtonClick);
btnCloseSettings.addEventListener('click', handleCloseSettingsButtonClick);

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

export function setHoldTimeStart(time)
{
	holdTimeStart = time;
};

export function setHoldTimeHwnd(time)
{
	holdTimeHwnd = time;
};

export function setAutoStartTicks(ticks)
{
	autoStartTicks = ticks;
};