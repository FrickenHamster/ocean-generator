///<reference path="HamRand.ts"/>
/**
 * Created by Hamster on 3/19/2015.
 */

enum OceanZone
{
	Shelf, Slope, Abyss
}


class OceanGen
{
	seed:number;
	rand:HamNoise;


	oceanLevel:number;

	depthPoints:number[];

	seedInterval:number;

	constructor(seed:number)
	{
		this.seed = seed;
		this.rand = new HamNoise(seed);

		this.depthPoints = [];

		for (var i:number = 0; i < 40; i++)
		{

			var baseDepth:number = Math.sqrt(i) * 60;
			this.depthPoints[i] = baseDepth;

		}

	}


}




