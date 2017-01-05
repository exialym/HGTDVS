# coding:utf-8

# That's an impressive list of imports.
import numpy as np
from numpy import linalg
from numpy.linalg import norm
from scipy.spatial.distance import squareform, pdist

# We import sklearn.
import sklearn
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits
from sklearn.preprocessing import scale

# We'll hack a bit with the t-SNE code in sklearn 0.15.2.
from sklearn.metrics.pairwise import pairwise_distances
from sklearn.manifold.t_sne import (_joint_probabilities,
                                    _kl_divergence)
from sklearn.utils.extmath import _ravel
# Random state.
RS = 20150101

# We'll use matplotlib for graphics.
import matplotlib.pyplot as plt
import matplotlib.patheffects as PathEffects
import matplotlib
# %matplotlib inline

# We import seaborn to make nice plots.
import seaborn as sns
sns.set_style('darkgrid')
sns.set_palette('muted')
sns.set_context("notebook", font_scale=1.5,
                rc={"lines.linewidth": 2.5})

# We'll generate an animation with matplotlib and moviepy.
from moviepy.video.io.bindings import mplfig_to_npimage
import moviepy.editor as mpy

# 手写数据集
digits = load_digits()

# 使用SKLearn库的TSNE算法
# # We first reorder the data points according to the handwritten numbers.
# X = np.vstack([digits.data[digits.target==i]
#                for i in range(10)])
# y = np.hstack([digits.target[digits.target==i]
#                for i in range(10)])

# digits_proj = TSNE(n_components=2,random_state=RS).fit_transform(X)
# print(digits_proj)
#
#
# def scatter(x, colors):
#     # We choose a color palette with seaborn.
#     palette = np.array(sns.color_palette("hls", 10))
#
#     # We create a scatter plot.
#     f = plt.figure(figsize=(8, 8))
#     ax = plt.subplot(aspect='equal')
#     sc = ax.scatter(x[:,0], x[:,1], lw=0, s=40,
#                     c=palette[colors.astype(np.int)])
#     plt.xlim(-25, 25)
#     plt.ylim(-25, 25)
#     ax.axis('off')
#     ax.axis('tight')
#
#     # We add the labels for each digit.
#     txts = []
#     for i in range(10):
#         # Position of each label.
#         xtext, ytext = np.median(x[colors == i, :], axis=0)
#         txt = ax.text(xtext, ytext, str(i), fontsize=24)
#         txt.set_path_effects([
#             PathEffects.Stroke(linewidth=5, foreground="w"),
#             PathEffects.Normal()])
#         txts.append(txt)
#
#     return f, ax, sc, txts
#
# scatter(digits_proj, y)
# plt.savefig('digits_tsne-generated.png', dpi=120)

# 我们自己来走一遍这个过程

# We first reorder the data points according to the handwritten numbers.
# 将图像数据按照0 - 9的顺序重新堆叠为二维数组
X = np.vstack([digits.data[digits.target == i]
               for i in range(10)])
print(X.shape)
# 将图像的标签按照从0至1排序为一维数组，这样下来，X和y还是一一对应的
y = np.hstack([digits.target[digits.target == i]
               for i in range(10)])

# 计算所有数据点在高维空间中的两两距离
D = pairwise_distances(X, squared=True)
print(D.shape)


# 使用高斯分布将距离映射为条件概率，这里使用常数方差
def _joint_probabilities_constant_sigma(D, sigma):
    P = np.exp(-D**2/2 * sigma**2)
    P /= np.sum(P, axis=1)
    return P
P_constant = _joint_probabilities_constant_sigma(D, .002)
print(P_constant.shape)
print(P_constant)

# 实际上根据对于不同的点，方差的选择是不同的，密集地方的点的方差较小
# SKLearn里内置的方法就是这样做的，不过它返回的是一个一维的数组，需要转为方阵
P_binary = _joint_probabilities(D, 30., False)
P_binary_s = squareform(P_binary)
print("binary")
print(P_binary_s.shape)
print(P_binary_s)

# 绘制出距离矩阵，映射的两个概率矩阵
plt.figure(figsize=(12, 4))
pal = sns.light_palette("blue", as_cmap=True)

plt.subplot(131)
plt.imshow(D[::10, ::10], interpolation='none', cmap=pal)
plt.axis('off')
plt.title("Distance matrix", fontdict={'fontsize': 16})

plt.subplot(132)
plt.imshow(P_constant[::10, ::10], interpolation='none', cmap=pal)
plt.axis('off')
plt.title("$p_{j|i}$ (constant $\sigma$)", fontdict={'fontsize': 16})

plt.subplot(133)
plt.imshow(P_binary_s[::10, ::10], interpolation='none', cmap=pal)
plt.axis('off')
plt.title("$p_{j|i}$ (variable $\sigma$)", fontdict={'fontsize': 16})
plt.savefig('similarity-generated.png', dpi=120)


