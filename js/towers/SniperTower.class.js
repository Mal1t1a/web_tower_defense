import { Tower } from './Tower.class.js';
import { Projectile } from './projectiles/Projectile.class.js'; // You may need to create a specific projectile class for arrows

export class SniperTower extends Tower
{
	constructor(x, y)
	{
		super(x, y, 'sniper');
		this.color = {
			r: 165,
			g: 42,
			b: 42,
			a: 1
		};
		this.fireRate = 1 / 5; // 1 shot every 5 seconds
		this.cost = 300;
		this.upgradeCost = this.cost * 2;
		this.damage = 100;
		this.range = 1000;
	}

	shoot(enemies, deltaTime)
	{
		if (this.fireCooldown > 0)
		{
			this.fireCooldown -= deltaTime;
		}

		if (this.fireCooldown <= 0 && enemies.length > 0)
		{
			//random enemy
			const enemy = enemies[Math.floor(Math.random() * enemies.length)];
			const dx = enemy.x - this.x;
			const dy = enemy.y - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.range)
			{
				var projectile = this.createProjectile(this.x, this.y, enemy);
				projectile.color = this.color;
				projectile.damage = this.damage;
				this.projectiles.push(projectile);
				this.emit('shoot', projectile);
				this.fireCooldown = 1 / this.fireRate + Math.random() * 0.5;
			}
		}
	}

	upgrade()
	{
		super.upgrade();
		this.fireRate *= 1.5;
	}

	createProjectile(x, y, target)
	{
		var proj = new Projectile(x, y, target);
		proj.speed = 1000;
		proj.damage = this.damage;
		return proj;
	}
}
