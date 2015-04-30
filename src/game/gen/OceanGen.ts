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
	depthSeeded:boolean[];
	zones:OceanZone[];
	segmentLength:number = 20;
	
	constructor(seed:number)
	{
		this.seed = seed;
		this.rand = new HamNoise(seed);
		
		var cZoneStart:number = 0;
		var cZoneEnd:number = 0;
		var cStartDepth:number = 0;
		
		var dd:number = Math.round(50 + 50 * this.rand.noise(0, 450));
		var ed:number = dd * this.segmentLength / 2.5 - (dd /10) + (dd * this.rand.noise(0, 451) / 5);

		var shelf = new OceanZone(ZoneType.Shelf, 0, dd, 0, ed, 8, 10, .62);
		
		dd = Math.round(20 + 10 * this.rand.noise(1, 450));
		ed = shelf.endDepth + dd * this.segmentLength * 1.5 - (dd / 10) + (dd * this.rand.noise(0, 451) / 5);
		var slope = new OceanZone(ZoneType.Slope, shelf.endIndex, shelf.endIndex + dd, shelf.endDepth, ed, 4, 20, .55);
		
		
		this.zones = [shelf, slope];
		
		this.depthPoints = [];
		this.depthSeeded = [];
		
		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			console.log(zone);
			cZoneStart = Math.round(zone.startIndex);
			cZoneEnd = Math.round(zone.endIndex);
			cStartDepth = zone.startDepth;
			var iter = 0;
			var seedInterval:number = zone.seedInterval;
			var rr:number = zone.rough;
			switch(zone.zoneType)
			{
				case ZoneType.Abyss:
					
					break;
				case ZoneType.Shelf:
					for (var j:number = cZoneStart + seedInterval; j < cZoneEnd; j += seedInterval)
					{
						this.depthPoints[j] = cStartDepth + iter * this.segmentLength / 2.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
						iter += seedInterval;
						this.depthSeeded[j] = true;
					}
					for (var j = cZoneStart; j < cZoneEnd; j++) 
					{
						this.depthPoints[j] = cStartDepth + j * this.segmentLength / 2.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
					}
					this.depthPoints[cZoneStart] = zone.startDepth;
					this.depthPoints[cZoneEnd] = zone.endDepth;
					break;
				case ZoneType.Slope:
					for (var j:number = cZoneStart + seedInterval; j < cZoneEnd; j += seedInterval)
					{
						this.depthPoints[j] = cStartDepth + iter * this.segmentLength * 1.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
						iter += seedInterval;
						this.depthSeeded[j] = true;
					}
					iter = 0;
					for (var j = cZoneStart; j < cZoneEnd; j++)
					{
						this.depthPoints[j] = cStartDepth + iter * this.segmentLength * 1.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
						iter ++;
					}
					this.depthPoints[cZoneStart] = zone.startDepth;
					this.depthPoints[cZoneEnd] = zone.endDepth;
					break;
			}
			

			var ss:number = seedInterval;
			while (ss > 1)
			{
				var hh:number = Math.floor(ss / 2);
				for (var j:number = cZoneStart + hh; j <= cZoneEnd; j += ss)
				{
					var nextPoint:number;
					
					if (j + hh > cZoneEnd)
					{
						nextPoint = this.depthPoints[cZoneEnd];
					}
					else
					{
						nextPoint = this.depthPoints[j + hh];
					}
					this.depthPoints[j] = (this.depthPoints[j - hh] + nextPoint) / 2 + this.rand.noise(j, 0) * rr * 2 - rr;
					this.depthSeeded[j] = false;
				}
				rr = rr * Math.pow(2, -zone.roughConst);
				ss = ss/ 2;
			}
			
		}

	}


}


class OceanZone
{
	zoneType:ZoneType;
	startIndex:number;
	endIndex:number;
	startDepth:number;
	endDepth:number;
	seedInterval:number;
	rough:number;
	roughConst:number;


	constructor(zoneType:ZoneType, startIndex:number, endIndex:number, startDepth:number, endDepth:number, seedInterval:number, rough:number, roughConst:number)
	{
		this.zoneType = zoneType;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
		this.startDepth = startDepth;
		this.endDepth = endDepth;
		this.seedInterval = seedInterval;
		this.rough = rough;
		this.roughConst = roughConst;
	}


}




