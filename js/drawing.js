import { ctx, canvas } from "./ui.js";

export function drawGrid(ctx, canvasWidth, canvasHeight)
{
	for (let x = 0; x <= canvasWidth; x += 40)
	{
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvasHeight);
	}

	for (let y = 0; y <= canvasHeight; y += 40)
	{
		ctx.moveTo(0, y);
		ctx.lineTo(canvasWidth, y);
	}

	ctx.strokeStyle = '#444';
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
	ctx.fillRect(x - 20, y - 20, 40, 40);
}

export function drawSelection(x, y, color)
{
	let oldStrokeStyle = ctx.strokeStyle;
	let oldLineWidth = ctx.lineWidth;
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.strokeRect(x - 20, y - 20, 40, 40);
	ctx.strokeStyle = oldStrokeStyle;
	ctx.lineWidth = oldLineWidth;
}