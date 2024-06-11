import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js';

export class CannonTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'cannon');
		this.range = 100;
		this.color = { r: 255, g: 165, b: 0, a: 1 }; //orange
		this.fireRate = 1;
		this.cost = 30;
		this.upgradeCost = this.cost * 2;
		this.damage = 3;
	}

	createProjectile(x, y, target)
	{
		return new Projectile(x, y, target);
	}
}
