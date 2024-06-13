import { EventEmitter } from "./eventEmitter.js";
import { clearCanvas } from "./drawing.js";
import { ctx, canvas, selectionControls, btnAddPointStart, btnAddPointEnd, btnAddPointBefore, btnAddPointAfter, btnDeletePoint, btnClearPath, btnExportPath } from './ui.js';
import { PathIndicator } from './PathIndicator.js';
import { currentPath, gridSize, mouseX, mouseY, selectedX, selectedY, setMousePosition, setSelectedPosition } from './gameState.js';
// setInterval(editor.update.bind(editor), FRAME_DURATION);
// requestAnimationFrame(editor.render.bind(editor));
export class Editor extends EventEmitter
{
	constructor({ FPS, speedMultiplier })
	{
		super();

		this.FPS = FPS;
		this.FRAME_DURATION = 1000 / FPS;
		this.speedMultiplier = speedMultiplier;

		canvas.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
		window.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
		window.addEventListener('mouseup', this.handleCanvasMouseUp.bind(this));

		btnExportPath.addEventListener('click', () =>
		{
			//format for export:
			/*
				export const path## = [
					{ x: 0, y: 0 },
					{ x: 0, y: 0 },
					...
				];
			*/
			var pathString = 'export const path04 = [\n';
			for (let i = 0; i < currentPath.length; i++)
			{
				pathString += `\t{ x: ${currentPath[i].x}, y: ${currentPath[i].y} },\n`;
			}
			pathString += '];';
			//download as .js
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pathString));
			element.setAttribute('download', 'Path04.js');
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		});

		btnAddPointStart.addEventListener('click', this.insertPointAt.bind(this, 0));
		btnAddPointEnd.addEventListener('click', this.insertPointAtEnd.bind(this));
		btnClearPath.addEventListener('click', this.clearPath.bind(this));

		btnAddPointBefore.addEventListener('click', this.addPointBeforeSelected.bind(this));
		btnAddPointAfter.addEventListener('click', this.addPointAfterSelected.bind(this));
		btnDeletePoint.addEventListener('click', this.deleteSelectedPoint.bind(this));

		this.selectedPoint = null;
		this.mouseDown = false;
		this.gridPointSelectionSize = 15;

		this.pathIndicators = [];
		this.addPathIndicators();

		this.hideSelectionTools();

		setInterval(this.editorUpdateLoop.bind(this), this.FRAME_DURATION);
		requestAnimationFrame(this.render.bind(this));
	}

	addPathIndicators()
	{
		if (currentPath.length > 0)
		{
			this.pathIndicators.push(new PathIndicator({ path: currentPath, offset: 0 }));
			this.pathIndicators.push(new PathIndicator({ path: currentPath, offset: 4 }));
			this.pathIndicators.push(new PathIndicator({ path: currentPath, offset: 9 }));
			this.pathIndicators.push(new PathIndicator({ path: currentPath, offset: 14 }));
			this.pathIndicators.push(new PathIndicator({ path: currentPath, offset: 19 }));
		}
	}

	editorUpdateLoop()
	{
		const deltaTime = (this.FRAME_DURATION / 1000) * this.speedMultiplier;
		this.update(deltaTime);
	}

	drawGrid()
	{
		ctx.lineWidth = 1;

		for (let x = 0; x <= canvas.width; x += gridSize)
		{
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
		}

		for (let y = 0; y <= canvas.height; y += gridSize)
		{
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
		}

		ctx.strokeStyle = '#444';
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	drawPath()
	{
		if (currentPath.length === 0)
		{
			ctx.lineWidth = 1; // Reset to default
			return;
		}
		ctx.beginPath();
		ctx.moveTo(currentPath[0].x, currentPath[0].y);
		for (let i = 1; i < currentPath.length; i++)
		{
			ctx.lineTo(currentPath[i].x, currentPath[i].y);
		}
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.lineWidth = 1; // Reset to default

		// Draw path width for better visualization
		ctx.beginPath();
		ctx.moveTo(currentPath[0].x, currentPath[0].y);
		for (let i = 1; i < currentPath.length; i++)
		{
			ctx.lineTo(currentPath[i].x, currentPath[i].y);
		}
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.lineWidth = 20; // Path width
		ctx.stroke();
		ctx.lineWidth = 1; // Reset to default

		//draw path points
		ctx.fillStyle = 'white';
		for (let i = 0; i < currentPath.length; i++)
		{
			ctx.fillStyle = 'white';
			//check if mouseX and mouseY are not null and are within the path point

			if (this.selectedPoint !== null && this.selectedPoint === i)
			{
				ctx.shadowColor = 'yellow';
				ctx.shadowBlur = 10;
				ctx.fillStyle = 'yellow';
			}
			else if (mouseX !== null && mouseY !== null && mouseX > currentPath[i].x - this.gridPointSelectionSize && mouseX < currentPath[i].x + this.gridPointSelectionSize && mouseY > currentPath[i].y - this.gridPointSelectionSize && mouseY < currentPath[i].y + this.gridPointSelectionSize)
			{
				ctx.shadowColor = 'cyan';
				ctx.shadowBlur = 10;
				ctx.fillStyle = 'cyan';
			}
			else if (i === 0)
			{
				ctx.shadowColor = 'green';
				ctx.shadowBlur = 10;
				ctx.fillStyle = 'green';
			}
			else if (i === currentPath.length - 1)
			{
				ctx.shadowColor = 'red';
				ctx.shadowBlur = 10;
				ctx.fillStyle = 'red';
			}
			ctx.beginPath();
			ctx.arc(currentPath[i].x, currentPath[i].y, 5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.shadowBlur = 0;
		}
	}

	showSelectionTools()
	{
		selectionControls.querySelectorAll('button').forEach(button => button.disabled = false);
	}

	hideSelectionTools()
	{
		selectionControls.querySelectorAll('button').forEach(button => button.disabled = true);
	}

	deleteSelectedPoint()
	{
		if (this.selectedPoint !== null)
		{
			currentPath.splice(this.selectedPoint, 1);
			this.selectedPoint = null;
			this.hideSelectionTools();
		}
	}

	insertPointAt(index)
	{
		if (currentPath.length > 0)
		{
			currentPath.splice(index, 0, { x: Math.floor(canvas.width / 2 / gridSize) * gridSize, y: Math.floor(canvas.height / 2 / gridSize) * gridSize });
		}
		else
		{
			//insert at 0 and center to grid
			currentPath.push({ x: Math.floor(canvas.width / 2 / gridSize) * gridSize, y: Math.floor(canvas.height / 2 / gridSize) * gridSize });
		}
	}

	insertPointAtEnd()
	{
		currentPath.push({ x: Math.floor(canvas.width / 2 / gridSize) * gridSize, y: Math.floor(canvas.height / 2 / gridSize) * gridSize });
	}

	addPointBeforeSelected()
	{
		if (this.selectedPoint !== null)
		{
			currentPath.splice(this.selectedPoint, 0, { x: Math.floor(canvas.width / 2 / gridSize) * gridSize, y: Math.floor(canvas.height / 2 / gridSize) * gridSize });
			this.selectedPoint--;
		}
	}

	addPointAfterSelected()
	{
		if (this.selectedPoint !== null)
		{
			currentPath.splice(this.selectedPoint + 1, 0, { x: Math.floor(canvas.width / 2 / gridSize) * gridSize, y: Math.floor(canvas.height / 2 / gridSize) * gridSize });
			this.selectedPoint++;
		}
	}

	clearPath()
	{
		currentPath.length = 0;
		this.hideSelectionTools();
	}

	handleCanvasMouseDown(event)
	{
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width; // scaling factor in the x direction
		const scaleY = canvas.height / rect.height; // scaling factor in the y direction
		let x = (event.clientX - rect.left) * scaleX;
		let y = (event.clientY - rect.top) * scaleY;

		let foundPoint = null;
		//check enemyPath for selected point
		for (let i = 0; i < currentPath.length; i++)
		{
			if (x > currentPath[i].x - this.gridPointSelectionSize && x < currentPath[i].x + this.gridPointSelectionSize && y > currentPath[i].y - this.gridPointSelectionSize && y < currentPath[i].y + this.gridPointSelectionSize)
			{
				foundPoint = i;
				this.showSelectionTools();
				this.pathIndicators.length = 0;
				break;
			}
		}

		this.selectedPoint = foundPoint;
		if (foundPoint === null)
		{
			this.hideSelectionTools();
		}

		setSelectedPosition(x, y);
		setMousePosition(x, y);
		this.mouseDown = true;

		this.emit('selectedPosition', { x, y });
		this.emit('mousePosition', { x, y });
	}

	handleCanvasMouseMove(event)
	{
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width; // scaling factor in the x direction
		const scaleY = canvas.height / rect.height; // scaling factor in the y direction
		let x = (event.clientX - rect.left) * scaleX;
		let y = (event.clientY - rect.top) * scaleY;

		if (this.selectedPoint !== null && this.mouseDown)
		{
			//snap to grid but not middle of cell
			//also clamp to canvas bounds
			// currentPath[this.selectedPoint].x = Math.floor(x / gridSize) * gridSize;
			// currentPath[this.selectedPoint].y = Math.floor(y / gridSize) * gridSize;
			currentPath[this.selectedPoint].x = Math.min(Math.max(Math.floor(x / gridSize) * gridSize, 0), canvas.width);
			currentPath[this.selectedPoint].y = Math.min(Math.max(Math.floor(y / gridSize) * gridSize, 0), canvas.height);
		}

		setMousePosition(x, y);
		this.emit('mousePosition', { x, y });
	}

	handleCanvasMouseUp(event)
	{
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width; // scaling factor in the x direction
		const scaleY = canvas.height / rect.height; // scaling factor in the y direction
		let x = (event.clientX - rect.left) * scaleX;
		let y = (event.clientY - rect.top) * scaleY;

		setSelectedPosition(null, null);
		setMousePosition(x, y);
		this.mouseDown = false;

		if (this.pathIndicators.length == 0)
		{
			this.addPathIndicators();
		}

		this.emit('mousePosition', { x, y });
	}

	update(deltaTime)
	{
		if (currentPath.length > 0 && (this.selectedPoint === null || !this.mouseDown))
		{
			this.pathIndicators.forEach(pathIndicator => pathIndicator.move(deltaTime));
		}
	};

	render()
	{

		clearCanvas();
		this.drawGrid();
		this.drawPath();
		if (currentPath.length > 1)
		{
			this.pathIndicators.forEach(pathIndicator => pathIndicator.draw(ctx));
		}

		requestAnimationFrame(this.render.bind(this));
	}
};
