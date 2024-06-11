import { Projectile } from './projectiles/Projectile.class.js';
import { EventEmitter } from '../eventEmitter.js';

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
		this.color = 'gray';
		this.projectiles = [];
		this.fireRate = 1; //shots per second
		this.fireCooldown  = 0;
		this.damage = 1;
	}

	draw(ctx)
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
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
			}
			return !projectile.hitTarget; // Remove projectile if it hit the target
		});
	}

	createProjectile(x, y, target)
	{
		throw new Error("Must be implemented by subclass");
	}
}
