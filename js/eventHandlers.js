import { towers, currency, decreaseCurrency, startWave, setMousePosition, setSelectedPosition, mouseX, mouseY, selectedX, selectedY } from './gameState.js';
import { path } from './Path.js';
import { showBuildMenu, hideBuildMenu, hideUpgradeButton, showUpgradeButton } from './ui.js';
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

	for (let i = 0; i < path.length - 1; i++)
	{
		const start = path[i];
		const end = path[i + 1];

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
	x = Math.floor(x / 40) * 40 + 20; // Assuming a grid size of 40
	y = Math.floor(y / 40) * 40 + 20; // Center the tower in the grid cell

	if (x != selectedX || y != selectedY)
	{
		if (isOnPath(x, y))
		{
			hideBuildMenu();
			hideUpgradeButton();
		}
		else if (isOccupied(x, y))
		{
			hideBuildMenu();
			const tower = towers.find(tower => tower.x === x && tower.y === y);
			if (currency >= tower.upgradeCost)
			{
				showUpgradeButton();
			}
			else
			{
				hideUpgradeButton();
			}
		}
		else
		{
			showBuildMenu();
			hideUpgradeButton();
		}
		setSelectedPosition(x, y);
	}
	else
	{
		setSelectedPosition(null, null);
		hideBuildMenu();
		hideUpgradeButton();
	}
}

export function handleCanvasMouseMove(event, canvas)
{
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width; // scaling factor in the x direction
	const scaleY = canvas.height / rect.height; // scaling factor in the y direction
	let x = (event.clientX - rect.left) * scaleX;
	let y = (event.clientY - rect.top) * scaleY;

	x = Math.floor(x / 40) * 40 + 20; // Snap to grid
	y = Math.floor(y / 40) * 40 + 20; // Snap to grid

	setMousePosition(x, y);
};

export function handleBuildTowerClick(type)
{
	if (selectedX === null || selectedY === null)
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

	console.log(currency, tower.cost);

	if (currency >= tower.cost)
	{
		towers.push(tower);
		decreaseCurrency(tower.cost);
		hideBuildMenu();
		if (currency >= tower.upgradeCost)
		{
			showUpgradeButton();
		}
		else
		{
			hideUpgradeButton();
		}
	}

	// setSelectedPosition(null, null);
};
