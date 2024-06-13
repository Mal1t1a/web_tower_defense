import { Particle } from './Particle.class.js';

export class SquareParticle extends Particle
{
	constructor(x, y, radius, color, angle, speed, lifetime = 1)
	{
		super(x, y, radius, color, angle, speed, lifetime);
	}

	draw(ctx)
	{
		ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
		ctx.shadowBlur = 5;
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
		ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
		ctx.shadowBlur = 0;
	}
};
