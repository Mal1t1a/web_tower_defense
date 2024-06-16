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
		this.fireRate = 3;
		this.cost = 75;
		this.upgradeCost = this.cost * 2;
		this.burnAmount = 1;
		this.burnRate = 8;
		this.burnDuration = 1000;
	}

	upgrade()
	{
		super.upgrade();
		this.burnAmount += 1;
		this.burnDuration += 500;
	}

	createProjectile(x, y, target)
	{
		return new FireProjectile({x, y, target});
	}
}
