import { showGlow } from "../../gameState.js";
import { Projectile } from "./index.js";

export class FireProjectile extends Projectile
{
	constructor(x, y, target, color)
	{
		super(x, y, target, color);
	}

	move(deltaTime)
	{
		return super.move(deltaTime);
	}

	draw(ctx)
	{
		if (showGlow)
		{
			ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
			ctx.shadowBlur = 15;
		}
		
		super.draw(ctx);
		
		if (showGlow)
		{
			ctx.shadowBlur = 0;
		}
	}
};
