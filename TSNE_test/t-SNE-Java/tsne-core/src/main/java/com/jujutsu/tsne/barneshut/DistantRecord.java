package com.jujutsu.tsne.barneshut;

import static java.lang.Math.min;
import static java.lang.Math.sqrt;

public class DistantRecord {

	double _distant;
	double _rDistant;
	int _hasUpdated = 0;


	public DistantRecord(double distant) {
		_distant = distant;
	}
	
	@Override
	public String toString() {
		return "D=" + _distant+ ", RD=" + _rDistant+ ", hasUpdated=" + _hasUpdated;
	}

	public int hasComputed() { return _hasUpdated; }
	public void computed() { _hasUpdated++; }

}
