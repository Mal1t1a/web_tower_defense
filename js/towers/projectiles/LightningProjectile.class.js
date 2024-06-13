import { Projectile } from './Projectile.class.js';
import { enemies, showGlow } from '../../gameState.js';

export class LightningProjectile extends Projectile
{
	constructor(x, y, target, bounces = 2, bounceRange = 200)
	{
		super(x, y, target);
		this.color = { r: 255, g: 255, b: 0, a: 1 }; //yellow
		this.simulateX = x;
		this.simulateY = y;
		this.speed = 1000;
		this.bounces = bounces;
		this.bounceRange = bounceRange;
	}

	move(deltaTime)
	{
		if (this.target && !this.hitTarget)
		{
			const dx = this.target.x - this.simulateX;
			const dy = this.target.y - this.simulateY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.speed * deltaTime)
			{
				var targets = this.getBounceTargets(this.target);
				if (targets)
				{
					targets.forEach(target =>
					{
						target.takeDamage(this.damage)
					});
				}

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
				this.simulateX += (dx / distance) * this.speed * deltaTime;
				this.simulateY += (dy / distance) * this.speed * deltaTime;
			}
		}
		return false;
	}

	getBounceTargets(target, targets = [])
	{
		if (targets.length >= this.bounces)
		{
			return targets.length > 0 ? targets : null;
		}
		let closestEnemy = null;
		let closestDistance = Infinity;
		enemies.forEach(enemy =>
		{
			if (enemy === this.target || enemy === target || targets.includes(enemy))
			{
				return;
			}
			const distance = this.getDistance(target, enemy);
			if (distance < closestDistance && distance <= this.bounceRange)
			{
				closestEnemy = enemy;
				closestDistance = distance;
			}
		});
		if (closestEnemy)
		{
			targets.push(closestEnemy);
			return this.getBounceTargets(closestEnemy, targets);
		}
		return targets.length > 0 ? targets : null;
	}

	getDistance(point1, point2)
	{
		const dx = point1.x - point2.x;
		const dy = point1.y - point2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	draw(ctx)
	{
		if (showGlow)
		{		
			ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
			ctx.shadowBlur = 15;
		}
		// super.draw(ctx);
		
		//draw the lightning bolt
		ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.target.x, this.target.y);

		var targets = this.getBounceTargets(this.target);
		if (targets)
		{
			targets.forEach(target =>
			{
				ctx.lineTo(target.x, target.y);
			});
		}
		
		ctx.stroke();

		if (showGlow)
		{
			ctx.shadowBlur = 0;
		}
	}
}
