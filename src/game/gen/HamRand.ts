/**
 * Created by Hamster on 12/28/2014.
 */

class HamRand
{
	
	seed:number;
	prime1:number = 12211;
	prime2:number = 11087;
	m:number = this.prime1 * this.prime2;
	
	constructor(seed:number)
	{
		this.seed = seed;
	}
	
	random():number
	{
		this.seed = (this.seed * this.prime1 + this.prime2) % this.m;
		return this.seed / this.m;
	}
	
	
}


class HamNoise
{
	seed:number;

	prime1:number = 12211;
	prime2:number = 11087;
	m:number = this.prime1 * this.prime2;
	
	constructor(seed:number)
	{
		this.seed = seed;
	}
	
	
	noise(x:number, y:number):number
	{
		return ((this.seed * (x + 121) * this.prime1 + this.prime2 * (y + 131)) % this.m) / this.m;
	}
	
	
}
