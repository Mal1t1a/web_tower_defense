import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js';

export class CannonTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'cannon');
		this.range = 100;
		this.color = 'orange';
		this.damage = 2;
		this.fireRate = 1;
		this.cost = 30;
	}

	createProjectile(x, y, target)
	{
		return new Projectile(x, y, target);
	}
}
