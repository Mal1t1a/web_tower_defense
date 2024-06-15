import { Projectile } from './projectiles/Projectile.class.js';
import { EventEmitter } from '../eventEmitter.js';
import { particleExplosion, showGlow } from '../gameState.js';

export class Tower extends EventEmitter
{
	constructor(x, y, type = 'arrow')
	{
		if (new.target === Tower)
		{
			throw new TypeError("Cannot construct Tower instances directly");
		}
		super();

		this.x = x;
		this.y = y;
		this.type = type;
		this.range = 0;
		this.color = { r: 128, g: 128, b: 128, a: 1 };
		this.projectiles = [];
		this.fireRate = 1; //shots per second
		this.fireCooldown  = 0;
		this.damage = 1;
		this.level = 1;
		this.cost = 1;
		this.upgradeCost = this.cost * 2;
	}

	draw(ctx)
	{
		if (showGlow)
		{
			ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
			ctx.shadowBlur = 10;
		}
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
		ctx.fillRect(this.x - 10, this.y - 10, 20, 20);

		//draw level
		ctx.fillStyle = 'black';
		ctx.font = '16px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.level, this.x, this.y + 2);

		// ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
		ctx.shadowBlur = 0;
	}

	shoot(enemies, deltaTime)
	{
		if (this.fireCooldown > 0)
		{
			this.fireCooldown -= deltaTime;
		}

		if (this.fireCooldown <= 0)
		{
			for (const enemy of enemies)
			{
				const dx = enemy.x - this.x;
				const dy = enemy.y - this.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < this.range)
				{
					var projectile = this.createProjectile(this.x, this.y, enemy);
					projectile.color = this.color;
					projectile.damage = this.damage;
					this.projectiles.push(projectile);
					this.emit('shoot', projectile);
					this.fireCooldown = 1 / this.fireRate;
					break;
				}
			}
		}
	}

	update(enemies, deltaTime)
	{
		this.projectiles = this.projectiles.filter(projectile =>
		{
			if (projectile.target && projectile.move(deltaTime))
			{
				this.emit('hit', projectile);
				return false;
			}
			if (projectile.hitTarget)
			{
				this.emit('hit', projectile);
				// particleExplosion(projectile.x, projectile.y, projectile.color, 3);
			}
			return !projectile.hitTarget; // Remove projectile if it hit the target
		});
	}

	upgrade()
	{
		this.level++;
		this.damage *= 1.5;
		this.range *= 1.1;
		this.fireRate *= 1.1;
		this.upgradeCost *= 2;
	}

	createProjectile(x, y, target)
	{
		throw new Error("Must be implemented by subclass");
	}
}
