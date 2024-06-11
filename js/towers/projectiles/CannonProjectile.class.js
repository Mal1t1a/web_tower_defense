import { Projectile } from './Projectile.class.js';
import { enemies } from '../../gameState.js';

export class CannonProjectile extends Projectile
{
	constructor(x, y, target)
	{
		super(x, y, target);
		this.color = { r: 255, g: 165, b: 0, a: 1 }; //orange
		this.explosionRadius = 40;
		this.explosionSplash = 0.5;
	}

	move(deltaTime)
	{
		if (this.target && !this.hitTarget)
		{
			const dx = this.target.x - this.x;
			const dy = this.target.y - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.speed * deltaTime)
			{
                this.applySplashDamage();
				if (this.target.takeDamage(this.damage))
				{
					this.hitTarget = true;
					return true;
				}
				this.hitTarget = true;
				return false;
			}
			else
			{
				this.x += (dx / distance) * this.speed * deltaTime;
				this.y += (dy / distance) * this.speed * deltaTime;
			}
		}
		return false;
	}

	applySplashDamage()
	{
		enemies.forEach(enemy =>
		{
			if (enemy === this.target) return; // Skip the target (it will be hit by the main projectile)
			const dx = enemy.x - this.x;
			const dy = enemy.y - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance <= this.explosionRadius)
			{
				enemy.takeDamage(this.damage * this.explosionSplash);
			}
		});
	}

	draw(ctx)
	{
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
		ctx.fill();
	}
}
