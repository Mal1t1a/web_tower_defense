import { Enemy } from './index.js';
import { waveNumber } from '../gameState.js';

export class BossEnemy extends Enemy
{
	constructor({path, bounty = 5})
	{
		super({ path, speed: 150, type: 'boss', bounty });
		this.color = { r: 255, g: 255, b: 0, a: 1 }; //yellow
		this.maxHealth = 5 * (waveNumber * 3);
		this.health = this.maxHealth;
		this.bounty *= 2.5;
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
