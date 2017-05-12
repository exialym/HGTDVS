package com.jujutsu.tsne.demos;

import java.awt.*;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import javax.imageio.ImageIO;
import javax.swing.JFrame;

import com.jujutsu.tsne.*;
import com.jujutsu.tsne.barneshut.BHTSne;
import com.jujutsu.tsne.barneshut.BarnesHutTSne;
import com.jujutsu.tsne.barneshut.ParallelBHTsne;
import org.math.plot.FrameView;
import org.math.plot.Plot2DPanel;
import org.math.plot.PlotPanel;
import org.math.plot.plots.ColoredScatterPlot;
import org.math.plot.plots.IconScatterPlot;
import org.math.plot.plots.ScatterPlot;

import com.jujutsu.utils.MatrixOps;
import com.jujutsu.utils.MatrixUtils;

public class TSneDemo {
	
	static double perplexity = 20.0;
	private static int initial_dims = 50;
    private static String basePath = "E:/Git/HGTDVS/";
    //private static String basePath = "/Users/exialym/Desktop/Git/HGTDVS/";
    private static String path = basePath + "TSNE_test/t-SNE-Java/tsne-demos/src/main/resources/datasets/";
	public static void saveFile(File file, String text) {
		saveFile(file,text,false);
	}
	
	public static void saveFile(File file, String text, boolean append) {
        try (FileWriter fw = new FileWriter(file, append);
            BufferedWriter bw = new BufferedWriter(fw)) {
            bw.write(text);
            bw.close();
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }
	
//	public static void pca_iris() {
//    	double [][] X = MatrixUtils.simpleRead2DMatrix(new File(path + "iris_X.txt"), ",");
//    	System.out.println("Input is = " + X.length + " x " + X[0].length + " => \n" + MatrixOps.doubleArrayToPrintString(X));
//        PrincipalComponentAnalysis pca = new PrincipalComponentAnalysis();
//    	double [][] Y = pca.pca(X,2);
//    	System.out.println("Result is = " + Y.length + " x " + Y[0].length + " => \n" + MatrixOps.doubleArrayToPrintString(Y));
//    	plotIris(Y);
//    }
//
//	public static void pca_mnist(int nistSize) {
//		double [][] X = MatrixUtils.simpleRead2DMatrix(new File(path + "mnist" + nistSize + "_X.txt"));
//    	String [] labels = MatrixUtils.simpleReadLines(new File(path + "mnist2500_labels.txt"));
//    	for (int i = 0; i < labels.length; i++) {
//			labels[i] = labels[i].trim().substring(0, 1);
//		}
//        PrincipalComponentAnalysis pca = new PrincipalComponentAnalysis();
//    	double [][] Y = pca.pca(X,2);
//        Plot2DPanel plot = new Plot2DPanel();
//
//        ColoredScatterPlot setosaPlot = new ColoredScatterPlot("setosa", Y, labels);
//        plot.plotCanvas.setNotable(true);
//        plot.plotCanvas.setNoteCoords(true);
//        plot.plotCanvas.addPlot(setosaPlot);
//
//        FrameView plotframe = new FrameView(plot);
//        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        plotframe.setVisible(true);
//    }
//
//
//    public static void tsne_iris() {
//    	double [][] X = MatrixUtils.simpleRead2DMatrix(new File(path + "iris_X.txt"), ",");
//        System.out.println(MatrixOps.doubleArrayToPrintString(X, ", ", 50,10));
//        TSne tsne = new SimpleTSne();
//		double [][] Y = tsne.tsne(X, 2, initial_dims, perplexity);
//        System.out.println(MatrixOps.doubleArrayToPrintString(Y, ", ", 50,10));
//        plotIris(Y);
//    }
//
//	static void plotIris(double[][] Y) {
//		double [][]        setosa = new double[initial_dims][];
//        String []     setosaNames = new String[initial_dims];
//        double [][]    versicolor = new double[initial_dims][];
//        String [] versicolorNames = new String[initial_dims];
//        double [][]     virginica = new double[initial_dims][];
//        String []  virginicaNames = new String[initial_dims];
//
//        int cnt = 0;
//        for (int i = 0; i < initial_dims; i++, cnt++) {
//        	setosa[i] = Y[cnt];
//            	setosaNames[i] = "setosa";
//        }
//        for (int i = 0; i < initial_dims; i++, cnt++) {
//        	versicolor[i] = Y[cnt];
//        	versicolorNames[i] = "versicolor";
//        }
//        for (int i = 0; i < initial_dims; i++, cnt++) {
//        	virginica[i] = Y[cnt];
//        	virginicaNames[i] = "virginica";
//        }
//
//        Plot2DPanel plot = new Plot2DPanel();
//
//        ScatterPlot setosaPlot = new ScatterPlot("setosa", PlotPanel.COLORLIST[0], setosa);
//        setosaPlot.setTags(setosaNames);
//
//        ScatterPlot versicolorPlot = new ScatterPlot("versicolor", PlotPanel.COLORLIST[1], versicolor);
//        versicolorPlot.setTags(versicolorNames);
//        ScatterPlot virginicaPlot = new ScatterPlot("versicolor", PlotPanel.COLORLIST[2], virginica);
//        virginicaPlot.setTags(virginicaNames);
//
//        plot.plotCanvas.setNotable(true);
//        plot.plotCanvas.setNoteCoords(true);
//        plot.plotCanvas.addPlot(setosaPlot);
//        plot.plotCanvas.addPlot(versicolorPlot);
//        plot.plotCanvas.addPlot(virginicaPlot);
//
//        //int setosaId = plot.addScatterPlot("setosa", setosa);
//        //int versicolorId = plot.addScatterPlot("versicolor", versicolor);
//        //int virginicaId = plot.addScatterPlot("virginica", virginica);
//
//        FrameView plotframe = new FrameView(plot);
//        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        plotframe.setVisible(true);
//	}
//
//    public static void tsne_mnist(int nistSize) {
//    	System.out.println("Running SimpleTSne on " + nistSize + " MNIST digits...");
//        run_tsne_mnist(nistSize,new SimpleTSne());
//    }
//
//    public static void fast_tsne_mnist(int nistSize) {
//    	System.out.println("Running FastTSne on " + nistSize + " MNIST digits...");
//        run_tsne_mnist(nistSize,new FastTSne());
//    }
//
//    public static void fast_tsne(String filename, String labelfilename) {
//    	TSne tsne = new FastTSne();
//    	int iters = 1000;
//    	System.out.println("Running " + iters + " iterations of TSne on " + filename);
//        double [][] X = MatrixUtils.simpleRead2DMatrix(new File(filename), " ");
//    	String [] labels = MatrixUtils.simpleReadLines(new File(labelfilename));
//    	for (int i = 0; i < labels.length; i++) {
//			labels[i] = labels[i].trim().substring(0, 1);
//		}
//        System.out.println("Shape is: " + X.length + " x " + X[0].length);
//        System.out.println("Starting TSNE: " + new Date());
//        double [][] Y = tsne.tsne(X, 2, initial_dims, perplexity, iters);
//        System.out.println("Finished TSNE: " + new Date());
//        //System.out.println("Result is = " + Y.length + " x " + Y[0].length + " => \n" + MatrixOps.doubleArrayToString(Y));
//        System.out.println("Result is = " + Y.length + " x " + Y[0].length);
//        saveFile(new File("Java-tsne-result.txt"), MatrixOps.doubleArrayToString(Y));
//        Plot2DPanel plot = new Plot2DPanel();
//
//        ColoredScatterPlot setosaPlot = new ColoredScatterPlot("setosa", Y, labels);
//        plot.plotCanvas.setNotable(true);
//        plot.plotCanvas.setNoteCoords(true);
//        plot.plotCanvas.addPlot(setosaPlot);
//
//        FrameView plotframe = new FrameView(plot);
//        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        plotframe.setVisible(true);
//    }
//
//    public static void fast_tsne_no_labels(String filename) {
//    	TSne tsne = new FastTSne();
//    	int iters = 2000;
//    	System.out.println("Running " + iters + " iterations of TSne on " + filename);
//        double [][] X = MatrixUtils.simpleRead2DMatrix(new File(filename), ",");
//        System.out.println("X:" + MatrixOps.doubleArrayToString(X));
//        X = MatrixOps.log(X, true);
//        //System.out.println("X:" + MatrixOps.doubleArrayToString(X));
//        X = MatrixOps.centerAndScale(X);
//        System.out.println("Shape is: " + X.length + " x " + X[0].length);
//        System.out.println("Starting TSNE: " + new Date());
//        double [][] Y = tsne.tsne(X, 2, initial_dims, perplexity, iters,false);
//        System.out.println("Finished TSNE: " + new Date());
//        //System.out.println("Result is = " + Y.length + " x " + Y[0].length + " => \n" + MatrixOps.doubleArrayToString(Y));
//        System.out.println("Result is = " + Y.length + " x " + Y[0].length);
//        saveFile(new File("Java-tsne-result.txt"), MatrixOps.doubleArrayToString(Y));
//        Plot2DPanel plot = new Plot2DPanel();
//
//        ScatterPlot setosaPlot = new ScatterPlot("setosa", Color.BLACK, Y);
//        plot.plotCanvas.setNotable(true);
//        plot.plotCanvas.setNoteCoords(true);
//        plot.plotCanvas.addPlot(setosaPlot);
//
//        FrameView plotframe = new FrameView(plot);
//        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        plotframe.setVisible(true);
//    }
//
//    public static void pca_no_labels(String filename) {
//    	System.out.println("Running PCA on " + filename);
//        double [][] X = MatrixUtils.simpleRead2DMatrix(new File(filename), ",");
//        System.out.println("Shape is: " + X.length + " x " + X[0].length);
//        System.out.println("Starting PCA: " + new Date());
//        PrincipalComponentAnalysis pca = new PrincipalComponentAnalysis();
//        double [][] Y = pca.pca(X, 2);
//        System.out.println("Finished PCA: " + new Date());
//        //System.out.println("Result is = " + Y.length + " x " + Y[0].length + " => \n" + MatrixOps.doubleArrayToString(Y));
//        System.out.println("Result is = " + Y.length + " x " + Y[0].length);
//        saveFile(new File("Java-tsne-result.txt"), MatrixOps.doubleArrayToString(Y));
//        Plot2DPanel plot = new Plot2DPanel();
//
//        ScatterPlot setosaPlot = new ScatterPlot("setosa", Color.BLACK, Y);
//        plot.plotCanvas.setNotable(true);
//        plot.plotCanvas.setNoteCoords(true);
//        plot.plotCanvas.addPlot(setosaPlot);
//
//        FrameView plotframe = new FrameView(plot);
//        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        plotframe.setVisible(true);
//    }
//
//
//    public static void run_tsne_mnist(int nistSize, TSne tsne) {
//        double [][] X = MatrixUtils.simpleRead2DMatrix(new File(path + "mnist" + nistSize + "_X.txt"));
//    	String [] labels = MatrixUtils.simpleReadLines(new File(path + "mnist2500_labels.txt"));
//    	for (int i = 0; i < labels.length; i++) {
//			labels[i] = labels[i].trim().substring(0, 1);
//		}
//        System.out.println("Shape is: " + X.length + " x " + X[0].length);
//        System.out.println("Starting TSNE: " + new Date());
//        double [][] Y = tsne.tsne(X, 2, initial_dims, perplexity);
//        System.out.println("Finished TSNE: " + new Date());
//        //System.out.println("Result is = " + Y.length + " x " + Y[0].length + " => \n" + MatrixOps.doubleArrayToString(Y));
//        System.out.println("Result is = " + Y.length + " x " + Y[0].length);
//        saveFile(new File("Java-tsne-result.txt"), MatrixOps.doubleArrayToString(Y));
//        Plot2DPanel plot = new Plot2DPanel();
//
//        ColoredScatterPlot setosaPlot = new ColoredScatterPlot("setosa", Y, labels);
//        plot.plotCanvas.setNotable(true);
//        plot.plotCanvas.setNoteCoords(true);
//        plot.plotCanvas.addPlot(setosaPlot);
//
//        FrameView plotframe = new FrameView(plot);
//        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        plotframe.setVisible(true);
//    }
//
//    public static void tsne_mnist_icons(int nistSize) {
//        System.out.println("Running example on " + nistSize + " MNIST digits...");
//        double [][] X = MatrixUtils.simpleRead2DMatrix(new File(path + "mnist" + nistSize + "_X.txt"));
//    	String [] imgfiles = new String[nistSize];
//    	for (int i = 0; i < imgfiles.length; i++) {
//			imgfiles[i] = basePath + "TSNE_test/t-SNE-Java/tsne-demos/src/main/resources/nistimgs/img" + i + ".png";
//		}
//        System.out.println("Shape is: " + X.length + " x " + X[0].length);
//        TSne tsne = new SimpleTSne();
//        double [][] Y = tsne.tsne(X, 2, initial_dims, perplexity, 1000, true);
//        System.out.println(MatrixOps.doubleArrayToPrintString(Y));
//        Plot2DPanel plot = new Plot2DPanel();
//
//        IconScatterPlot setosaPlot = new IconScatterPlot("setosa", Y, imgfiles);
//        plot.plotCanvas.setNotable(true);
//        plot.plotCanvas.setNoteCoords(true);
//        plot.plotCanvas.addPlot(setosaPlot);
//
//        FrameView plotframe = new FrameView(plot);
//        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        plotframe.setVisible(true);
//    }
    public static void test_workflow(String dataFile, String labelFile, boolean usePCA, boolean useRankorder, double[] fArr, int initial_dims, double perplexity, int KNNNum, int repeatNum) {
        //int initial_dims = 55;
        //double perplexity = 20.0;



        String [] labels = MatrixUtils.simpleReadLines(new File(labelFile));
        for (int i = 0; i < labels.length; i++) {
            labels[i] = labels[i].trim().substring(0, 1);
        }
        ArrayList<double[]> finalKNNResult = new ArrayList<double[]>();
        KNNClasifer classifer = new KNNClasifer();
        for (double f:fArr) {
            //System.out.println("Shape is: " + X.length + " x " + X[0].length);
            //System.out.println("Starting TSNE: " + new Date());
            double[] tempKNNresult = new double[KNNNum+1];
            for (int j = 0; j < repeatNum;j++) {
                double [][] X = MatrixUtils.simpleRead2DMatrix(new File(dataFile), "   ");
                //double [][] X = MatrixUtils.simpleRead2DMatrix(new File(basePath + "TSNE_test/t-SNE-Python/mnist_data11111111111.txt"), ",");
                //System.out.println(MatrixOps.doubleArrayToPrintString(X, ", ", 50,10));
                BarnesHutTSne tsne;
                boolean parallel = false;
                if(parallel) {
                    tsne = new ParallelBHTsne();
                } else {
                    tsne = new BHTSne();
                }
                double [][] Y = tsne.tsne(X, 2, initial_dims, perplexity,20000,usePCA,useRankorder,0.5,f);
                //System.out.println("Finished TSNE: " + new Date());
                //System.out.println("Result is = " + Y.length + " x " + Y[0].length + " => \n" + MatrixOps.doubleArrayToString(Y));
                //System.out.println("Result is = " + Y.length + " x " + Y[0].length);
                saveFile(new File("MNIST_2500_F_"+f+(usePCA?"_withPCA_":"_noPCA_")+(useRankorder?"_withRank_":"_noRank_")+"result_"+j+".txt"), MatrixOps.doubleArrayToString(Y));
                Plot2DPanel plot = new Plot2DPanel();

                ColoredScatterPlot setosaPlot = new ColoredScatterPlot("setosa", Y, labels);
                //ScatterPlot setosaPlot = new ScatterPlot("setosa", Color.BLACK, Y);
                plot.plotCanvas.setNotable(true);
                plot.plotCanvas.setNoteCoords(true);
                plot.plotCanvas.addPlot(setosaPlot);

                FrameView plotframe = new FrameView(plot);
//                plot.setSize(new Dimension(1600,1000));
//                plotframe.setSize(new Dimension(1600,1000));
//                plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                plotframe.setVisible(true);
                Dimension imageSize = plotframe.getSize();
                BufferedImage image = new BufferedImage(imageSize.width,
                        imageSize.height, BufferedImage.TYPE_INT_ARGB);
                Graphics2D g = image.createGraphics();
                plot.paint(g);
                g.dispose();
                try {
                    ImageIO.write(image, "png", new File("MNIST_2500_F_"+f+(usePCA?"_withPCA_":"_noPCA_")+(useRankorder?"_withRank_":"_noRank_")+"result_"+j+".png"));
                } catch (IOException e) {
                    e.printStackTrace();
                }

                //double [][] result = MatrixUtils.simpleRead2DMatrix(new File("Java-tsne-result.txt"), ",");
                for (int i = 1;i <= KNNNum; i++) {
                    tempKNNresult[i] += classifer.KNNAccurcy(Y,i,labels);
                }

            }
            tempKNNresult[0] = f;
            for (int i = 1;i <= KNNNum; i++) {
                tempKNNresult[i] /= repeatNum;
                tempKNNresult[i] *= 100;
            }
            finalKNNResult.add(tempKNNresult);


        }


        String res = "";
        for (int j = 0;j <= KNNNum; j++) {
            for (int i = 0;i < finalKNNResult.size(); i++) {
                if (i==0)
                    res += j+"\t:\t" + String.format("%.4f", finalKNNResult.get(i)[j]) + "\t";
                else
                    res += String.format("%.4f", finalKNNResult.get(i)[j]) + "\t";
            }
            res += "\r\n";
        }
        saveFile(new File("MNIST_2500_F_"+(usePCA?"_withPCA_":"_noPCA_")+(useRankorder?"_withRank_":"_noRank_")+"KNN_compare.txt"), res);
        Plot2DPanel plot = new Plot2DPanel();

        //ColoredScatterPlot setosaPlot = new ColoredScatterPlot("setosa", Y, labels);
        //ScatterPlot setosaPlot = new ScatterPlot("setosa", Color.BLACK, Y);
        plot.plotCanvas.setNotable(true);
        plot.plotCanvas.setNoteCoords(true);
        double[] xAxis = new double[KNNNum];
        for (int i = 0; i < KNNNum; i++) xAxis[i] = i+1;
        for (int i = 0; i < finalKNNResult.size(); i++) {
            double [] temp = new double[KNNNum];
            System.arraycopy(finalKNNResult.get(i), 1, temp, 0, KNNNum);
            plot.addLinePlot(""+finalKNNResult.get(i)[0],xAxis,temp);
        }
        plot.plotLegend.setEnabled(true);
        plot.addLegend("East");
        FrameView plotframe = new FrameView(plot);
        plotframe.setVisible(true);
        Dimension imageSize = plotframe.getSize();
        BufferedImage image = new BufferedImage(imageSize.width,
                imageSize.height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();
        plot.paint(g);
        g.dispose();
        try {
            ImageIO.write(image, "png", new File("MNIST_2500_F_"+(usePCA?"_withPCA_":"_noPCA_")+(useRankorder?"_withRank_":"_noRank_")+"KNN_compare.png"));
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
    
    public static void main(String [] args) {
//        System.out.println("TSneDemo: Runs t-SNE on various dataset.");
//
//        String fileName = basePath + "TSNE_test/t-SNE-Java/tsne-demos/src/main/resources/datasets/mnist2500_X.txt";
//        String LabelName = path + "mnist2500_labels.txt";
//        //double[] fArr = {2.0,0.99,0.95,0.90,0.85,0.80,0.75,0.70,0.65,0.60,0.55,0.50};
//        //double[] fArr = {2.0,0.90,0.80,0.70,0.60,0.50};
//        double[] fArr = {2.0};
//
//        test_workflow(fileName,LabelName,true,true, fArr,55,20.0,100, 50);


        int initial_dims = 55;
        double perplexity = 20.0;
        double [][] X = MatrixUtils.simpleRead2DMatrix(new File("E:/uspollution/pollution_data_withGPS_filled_selected_raw.csv"), ",");
        //double [][] X = MatrixUtils.simpleRead2DMatrix(new File(basePath + "TSNE_test/t-SNE-Python/mnist_data11111111111.txt"), ",");
        System.out.println(MatrixOps.doubleArrayToPrintString(X, ", ", 50,10));
        BarnesHutTSne tsne;
        boolean parallel = false;
        if(parallel) {
            tsne = new ParallelBHTsne();
        } else {
            tsne = new BHTSne();
        }


//        String [] labels = MatrixUtils.simpleReadLines(new File(path + "mnist2500_labels.txt"));
//        for (int i = 0; i < labels.length; i++) {
//            labels[i] = labels[i].trim().substring(0, 1);
//        }
        System.out.println("Shape is: " + X.length + " x " + X[0].length);
        System.out.println("Starting TSNE: " + new Date());
        double [][] Y = tsne.tsne(X, 2, initial_dims, perplexity,20000,false,false,0.5,2);
        System.out.println("Finished TSNE: " + new Date());
        //System.out.println("Result is = " + Y.length + " x " + Y[0].length + " => \n" + MatrixOps.doubleArrayToString(Y));
        System.out.println("Result is = " + Y.length + " x " + Y[0].length);
        saveFile(new File("Java-tsne-result.txt"), MatrixOps.doubleArrayToString(Y));
        Plot2DPanel plot = new Plot2DPanel();

        //ColoredScatterPlot setosaPlot = new ColoredScatterPlot("setosa", Y, labels);
        ScatterPlot setosaPlot = new ScatterPlot("setosa", Color.BLACK, Y);
        plot.plotCanvas.setNotable(true);
        plot.plotCanvas.setNoteCoords(true);
        plot.plotCanvas.addPlot(setosaPlot);

        FrameView plotframe = new FrameView(plot);
        plotframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        plotframe.setVisible(true);


        //double [][] result = MatrixUtils.simpleRead2DMatrix(new File("Java-tsne-result.txt"), ",");
//        for (int i = 1;i < 100; i++)
//            System.out.println(i + ":" + (new KNNClasifer()).KNNAccurcy(Y,i,labels));











    }


}
