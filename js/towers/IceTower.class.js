import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js';
import { IceProjectile } from './projectiles/IceProjectile.class.js';

export class IceTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'ice');
		this.range = 120;
		this.color = 'cyan';
		this.damage = 0.1;
		this.fireRate = 2;
		this.cost = 50;
	}

	createProjectile(x, y, target)
	{
		return new IceProjectile(x, y, target);
	}
}
