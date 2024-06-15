import { RandomNumber } from '../utils.js';
import { Enemy } from './index.js';
import { waveNumber } from '../gameState.js';

export class TeleportEnemy extends Enemy
{
	constructor({ path, bounty = 5 })
	{
		super({ path, speed: 100, type: 'teleport', bounty });
		this.color = { r: 0, g: 125, b: 255, a: 1 };
		this.maxHealth = 2;
		this.health = this.maxHealth;
		this.coolDown = 4;
		this.teleportDistance = RandomNumber(100, 200 + (Math.min(waveNumber * 10, 300)));
		this.teleportTimer = RandomNumber(0, 1);
		this.teleportBlurTimer = 0;

		this.teleportFromX = this.x;
		this.teleportFromY = this.y;
	}

	move(deltaTime)
	{
		if (this.teleportBlurTimer > 0)
		{
			this.teleportBlurTimer -= deltaTime;
		}
		if (this.teleportTimer <= 0)
		{
			this.teleportTimer = this.coolDown;
			this.teleport(deltaTime);
		}
		else
		{
			this.teleportTimer -= deltaTime;
		}
		super.move(deltaTime);
	}

	teleport(deltaTime)
	{
		this.teleportBlurTimer = 0.5;
		this.teleportFromX = this.x;
		this.teleportFromY = this.y;
		let distance = 0;
		while (distance < this.teleportDistance && (this.currentPoint < this.path.length - 1))
		{
			super.move(deltaTime);
			distance = Math.sqrt((this.x - this.teleportFromX) ** 2 + (this.y - this.teleportFromY) ** 2);
		}
		this.teleportTimer = this.coolDown;
	}

	draw(ctx)
	{
		if (this.teleportBlurTimer > 0)
		{
			ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.teleportBlurTimer / 0.5})`;
			ctx.fillRect(this.teleportFromX - 10 + RandomNumber(-2, 2), this.teleportFromY - 10 + RandomNumber(-2, 2), 20, 20);
			this.color.a = 1 - (this.teleportBlurTimer / 0.5);
		}
		super.draw(ctx);
	}

	takeDamage(damage)
	{
		return super.takeDamage(damage);
	}
};
