import { Enemy } from './index.js';

export class FastEnemy extends Enemy
{
	constructor({path, bounty = 5})
	{
		super({path, speed: 200, type: 'fast', bounty});
		this.color = {r: 0, g: 255, b: 0, a: 1}; //green
		this.maxHealth = 2;
		this.health = this.maxHealth;
		
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
