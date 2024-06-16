import { particleExplosion, showGlow } from "../../gameState.js";
import { Projectile } from "./index.js";

export class FireProjectile extends Projectile
{
	constructor({ x, y, target, color, burnAmount = 1, burnRate = 8, burnDuration = 1000 })
	{
		super(x, y, target, color);
		this.burnAmount = burnAmount;
		this.burnRate = burnRate;
		this.burnDuration = burnDuration;
		this.burnTimer = 0;
		this.burnInterval = 0;
	}

	move(deltaTime)
	{
		var retValue = super.move(deltaTime);
		if (this.hitTarget)
		{
			this.applyBurnEffect(this.target, this.burnAmount);
		}
		return retValue;
	}

	applyBurnEffect(enemy, burnAmount)
	{
		if (!enemy.isBurning)
		{
			enemy.isBurning = true;

			if (enemy.burnTimer)
			{
				clearTimeout(enemy.burnTimer);
				clearInterval(enemy.burnInterval);
			}
			enemy.burnTimer = setTimeout(() =>
			{
				enemy.isBurning = false;
				clearInterval(enemy.burnInterval);
				clearTimeout(enemy.burnTimer);
			}, this.burnDuration);

			enemy.burnInterval = setInterval(() =>
			{
				enemy.takeDamage(burnAmount);
			}, 1000 / this.burnRate);
		}
		else
		{
			clearTimeout(enemy.burnTimer);
			enemy.burnTimer = setTimeout(() =>
			{
				enemy.isBurning = false;
				clearInterval(enemy.burnInterval);
				clearTimeout(enemy.burnTimer);
			}, this.burnDuration);
		
		}
	}

	draw(ctx)
	{
		if (showGlow)
		{
			ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
			ctx.shadowBlur = 15;
		}
		
		super.draw(ctx);
		
		if (showGlow)
		{
			ctx.shadowBlur = 0;
		}
	}
};
