///<reference path="..\libs\phaser.d.ts"/>
///<reference path="gen\OceanGen.ts"/>
/**
 * Created by Hamster on 3/19/2015.
 */


class OceanMain
{
	game:Phaser.Game;
	
	gen:OceanGen;
	
	viewX:number;
	viewY:number;
	
	floorSegWidth:number;
	depthPoints:number[];
	
	ofGraphic:Phaser.Graphics;
	
	keyLeft:Phaser.Key;
	keyRight:Phaser.Key;
	keyUp:Phaser.Key;
	keyDown:Phaser.Key;
	
	constructor(game:Phaser.Game)
	{
		this.game = game;
		this.gen = new OceanGen(12451);
		
		this.depthPoints = this.gen.depthPoints;
		
		this.floorSegWidth = 20;
		
		this.game.stage.backgroundColor = '#9DFFE2';
		
		this.ofGraphic = game.add.graphics(0, 0);
		
		this.ofGraphic.lineStyle(1, 0x444444);
		this.ofGraphic.moveTo(0, 0);

		for (var i = 0; i < this.depthPoints.length; i++)
		{
			this.ofGraphic.lineTo(i * this.floorSegWidth, this.depthPoints[i]);
		}

		this.viewX = 0;
		this.viewY = 0;
		this.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.keyUp = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
	}
	
	public update()
	{
		if (this.keyLeft.isDown)
		{
			this.viewX -= 5;
		}
		if (this.keyRight.isDown)
		{
			this.viewX += 5;
		}
		if (this.keyUp.isDown)
		{
			this.viewY -= 5;
		}
		if (this.keyDown.isDown)
		{
			this.viewY += 5;
		}
		this.ofGraphic.x = -this.viewX;
		this.ofGraphic.y = -this.viewY;
	}
}
