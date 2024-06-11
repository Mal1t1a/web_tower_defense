export class Particle
{
	constructor(x, y, radius, color, angle, speed, lifetime = 1)
	{
		if (new.target === Particle)
		{
			throw new TypeError("Cannot construct Particle instances directly");
		}
		if (color.a === undefined)
		{
			color.a = 1;
		}
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.angle = angle;
		this.speed = speed;
		this.lifetime = lifetime;
		this.maxLifetime = lifetime;
	}

	update(deltaTime)
	{
		this.x += Math.cos(this.angle) * this.speed * deltaTime;
		this.y += Math.sin(this.angle) * this.speed * deltaTime;
		this.lifetime -= deltaTime;
		this.color.a = this.lifetime / this.maxLifetime;
		this.speed = this.speed * 0.99;
		return this.lifetime <= 0;
	}

	draw(ctx)
	{
		throw new Error("Must be implemented by subclass");
	}
};
