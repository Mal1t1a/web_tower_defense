import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js';
import { IceProjectile } from './projectiles/IceProjectile.class.js';

export class IceTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'ice');
		this.range = 120;
		this.color = { r: 0, g: 255, b: 255, a: 1 }; //cyan
		this.damage = 0.25;
		this.fireRate = 2;
		this.cost = 50;
		this.upgradeCost = this.cost * 2;
		this.slowAmount = 0.5;
		this.slowDuration = 1000;
	}

	upgrade()
	{
		super.upgrade();
		this.slowAmount += 0.1;
		this.slowDuration += 100;
	}

	createProjectile(x, y, target)
	{
		return new IceProjectile(x, y, target, this.slowAmount, this.slowDuration);
	}
}
