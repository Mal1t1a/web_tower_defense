import { showGlow } from '../gameState.js';
import { Particle } from './Particle.class.js';

export class CircleParticle extends Particle
{
	constructor(x, y, radius, color, angle, speed, lifetime = 1)
	{
		super(x, y, radius, color, angle, speed, lifetime);
	}

	draw(ctx)
	{
		if (showGlow)
		{
			ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
			ctx.shadowBlur = 25;
		}
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.shadowBlur = 0;
	}
};
