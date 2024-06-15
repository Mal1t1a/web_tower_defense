import { Enemy } from './index.js';

export class BasicEnemy extends Enemy
{
	constructor({path, bounty = 5})
	{
		super({path, speed: 100, type: 'basic', bounty});
		this.color = {r: 255, g: 0, b: 0, a: 1}; //red
		this.maxHealth = 3;
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
