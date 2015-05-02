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
	screenSegNum:number;
	depthPoints:number[];
	
	ofGraphic:Phaser.Graphics;
	groundGraphic:Phaser.Graphics;
	oceanGraphics:Phaser.Graphics;
	
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
		this.screenSegNum = Math.ceil(800 / this.floorSegWidth) + 1;
		
		this.game.stage.backgroundColor = '#9DFFE2';
		
		this.groundGraphic = game.add.graphics(0, 0);
		this.ofGraphic = game.add.graphics(0, 0);
		this.oceanGraphics = game.add.graphics(0, 0);
		
		
		this.ofGraphic.lineStyle(1, 0x444444);
		this.ofGraphic.moveTo(0, 0);

		for (var i = 0; i < this.depthPoints.length; i++)
		{
			this.ofGraphic.lineTo(i * this.floorSegWidth, this.depthPoints[i]);
			if (this.gen.depthSeeded[i])
			{
				this.ofGraphic.drawRect(i * this.floorSegWidth, this.depthPoints[i], 5, 5);
				this.ofGraphic.moveTo(i * this.floorSegWidth, this.depthPoints[i]);
			}
		}

		console.log(this.gen.makePartition(0, 100));

		this.viewX = 0;
		this.viewY = 0;
		this.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.keyUp = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
	}
	
	public update()
	{
		var prevViewX:number = this.viewX;
		var prevViewY:number = this.viewY;
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
		
		
		if (this.viewX != prevViewX || this.viewY != prevViewY)
		{
			this.oceanGraphics.clear();
			this.oceanGraphics.beginFill(0x0000FF, 0.3);
			var otop:number = Math.max(0, -this.viewY);
			this.oceanGraphics.moveTo(0, otop);
			this.oceanGraphics.lineTo(800, otop);
			this.oceanGraphics.lineTo(800, 600);
			this.oceanGraphics.lineTo(0, 600);
			this.oceanGraphics.endFill();

			this.groundGraphic.clear();
			this.groundGraphic.beginFill(0x240F10, 1);
			var sDepth:number = Math.floor(this.viewX / this.floorSegWidth);
			var eDepth:number = sDepth + this.screenSegNum;
			this.groundGraphic.moveTo(0, 600);
			var iter:number = 0;
			for (var i = sDepth; i <= eDepth; i++)
			{
				this.groundGraphic.lineTo(iter * this.floorSegWidth, this.depthPoints[i] - this.viewY);
				iter++;
			}
			this.groundGraphic.lineTo(800 + this.floorSegWidth, 600);
			this.groundGraphic.endFill();
			this.groundGraphic.x = -this.viewX % this.floorSegWidth;
		}
	}
}
