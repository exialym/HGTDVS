let a = `
    <h4>简介</h4>
    <p>这是一个高维时空数据可视化系统，如果你的高维数据同时具有时间，空间信息，可以利用这个系统可视化你的数据。这个系统内置了数据降维模块，最大限度的利用三维空间展示高维数据间的关系，结合各个不同的视图，帮助你在数据中找到潜在的关系和模式。</p>
    <p>Demo数据是美国2000年-2016年的各地空气污染物组成（按年统计）。</p>
    <p>降维完成的数据文件Demo：<a target="_blank" href="https://github.com/exialym/HGTDVS/blob/master/pollution_data_withGPS_filled_combined_month_embedding.csv">美国2000年-2016年的各地空气污染物组成（按月统计）</a>，数据规模比较大，下载下来后点击choose embedding file按钮导入。</p>
    <h4>如何操作</h4>
    <p>
      系统由4个视图和1个工具边栏组成，地图视图显示数据的地理分布，三维视图显示数据降维的过程和结果，平行坐标视图显示数据在各个维度的分布，时间视图显示数据在时间上的分布。
    </p>
    <p>
      这4个视图是联动的，鼠标的选中，浮动，刷取等操作会在其他视图中看到对应的效果。选中的点的详细信息也会显示在边栏的表格中，表格是否可以展开在头部进行设置。
    </p>
    <p>
      工具栏可以配置降维算法的参数，以及在三维视图中选择一个点会找出他的几个邻居。点击begin开始降维的过程，降维算法使用t-SNE。
    </p>
    <p>如果你要可视化自己的数据，你可以在头部选择导入原始数据并在本系统中进行降维并观察降维的过程，也可以直接导入降维完成的数据。</p>
    <h4>原始数据需满足以下格式：</h4>
    <p>CSV格式文件，第一列是数据编号，第二列是GPS纬度，第三列是GPS经度，第四列是时间，剩余列是高维数据。高维数据应都是数值。</p>
    <h4>降维完成的数据需满足以下格式：</h4>
    <p>CSV格式文件，第一列是数据编号，第二列是GPS纬度，第三列是GPS经度，第四列是时间，第五-七列是降维到3维的数据，剩余列是原始高维数据。高维数据应都是数值。</p>
`;
export default a;