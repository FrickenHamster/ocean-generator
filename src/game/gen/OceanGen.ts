///<reference path="HamRand.ts"/>
/**
 * Created by Hamster on 3/19/2015.
 */

enum ZoneType
{
	Shelf, Slope, Abyss
}


class OceanGen
{
	seed:number;
	rand:HamNoise;


	oceanLevel:number;

	depthPoints:number[];
	zones:OceanZone[];
	
	seedInterval:number;

	constructor(seed:number)
	{
		this.seed = seed;
		this.rand = new HamNoise(seed);

		var cZoneStart:number = 0;
		var cZoneEnd:number = 0;
		var cStartDepth:number = 0;
		
		this.zones = [];
		this.zones.push(new OceanZone(ZoneType.Shelf, 0, 64));
		
		this.depthPoints = [];
		
		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			console.log(zone);
			cZoneStart = zone.startIndex;
			cZoneEnd = zone.endIndex;
			var iter = 0;
			var rr:number = zone.rough;
			for (var j:number = cZoneStart; j < cZoneEnd; j += this.seedInterval)
			{
				this.depthPoints[j] = cStartDepth + iter * this.seedInterval / 2;
				iter += this.seedInterval;
			}

			var ss:number = this.seedInterval;
			console.log(ss);
			while (ss > 1)
			{
				var hh:number = Math.floor(ss / 2);
				for (var j:number = cZoneStart + hh; j < cZoneEnd; j += ss)
				{
					var nextPoint:number;
					console.log(j);
					if (j + hh > cZoneEnd)
					{
						nextPoint = this.depthPoints[cZoneEnd];
					}
					else
					{
						nextPoint = this.depthPoints[j + hh];
					}
					this.depthPoints[j] = (this.depthPoints[j - hh] + nextPoint) / 2 + this.rand.noise(j, 0) * rr * 2 - rr;
				}
			}
			rr = rr * Math.pow(2, -zone.roughConst);
			ss = ss/ 2;
		}
		

	}


}


class OceanZone
{
	zoneType:ZoneType;
	startIndex:number;
	endIndex:number;
	rough:number;
	roughConst:number;
	
	constructor(zoneType:ZoneType, startIndex:number, endIndex:number)
	{
		this.zoneType = zoneType;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
	}
	
	
	
}




