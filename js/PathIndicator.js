export class PathIndicator
{
	constructor({ path, offset = 0, speed = 200})
	{
		this.currentSegment = 0;
		this.x = path[0].x;
		this.y = path[0].y;
		this.speed = speed;
		this.path = path;
		
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

	draw(ctx)
	{
		
		ctx.shadowColor = `rgba(0, 200, 255, 1)`;
		ctx.shadowBlur = 15;
		ctx.strokeStyle = 'rgba(0, 200, 255, 0.75)';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);

		// Arrow head
		const angle = Math.atan2(this.path[this.currentSegment + 1].y - this.y, this.path[this.currentSegment + 1].x - this.x);
		const size = 15;
		ctx.lineTo(this.x - size * Math.cos(angle - Math.PI / 6), this.y - size * Math.sin(angle - Math.PI / 6));
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x - size * Math.cos(angle + Math.PI / 6), this.y - size * Math.sin(angle + Math.PI / 6));
		ctx.stroke();
		ctx.closePath();
		ctx.lineWidth = 1; // Reset line width
		ctx.shadowBlur = 0;
	}
}
