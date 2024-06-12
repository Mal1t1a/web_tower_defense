import { Tower } from './Tower.class.js';
import { LightningProjectile } from './projectiles/index.js';

export class LightningTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'lightning');
		this.range = 200;
		this.color = { r: 255, g: 255, b: 0, a: 1 }; //yellow
		this.damage = 1;
		this.fireRate = 10;
		this.cost = 150;
		this.upgradeCost = this.cost * 2;
	}

	createProjectile(x, y, target)
	{
		return new LightningProjectile(x, y, target);
	}
}
