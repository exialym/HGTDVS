package com.jujutsu.tsne;

import com.jujutsu.tsne.barneshut.DataPoint;
import com.jujutsu.tsne.barneshut.Distance;
import com.jujutsu.tsne.barneshut.EuclideanDistance;
import com.jujutsu.tsne.barneshut.VpTree;
import com.jujutsu.utils.MatrixOps;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.jujutsu.utils.MatrixOps.*;

public class KNNClasifer {
	MatrixOps mo = new MatrixOps();

	protected final Distance distance = new EuclideanDistance();
	//protected final Distance distance = new FractionalDistance((Double)(9.0/10.0));
	protected  Double right = 0.0;

	public double KNNAccurcy(double[][] y, int k, String[] label) {
		// 初始化一个VP树，传入自定义的距离，这里是欧拉距离
		VpTree<DataPoint> tree = new VpTree<DataPoint>(distance);
		//DataPoint是一个保存数据点的结构，包括：数据点在所有点中的索引，维数，具体的坐标数组。
		final DataPoint [] obj_X = new DataPoint [y.length];
		//将被拍平的数据转移到DataPoint数组中
		for(int n = 0; n < y.length; n++) {
			double [] row = y[n];
			obj_X[n] = new DataPoint(2, n, row);
		}
		//构建VP树
		tree.create(obj_X);
		List<DataPoint> indices = new ArrayList<>();
		List<Double> distances = new ArrayList<>();
		HashMap<String,Integer> classMap = new HashMap<String,Integer>();
		//遍历所有点
		for(int n = 0; n < y.length; n++) {
			indices.clear();
			distances.clear();
			classMap.clear();
			//System.out.println("Looking at: " + obj_X.get(n).index());
			//找出当前点的K临近点和当前点与它们的距离，分别存在数组indices, distances
			tree.search(obj_X[n], k + 1, indices, distances);
			for (int i = 1; i < indices.size(); i++) {
				String className = label[indices.get(i).index()];
				if (classMap.get(className)==null) {
					classMap.put(className,1);
				} else {
					classMap.put(className,classMap.get(className)+1);
				}
			}
			String maxClass = null;
			int maxCount = -1;
			for (String key : classMap.keySet()) {
				if (classMap.get(key)>maxCount) {
					maxClass = key;
					maxCount = classMap.get(key);
				}
			}
			if (label[n]==maxClass) right += 1.0;
		}
		return right/y.length;
	}


}
