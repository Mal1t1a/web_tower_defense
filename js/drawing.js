import { ctx, canvas } from "./ui.js";
import { isPathEditing, gridSize, mouseX, mouseY, selectedX, selectedY, showGlow } from "./gameState.js";

export function drawGrid(ctx, canvasWidth, canvasHeight)
{
	for (let x = 0; x <= canvasWidth; x += gridSize)
	{
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvasHeight);
	}

	for (let y = 0; y <= canvasHeight; y += gridSize)
	{
		ctx.moveTo(0, y);
		ctx.lineTo(canvasWidth, y);
	}

	ctx.strokeStyle = '#444';
	ctx.lineWidth = 1;
	ctx.stroke();
}

let shadowBlurGlow = 0;
let shadowBlurGlowStep = 0.05;
let increasing = true;

export function drawPath(ctx, path)
{
	if (showGlow)
	{
		ctx.shadowColor = 'white';
		if (increasing)
		{
			shadowBlurGlow += shadowBlurGlowStep;
			if (shadowBlurGlow >= 10)
			{
				increasing = false;
			}
		}
		else
		{
			shadowBlurGlow -= shadowBlurGlowStep;
			if (shadowBlurGlow <= 0)
			{
				increasing = true;
			}
		}
		ctx.shadowBlur = shadowBlurGlow;
	}
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);
	for (let i = 1; i < path.length; i++)
	{
		ctx.lineTo(path[i].x, path[i].y);
	}
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.lineWidth = 1; // Reset to default
	ctx.shadowBlur = 0;

	// Draw path width for better visualization
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);
	for (let i = 1; i < path.length; i++)
	{
		ctx.lineTo(path[i].x, path[i].y);
	}
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.lineWidth = 20; // Path width
	ctx.stroke();
	ctx.lineWidth = 1; // Reset to default
}

export function clearCanvas()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#333';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawGhostedTower(x, y, color)
{
	if (showGlow)
	{
		ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
		ctx.shadowBlur = 10;
	}
	ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
	ctx.fillRect(x - (gridSize / 2), y - (gridSize / 2), gridSize, gridSize);
	ctx.shadowBlur = 0;
}

export function drawSelection(x, y, color)
{
	if (showGlow)
	{
		ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
		ctx.shadowBlur = 10;
	}
	ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
	ctx.lineWidth = 2;
	ctx.strokeRect(x - (gridSize / 2), y - (gridSize / 2), gridSize, gridSize);
	ctx.lineWidth = 1; // Reset to default
	ctx.shadowBlur = 0;
}