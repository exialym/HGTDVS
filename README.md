# HGTDVS


High-dimensional Geographical & Timing Data Visualization System


### 简介
[Demo地址](https://exialym.github.io/HGTDVS/)
</br>这是一个高维时空数据可视化系统，如果你的高维数据同时具有时间，空间信息，可以利用这个系统可视化你的数据。这个系统内置了数据降维模块，最大限度的利用三维空间展示高维数据间的关系，结合各个不同的视图，帮助你在数据中找到潜在的关系和模式。
</br>Demo数据是美国2000年-2016年的各地空气污染物组成（按年统计）。
</br>降维完成的数据文件Demo：[美国2000年-2016年的各地空气污染物组成（按月统计）](https://github.com/exialym/HGTDVS/blob/master/pollution_data_withGPS_filled_combined_month_embedding.csv)，数据规模比较大，下载下来后点击choose embedding file按钮导入。

### 如何操作
系统由4个视图和1个工具边栏组成，地图视图显示数据的地理分布，三维视图显示数据降维的过程和结果，平行坐标视图显示数据在各个维度的分布，时间视图显示数据在时间上的分布。
</br>这4个视图是联动的，鼠标的选中，浮动，刷取等操作会在其他视图中看到对应的效果。选中的点的详细信息也会显示在边栏的表格中，表格是否可以展开在头部进行设置。
</br>工具栏可以配置降维算法的参数，以及在三维视图中选择一个点会找出他的几个邻居。点击begin开始降维的过程，降维算法使用t-SNE。
</br>如果你要可视化自己的数据，你可以在头部选择导入原始数据并在本系统中进行降维并观察降维的过程，也可以直接导入降维完成的数据。
### 原始数据需满足以下格式：</h4>
CSV格式文件，第一列是数据编号，第二列是GPS纬度，第三列是GPS经度，第四列是时间，剩余列是高维数据。高维数据应都是数值。
### 降维完成的数据需满足以下格式：</h4>
CSV格式文件，第一列是数据编号，第二列是GPS纬度，第三列是GPS经度，第四列是时间，第五-七列是降维到3维的数据，剩余列是原始高维数据。高维数据应都是数值。


## Development

If you want to develop this project.

You can connect me with exialym@icloud.com.


### About Permission

The project is open-sourced under MIT license.



## License

The MIT License (MIT)

Copyright (c) 2016 exialym

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
