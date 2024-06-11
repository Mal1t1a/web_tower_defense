import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js';

export class FireTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'fire');
		this.range = 100;
		this.color = 'red';
		this.damage = 1;
		this.fireRate = 5;
		this.cost = 75;
	}

	createProjectile(x, y, target)
	{
		return new Projectile(x, y, target);
	}
}
