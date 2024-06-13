import { Tower } from './Tower.class.js';
import { FireProjectile } from './projectiles/index.js';

export class FireTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'fire');
		this.range = 100;
		this.color = { r: 255, g: 0, b: 0, a: 1 }; //red
		this.damage = 1.5;
		this.fireRate = 5;
		this.cost = 75;
		this.upgradeCost = this.cost * 2;
	}

	createProjectile(x, y, target)
	{
		return new FireProjectile(x, y, target);
	}
}
