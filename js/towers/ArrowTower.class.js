import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js'; // You may need to create a specific projectile class for arrows

export class ArrowTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'arrow');
		this.range = 120;
		this.color = 'green';
		this.fireRate = 2;
		this.cost = 15;
	}

	createProjectile(x, y, target)
	{
		return new Projectile(x, y, target);
	}
}
