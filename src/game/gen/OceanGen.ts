/**
 * Created by Hamster on 3/19/2015.
 */
	
///reference path=
	

class OceanGen
{
	seed:number;
	rand:HamNoise;
	
	
	oceanLevel:number;
	
	depthPoint:number[];
	
	seedInterval:number;
	
	constructor(seed:number)
	{
		this.seed = seed;
		this.rand = new HamNoise(seed);
		
		
		for (var i:number = 0; i < 20; i++)
		{
			var baseDepth:number = Math.sqrt(i);
			
		}
		
	}
	
	
	
	
	
}




