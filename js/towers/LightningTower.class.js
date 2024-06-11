import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js';

export class LightningTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'lightning');
		this.range = 200;
		this.color = 'yellow';
		this.damage = 1;
		this.fireRate = 10;
		this.cost = 150;
	}

	createProjectile(x, y, target)
	{
		return new Projectile(x, y, target);
	}
}
