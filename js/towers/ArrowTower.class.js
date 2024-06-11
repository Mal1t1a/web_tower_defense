import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js'; // You may need to create a specific projectile class for arrows

export class ArrowTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'arrow');
		this.range = 120;
		this.color = { r: 0, g: 255, b: 0, a: 1 }; //green
		this.fireRate = 2;
		this.cost = 15;
		this.upgradeCost = this.cost * 2;
		this.damage = 1;
	}

	createProjectile(x, y, target)
	{
		return new Projectile(x, y, target);
	}
}
