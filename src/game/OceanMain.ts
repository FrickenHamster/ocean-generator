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
	
	constructor(game:Phaser.Game)
	{
		this.game = game;
		this.gen = new OceanGen(134512);
		
		this.depthPoints = this.gen.depthPoints;
		
		this.floorSegWidth = 5;
		
		this.game.stage.backgroundColor = '#888888';
		
		this.ofGraphic = game.add.graphics(0, 0);
		
		this.ofGraphic.lineStyle(1, 0x444444);
		this.ofGraphic.moveTo(0, 0);
		
		
		for (var i = 0; i < 40; i++) 
		{
			this.ofGraphic.lineTo(i * 10, this.depthPoints[i]);
		}
		
	}
	
	public update()
	{
		
	}
}
