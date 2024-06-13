import { ctx, canvas } from "./ui.js";
import { isPathEditing, gridSize, mouseX, mouseY, selectedX, selectedY } from "./gameState.js";

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

export function drawPath(ctx, path)
{
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

	// Draw path width for better visualization
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);
	for (let i = 1; i < path.length; i++)
	{
		ctx.lineTo(path[i].x, path[i].y);
	}
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.lineWidth = 20; // Path width
	ctx.stroke();
	ctx.lineWidth = 1; // Reset to default

	if (isPathEditing)
	{
		//draw path points
		ctx.fillStyle = 'white';
		for (let i = 0; i < path.length; i++)
		{
			ctx.fillStyle = 'white';
			//check if mouseX and mouseY are not null and are within the path point

			if (selectedX !== null && selectedY !== null && selectedX > path[i].x - 10 && selectedX < path[i].x + 10 && selectedY > path[i].y - 10 && selectedY < path[i].y + 10)
			{
				ctx.shadowColor = 'yellow';
				ctx.shadowBlur = 10;
				ctx.fillStyle = 'yellow';
			}
			else if (mouseX !== null && mouseY !== null && mouseX > path[i].x - 10 && mouseX < path[i].x + 10 && mouseY > path[i].y - 10 && mouseY < path[i].y + 10)
			{
				ctx.shadowColor = 'cyan';
				ctx.shadowBlur = 10;
				ctx.fillStyle = 'cyan';
			}
			ctx.beginPath();
			ctx.arc(path[i].x, path[i].y, 5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.shadowBlur = 0;
		}
	}
}

export function clearCanvas()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#333';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawGhostedTower(x, y, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(x - (gridSize / 2), y - (gridSize / 2), gridSize, gridSize);
}

export function drawSelection(x, y, color)
{
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.strokeRect(x - (gridSize / 2), y - (gridSize / 2), gridSize, gridSize);
	ctx.lineWidth = 1; // Reset to default
}