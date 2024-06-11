import { Particle } from './Particle.class.js';

export class TextParticle extends Particle
{
	constructor(x, y, text, color, speed, lifetime = 1, font = '28px Arial', textAlign = 'center')
	{
		super(x, y, 0, color, 0, speed, lifetime);
		this.text = text;
		this.font = font;
		this.textAlign = textAlign;
	}

	update(deltaTime)
	{
		// super.update(deltaTime);
		this.y -= this.speed * deltaTime;
		this.color.a -= deltaTime / this.lifetime;
		return this.color.a <= 0;
	}

	draw(ctx)
	{
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
		ctx.font = this.font;
		ctx.textAlign = this.textAlign;
		ctx.fillText(this.text, this.x, this.y);
	}
};
