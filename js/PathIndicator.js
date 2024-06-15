import { showGlow } from "./gameState.js";

export class PathIndicator
{
	constructor({ path, offset = 0, speed = 200 })
	{
		this.currentSegment = 0;
		this.x = path[0].x;
		this.y = path[0].y;
		this.speed = speed;
		this.path = path;
		this.angle = 0;
		this.targetAngle = 0;
		this.rotationSpeed = 0.1;

		for (var i = 0; i < offset; i++)
		{
			//move to the next segment
			this.move(0.1);
		}
	}

	move(deltaTime)
	{
		if (this.currentSegment < this.path.length - 1)
		{
			const target = this.path[this.currentSegment + 1];
			const dx = target.x - this.x;
			const dy = target.y - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			// const angle = Math.atan2(this.path[this.currentSegment + 1].y - this.y, this.path[this.currentSegment + 1].x - this.x);
			this.targetAngle = Math.atan2(dy, dx);

			if (distance < this.speed * deltaTime)
			{
				this.currentSegment++;
				if (this.currentSegment >= this.path.length - 1)
				{
					this.currentSegment = 0;
					this.x = this.path[0].x;
					this.y = this.path[0].y;
				}
				else
				{
					this.x = target.x;
					this.y = target.y;
				}
			}
			else
			{
				this.x += (dx / distance) * this.speed * deltaTime;
				this.y += (dy / distance) * this.speed * deltaTime;
			}
		}
	}

	normalizeAngle(angle)
	{
		while (angle > Math.PI) angle -= 2 * Math.PI;
		while (angle < -Math.PI) angle += 2 * Math.PI;
		return angle;
	}

	draw(ctx)
	{

		if (showGlow)
		{
			ctx.shadowColor = `rgba(0, 200, 255, 1)`;
			ctx.shadowBlur = 15;
		}

		ctx.strokeStyle = 'rgba(0, 200, 255, 0.75)';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);

		let diff = this.targetAngle - this.angle;
		diff = this.normalizeAngle(diff);

		if (Math.abs(diff) > this.rotationSpeed)
		{
			this.angle += Math.sign(diff) * this.rotationSpeed;
			this.angle = this.normalizeAngle(this.angle);
		}
		else
		{
			this.angle = this.targetAngle;
		}

		//draw the path indicator

		const size = 15;
		ctx.lineTo(this.x - size * Math.cos(this.angle - Math.PI / 6), this.y - size * Math.sin(this.angle - Math.PI / 6));
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x - size * Math.cos(this.angle + Math.PI / 6), this.y - size * Math.sin(this.angle + Math.PI / 6));
		ctx.stroke();
		ctx.closePath();
		ctx.lineWidth = 1; // Reset line width

		if (showGlow)
		{
			ctx.shadowBlur = 0;
		}
	}
}
