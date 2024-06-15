import { towers, currency, decreaseCurrency, startWave, setMousePosition, setSelectedPosition, mouseX, mouseY, selectedX, selectedY, checkShowUpgradeButton, checkShowSellTowerButton, sellTower, upgradeTower, resetGame, isPathEditing, gridSize, currentPath, setAutoStartWave, waveActive, setPaused, setShowGlow, showGlow } from './gameState.js';
import { showBuildMenu, hideBuildMenu, hideUpgradeButton, showUpgradeButton, canvas, settingsUI, btnStartWave, holdTimeStart, holdTimeHwnd, setHoldTimeStart, setHoldTimeHwnd, setAutoStartTicks, btnStopAutoWave, autoStartTicks, btnResetGame, confirmReset, btnToggleGlow } from './ui.js';
import { ArrowTower, CannonTower, IceTower, FireTower, LightningTower, SniperTower } from './towers/index.js';

export function isOnPath(x, y)
{
	const pathWidth = 20; // Width of the path

	function distanceToSegment(px, py, ax, ay, bx, by)
	{
		const lengthSquared = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
		if (lengthSquared === 0) return Math.hypot(px - ax, py - ay);

		let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / lengthSquared;
		t = Math.max(0, Math.min(1, t));
		return Math.hypot(px - (ax + t * (bx - ax)), py - (ay + t * (by - ay)));
	}

	for (let i = 0; i < currentPath.length - 1; i++)
	{
		const start = currentPath[i];
		const end = currentPath[i + 1];

		if (distanceToSegment(x, y, start.x, start.y, end.x, end.y) < pathWidth)
		{
			return true;
		}
	}
	return false;
}

export function isOccupied(x, y)
{
	return towers.some(tower => tower.x === x && tower.y === y);
}

export function handleCanvasClick(event, canvas)
{
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width; // scaling factor in the x direction
	const scaleY = canvas.height / rect.height; // scaling factor in the y direction
	let x = (event.clientX - rect.left) * scaleX;
	let y = (event.clientY - rect.top) * scaleY;

	// Snap to grid
	x = Math.floor(x / gridSize) * gridSize + (gridSize / 2); // Assuming a grid size of 40
	y = Math.floor(y / gridSize) * gridSize + (gridSize / 2); // Center the tower in the grid cell

	setSelectedPosition(x, y);
}

export function handleCanvasMouseMove(event, canvas)
{
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width; // scaling factor in the x direction
	const scaleY = canvas.height / rect.height; // scaling factor in the y direction
	let x = (event.clientX - rect.left) * scaleX;
	let y = (event.clientY - rect.top) * scaleY;

	x = Math.floor(x / gridSize) * gridSize + (gridSize / 2); // Snap to grid
	y = Math.floor(y / gridSize) * gridSize + (gridSize / 2); // Snap to grid

	setMousePosition(x, y);
};

export function handleBuildTowerClick(type)
{
	if (selectedX === null || selectedY === null)
	{
		return;
	}

	if (isOnPath(selectedX, selectedY))
	{
		return;
	}

	if (isOccupied(selectedX, selectedY))
	{
		return;
	}

	let tower = null;
	switch (type)
	{
		case 'arrow':
			tower = new ArrowTower(selectedX, selectedY);
			break;
		case 'cannon':
			tower = new CannonTower(selectedX, selectedY);
			break;
		case 'ice':
			tower = new IceTower(selectedX, selectedY);
			break;
		case 'fire':
			tower = new FireTower(selectedX, selectedY);
			break;
		case 'lightning':
			tower = new LightningTower(selectedX, selectedY);
			break;
		case 'sniper':
			tower = new SniperTower(selectedX, selectedY);
			break;
		default:
			break;
	}

	if (currency >= tower.cost)
	{
		towers.push(tower);
		decreaseCurrency(tower.cost);
		hideBuildMenu();
		checkShowSellTowerButton();
		checkShowUpgradeButton();
	}
};

function handleGameKeyDown(event)
{
	//check if arrow key
	switch (event.keyCode)
	{
		case 37: // left
			if (selectedX !== null && selectedY !== null && selectedX - gridSize >= 0)
			{
				setSelectedPosition(selectedX - gridSize, selectedY);
			}
			break;
		case 38: // up
			if (selectedX !== null && selectedY !== null && selectedY - gridSize >= 0)
			{
				setSelectedPosition(selectedX, selectedY - gridSize);
			}
			break;
		case 39: // right
			if (selectedX !== null && selectedY !== null && selectedX + gridSize < canvas.width)
			{
				setSelectedPosition(selectedX + gridSize, selectedY);
			}
			break;
		case 40: // down
			if (selectedX !== null && selectedY !== null && selectedY + gridSize < canvas.height)
			{
				setSelectedPosition(selectedX, selectedY + gridSize);
			}
			break;
		case 49: // 1
			handleBuildTowerClick('arrow');
			break;
		case 50: // 2
			handleBuildTowerClick('cannon');
			break;
		case 51: // 3
			handleBuildTowerClick('ice');
			break;
		case 52: // 4
			handleBuildTowerClick('fire');
			break;
		case 53: // 5
			handleBuildTowerClick('lightning');
			break;
		case 54: // 6
			handleBuildTowerClick('sniper');
			break;
		case 32: // space
			startWave();
			break;
		case 81: // q
			// upgradeTower();
			break;
		case 82: // r
			resetGame();
			break;
		case 83: // s
			sellTower();
			break;
		case 87:
			upgradeTower();
			break;
	}
}

function handleEditorKeyDown(event)
{
	//check if arrow key
	switch (event.keyCode)
	{
		case 37: // left
			if (selectedX !== null && selectedY !== null && selectedX - gridSize >= 0)
			{
				setSelectedPosition(selectedX - gridSize, selectedY);
			}
			break;
		case 38: // up
			if (selectedX !== null && selectedY !== null && selectedY - gridSize >= 0)
			{
				setSelectedPosition(selectedX, selectedY - gridSize);
			}
			break;
		case 39: // right
			if (selectedX !== null && selectedY !== null && selectedX + gridSize < canvas.width)
			{
				setSelectedPosition(selectedX + gridSize, selectedY);
			}
			break;
		case 40: // down
			if (selectedX !== null && selectedY !== null && selectedY + gridSize < canvas.height)
			{
				setSelectedPosition(selectedX, selectedY + gridSize);
			}
			break;
		default:
			break;
	}
}

export function handlePageKeyDown(event)
{
	if (isPathEditing)
	{
		handleEditorKeyDown(event);
	}
	else
	{
		handleGameKeyDown(event);
	}
};

export function handlePageKeyUp(event)
{

};

export function handleSettingsButtonClick(event)
{
	settingsUI.style.display = 'block';
	setPaused(true);
};

export function handleCloseSettingsButtonClick(event)
{
	settingsUI.style.display = 'none';
	setPaused(false);
};

export function handleButtonStopAutoWaveClick(event)
{
	setAutoStartWave(false);
	btnStartWave.style.display = 'block';
	btnStopAutoWave.style.display = 'none';
};

export function handleButtonStartWaveEvents(event)
{
	event.preventDefault();
	setHoldTimeStart(new Date());
	btnStartWave.classList.add('held');
	setHoldTimeHwnd(setInterval(() =>
	{
		setAutoStartTicks(autoStartTicks + 1);
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
	}, 1000));

	function mouseTouchUp(event)
	{
		var diff = (new Date()).getTime() - holdTimeStart.getTime();
		if (diff < 1000)
		{
			startWave();
		}
		btnStartWave.classList.remove('held');
		setAutoStartTicks(0);
		clearInterval(holdTimeHwnd);
		btnStartWave.querySelector('#text').textContent = 'Start Wave';
		window.removeEventListener('mouseup', mouseTouchUp);
		window.removeEventListener('touchend', mouseTouchUp);
	}

	window.addEventListener('mouseup', mouseTouchUp);
	window.addEventListener('touchend', mouseTouchUp);
};

export function handleButtonResetGameClick(event)
{
	btnResetGame.style.display = 'none';
	confirmReset.style.display = 'block';
};

export function handleButtonResetGameConfirmClick(event)
{
	btnResetGame.style.display = 'block';
	confirmReset.style.display = 'none';
	settingsUI.style.display = 'none';
	resetGame();
};

export function handleButtonResetGameCancelClick(event)
{
	btnResetGame.style.display = 'block';
	confirmReset.style.display = 'none';
};

export function handleButtonToggleGlowClick(event)
{
	setShowGlow(!showGlow);
	if (!showGlow)
	{
		btnToggleGlow.textContent = 'Enable Glow Effect';
	}
	else
	{
		btnToggleGlow.textContent = 'Disable Glow Effect';
	}
};
