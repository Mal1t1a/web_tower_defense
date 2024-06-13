import { Enemy } from './index.js';

export class BossEnemy extends Enemy
{
	constructor({path, bounty = 5})
	{
		super({path, speed: 150, type: 'boss', bounty});
		this.color = { r: 255, g: 255, b: 0, a: 1 }; //yellow
		this.maxHealth = 5;
		this.health = this.maxHealth;
		this.glow = true;

	}

	move(deltaTime)
	{
		super.move(deltaTime);

	}

	draw(ctx)
	{
		super.draw(ctx);

	}

	takeDamage(damage)
	{
		return super.takeDamage(damage);
	}
};
