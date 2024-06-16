import { EventEmitter } from '../eventEmitter.js';
import { particleExplosion, textParticle, showGlow, waveNumber } from '../gameState.js';
import { RandomNumber } from '../utils.js';

export class Enemy extends EventEmitter
{
	constructor({ path, speed, type = 'basic', bounty = 5 })
	{
		super();

		this.path = path;
		this.speed = speed;
		this.type = type;
		this.currentPoint = 0;
		this.x = path[0].x;
		this.y = path[0].y;
		this.color = {r: 255, g: 255, b: 255, a: 1 };

		this.hasDied = false;

		this.maxHealth = 1 * waveNumber;
		this.health = this.maxHealth;
		this.bounty = bounty + (waveNumber - 1);

		this.isSlowed = false;
		this.isBurning = false;

		this.burnTick = 0;
		this.burnTickRate = 0.1;
	}

	move(deltaTime)
	{
		if (this.isBurning && this.burnTick > 0)
		{
			this.burnTick -= deltaTime;
		}
		else if (this.isBurning)
		{
			particleExplosion(this.x + RandomNumber(-2, 2), this.y + RandomNumber(-2, 2), { r: 255, g: 0, b: 0, a: 1}, 2);
			particleExplosion(this.x + RandomNumber(-2, 2), this.y + RandomNumber(-2, 2), { r: 255, g: 155, b: 0, a: 1}, 2);
			particleExplosion(this.x + RandomNumber(-2, 2), this.y + RandomNumber(-2, 2), { r: 255, g: 255, b: 0, a: 1}, 2);
			this.burnTick = this.burnTickRate;
		}
		if (this.currentPoint < this.path.length - 1)
		{
			const target = this.path[this.currentPoint + 1];
			const dx = target.x - this.x;
			const dy = target.y - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.speed * deltaTime)
			{
				this.currentPoint++;
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
		if (showGlow)
		{
			ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
			ctx.shadowBlur = 15;
		}
		if (this.isSlowed)
		{
			ctx.shadowColor = `rgba(0, 255, 255, 1)`;
			ctx.shadowBlur = 10;
			ctx.fillStyle = `rgba(${Math.min(255, this.color.r - 50)}, ${Math.min(255, this.color.g + 25)}, ${Math.min(255, this.color.b + 100)}, ${this.color.a})`;
			ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
			ctx.shadowBlur = 0;
		}
		else
		{
			ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
			ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
		}

		ctx.shadowBlur = 0;

		// Draw health bar background
		ctx.fillStyle = 'rgba(125, 0, 0, 1)';
		ctx.fillRect(this.x - 10, this.y - 20, 20, 5);
		
		// Draw health bar
		ctx.fillStyle = 'rgba(0, 255, 0, 1)';
		ctx.fillRect(this.x - 10, this.y - 20, 20 * (this.health / this.maxHealth), 5);
	}

	takeDamage(damage)
	{
		this.health -= damage;
		this.emit('damage', damage);
		if (this.health <= 0 && !this.hasDied)
		{
			particleExplosion(this.x, this.y, this.color, 10);
			textParticle(this.x, this.y, `+${Math.round(this.bounty)}`, { r: 255, g: 215, b: 0 }, 50);
			this.emit('death', this.bounty);
			this.hasDied = true;
		}
		return this.health <= 0;
	}
}
