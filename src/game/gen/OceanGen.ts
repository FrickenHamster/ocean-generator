///<reference path="HamRand.ts"/>
/**
 * Created by Hamster on 3/19/2015.
 */

enum ZoneType
{
	Shelf, Slope, Abyss
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

class OceanPartition
{
	startIndex:number;
	endIndex:number;
	floorDepths:number[];


	constructor(startIndex:number, endIndex:number, floorDepths:number[])
	{
		this.startIndex = startIndex;
		this.endIndex = endIndex;
		this.floorDepths = floorDepths;
	}
}



class OceanGen
{
	seed:number;
	rand:HamNoise;


	oceanLevel:number;

	depthPoints:number[];
	depthSeeded:boolean[];
	zones:OceanZone[];
	floorSegWidth:number = 20;
	
	constructor(seed:number)
	{
		this.seed = seed;
		this.rand = new HamNoise(seed);
		
		var cZoneStart:number = 0;
		var cZoneEnd:number = 0;
		var cStartDepth:number = 0;
		
		var dd:number = Math.round(100 + 100 * this.rand.noise(0, 450));
		var ed:number = dd * this.floorSegWidth / 2.5 - (dd /10) + (dd * this.rand.noise(0, 451) / 5);

		var shelf = new OceanZone(ZoneType.Shelf, 0, dd, 0, ed, 8, 10, .62);
		
		dd = Math.round(60 + 30 * this.rand.noise(1, 450));
		ed = shelf.endDepth + dd * this.floorSegWidth * 1.5 - (dd / 10) + (dd * this.rand.noise(0, 451) / 5);
		var slope = new OceanZone(ZoneType.Slope, shelf.endIndex, shelf.endIndex + dd, shelf.endDepth, ed, 4, 20, .55);
		
		
		this.zones = [shelf, slope];
		
		this.depthPoints = [];
		this.depthSeeded = [];
		
		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			cZoneStart = Math.round(zone.startIndex);
			cZoneEnd = Math.round(zone.endIndex);
			cStartDepth = zone.startDepth;
			var iter = 8;
			var seedInterval:number = zone.seedInterval;
			var rr:number = zone.rough;
			switch(zone.zoneType)
			{
				case ZoneType.Abyss:
					
					break;
				case ZoneType.Shelf:
					for (var j:number = cZoneStart + seedInterval; j < cZoneEnd; j += seedInterval)
					{
						
						this.depthPoints[j] = cStartDepth + iter * this.floorSegWidth / 2.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
						iter += seedInterval;
						this.depthSeeded[j] = true;
					}
					/*for (var j = cZoneStart; j < cZoneEnd; j++) 
					{
						this.depthPoints[j] = cStartDepth + j * this.floorSegWidth / 2.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
					}*/
					this.depthPoints[cZoneStart] = zone.startDepth;
					this.depthPoints[cZoneEnd] = zone.endDepth;
					break;
				case ZoneType.Slope:
					for (var j:number = cZoneStart + seedInterval; j < cZoneEnd; j += seedInterval)
					{
						this.depthPoints[j] = cStartDepth + iter * this.floorSegWidth * 1.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
						iter += seedInterval;
						this.depthSeeded[j] = true;
					}
					iter = 0;
					/*for (var j = cZoneStart; j < cZoneEnd; j++)
					{
						this.depthPoints[j] = cStartDepth + iter * this.floorSegWidth * 1.5 - zone.rough + 2 * zone.rough * this.rand.noise(j, 0);
						iter ++;
					}*/
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
	
	public makePartition(startIndex:number, endIndex:number):OceanPartition
	{
		//set start to start of interval
		var cZone:OceanZone = this.zones[startZoneIndex];
		var floorDepths:number[] = [];
		var startZoneIndex:number = -1;
		var endZoneIndex:number = this.zones.length - 1;
		for (var i = 0; i < this.zones.length; i++)
		{
			cZone = this.zones[i];
			if ( startIndex >= cZone.startIndex)
			{
				if (startIndex != -1)
					startZoneIndex = i;
				
			}
			if (endIndex <= cZone.endIndex)
			{
				endZoneIndex = i;
				break;
			}
		}
		var startZone:OceanZone = this.zones[startZoneIndex];
		
		var sInd:number = startZone.startIndex + startZone.seedInterval * Math.floor((startIndex - startZone.startIndex) / startZone.seedInterval);
		var eInd:number = cZone.startIndex + cZone.seedInterval * Math.ceil((endIndex - cZone.startIndex) / cZone.seedInterval);
		var partition:OceanPartition = new OceanPartition(startIndex, endIndex, floorDepths);
		var cIndex:number = startIndex;
		
		for (var i = startZoneIndex; i <= endZoneIndex; i++) 
		{
			cZone = this.zones[i];
			var cZoneStart:number = cZone.startIndex;
			cIndex = cZone.startIndex;
			var cZoneEnd:number = cZone.endIndex;
			var seedInterval:number = cZone.seedInterval;
			var cStartDepth:number = cZone.startDepth;
			var cEndDepth:number = cZone.endDepth;
			var iter:number = 0; // multiple of interval in zone
			
			if (i == startZoneIndex)
			{
				cZoneStart = sInd;
				cIndex = sInd;
				iter = sInd - cZone.startIndex;
			}
			if (i == endZoneIndex)
			{
				cZoneEnd = eInd;
			}
			
			switch(cZone.zoneType)
			{
				case ZoneType.Abyss:

					break;
				case ZoneType.Shelf:
					for (var j:number = cZoneStart; j <= cZoneEnd; j += seedInterval)
					{
						cIndex = j - sInd;
						if (j == cZone.startIndex)
						{
							floorDepths[cIndex] = cStartDepth;
							iter += seedInterval;
							continue;
						}
						if (j >= cZone.endIndex)
						{
							floorDepths[cIndex] = cEndDepth;
							iter += seedInterval;
							continue;
						}
						floorDepths[cIndex] = cStartDepth + iter * this.floorSegWidth / 2.5 - cZone.rough + 2 * cZone.rough * this.rand.noise(j, 0);
						console.log(cIndex, iter, j);
						iter += seedInterval;
						//fill in inner
						
						var rr = cZone.rough;
						var ss:number = seedInterval;
						while (ss > 1)
						{
						
							var hh:number = Math.floor(ss / 2);
							for (var k:number = j - seedInterval + hh; k <= j; k += ss)
							{
								cIndex = k - sInd;
								var nextPoint:number;
								if (k + hh > cZoneEnd)
								{
									nextPoint = floorDepths[cZoneEnd - sInd];
								}
								else
								{
									nextPoint = floorDepths[k + hh - sInd];
								}
								floorDepths[cIndex] = (floorDepths[k - hh - sInd] + nextPoint) / 2 + this.rand.noise(k, 0) * rr * 2 - rr;
							}
							rr = rr * Math.pow(2, -cZone.roughConst);
							ss = ss/ 2;
							
						}
					}
					
					
					
					break;
				case ZoneType.Slope:
					for (var j:number = cZoneStart; j < cZoneEnd; j += seedInterval)
					{
						cIndex = j - sInd;
						if (j == cZone.startIndex)
						{
							floorDepths[cIndex] = cZone.startDepth;
							continue;
						}
						if (j == cZone.endIndex)
						{
							floorDepths[cIndex] = cZone.endDepth;
							continue;
						}
						floorDepths[cIndex] = cStartDepth + iter * this.floorSegWidth * 1.5 - cZone.rough + 2 * cZone.rough * this.rand.noise(j, 0);
						iter += seedInterval;
						
					}
					
			}
			
		}
		var ff = floorDepths.slice(startIndex - sInd);
		partition.floorDepths = ff;
		return partition;
	}

	
}







