package com.jujutsu.tsne.barneshut;

import static java.lang.Math.sqrt;

public class FractionalDistance implements Distance{
	private int count = 0;
	private double f;
	private double one_f;
	public FractionalDistance(double f) {
		this.one_f = 1/f;
		this.f = f;
	}

	@Override
	public double distance(DataPoint d1, DataPoint d2) {
	    double dd = .0;
	    double [] x1 = d1._x;
	    double [] x2 = d2._x;
	    double diff;
	    for(int d = 0; d < d1._D; d++) {
	        diff = (x1[d] - x2[d]);
	        dd += Math.pow(Math.abs(diff),f);
			//dd += Math.abs(diff);
	    }
	    //6621945 2920007 1902000 1815000
		count++;
	    if (count%10000==0)
			System.out.printf("\n"+count);
	    return Math.pow(dd,one_f);
		//return dd;

	}

}
