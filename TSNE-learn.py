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

"""
手写数据集
"""
digits = load_digits()

"""
处理手写数据集
"""
# We first reorder the data points according to the handwritten numbers.
# 将图像数据按照0 - 9的顺序重新堆叠为二维数组
X = np.vstack([digits.data[digits.target == i]
               for i in range(10)])
print(X.shape)
# 将图像的标签按照从0至1排序为一维数组，这样下来，X和y还是一一对应的
y = np.hstack([digits.target[digits.target == i]
               for i in range(10)])

"""
使用SKLearn库的TSNE算法对数据集进行降维并可视化
"""
# digits_proj = TSNE(n_components=2,random_state=RS).fit_transform(X)
# print(digits_proj)
#
#
def scatter(x, colors):
    # We choose a color palette with seaborn.
    palette = np.array(sns.color_palette("hls", 10))

    # We create a scatter plot.
    f = plt.figure(figsize=(8, 8))
    ax = plt.subplot(aspect='equal')
    sc = ax.scatter(x[:,0], x[:,1], lw=0, s=40,
                    c=palette[colors.astype(np.int)])
    plt.xlim(-25, 25)
    plt.ylim(-25, 25)
    ax.axis('off')
    ax.axis('tight')

    # We add the labels for each digit.
    txts = []
    for i in range(10):
        # Position of each label.
        xtext, ytext = np.median(x[colors == i, :], axis=0)
        txt = ax.text(xtext, ytext, str(i), fontsize=24)
        txt.set_path_effects([
            PathEffects.Stroke(linewidth=5, foreground="w"),
            PathEffects.Normal()])
        txts.append(txt)

    return f, ax, sc, txts
#
# scatter(digits_proj, y)
# plt.savefig('digits_tsne-generated.png', dpi=120)

"""
将高维中的数据点间的距离映射为概率并绘图
"""
# # 计算所有数据点在高维空间中的两两距离
# D = pairwise_distances(X, squared=True)
# print(D.shape)
#
#
# # 使用高斯分布将距离映射为条件概率，这里使用常数方差
# def _joint_probabilities_constant_sigma(D, sigma):
#     P = np.exp(-D**2/2 * sigma**2)
#     P /= np.sum(P, axis=1)
#     return P
# P_constant = _joint_probabilities_constant_sigma(D, .002)
# print(P_constant.shape)
# print(P_constant)
#
# # 实际上根据对于不同的点，方差的选择是不同的，密集地方的点的方差较小
# # SKLearn里内置的方法就是这样做的，不过它返回的是一个一维的数组，需要转为方阵
# P_binary = _joint_probabilities(D, 30., False)
# P_binary_s = squareform(P_binary)
# print("binary")
# print(P_binary_s.shape)
# print(P_binary_s)
#
# # 绘制出距离矩阵，映射的两个概率矩阵
# plt.figure(figsize=(12, 4))
# pal = sns.light_palette("blue", as_cmap=True)
#
# plt.subplot(131)
# plt.imshow(D[::10, ::10], interpolation='none', cmap=pal)
# plt.axis('off')
# plt.title("Distance matrix", fontdict={'fontsize': 16})
#
# plt.subplot(132)
# plt.imshow(P_constant[::10, ::10], interpolation='none', cmap=pal)
# plt.axis('off')
# plt.title("$p_{j|i}$ (constant $\sigma$)", fontdict={'fontsize': 16})
#
# plt.subplot(133)
# plt.imshow(P_binary_s[::10, ::10], interpolation='none', cmap=pal)
# plt.axis('off')
# plt.title("$p_{j|i}$ (variable $\sigma$)", fontdict={'fontsize': 16})
# plt.savefig('similarity-generated.png', dpi=120)


"""
hack SKLearn里的梯度下降算法，
记录下梯度下降的每一步，绘制动画
"""
# 将每一步计算后所有点的坐标保存在这个数组里
positions = []


# This list will contain the positions of the map points at every iteration.
def _gradient_descent(objective, p0, it, n_iter, objective_error=None,
                      n_iter_check=1, n_iter_without_progress=50,
                      momentum=0.5, learning_rate=1000.0, min_gain=0.01,
                      min_grad_norm=1e-7, min_error_diff=1e-7, verbose=0,
                      args=None, kwargs=None):
    """Batch gradient descent with momentum and individual gains.
    Parameters
    ----------
    objective : function or callable
        Should return a tuple of cost and gradient for a given parameter
        vector. When expensive to compute, the cost can optionally
        be None and can be computed every n_iter_check steps using
        the objective_error function.
    p0 : array-like, shape (n_params,)
        Initial parameter vector.
    it : int
        Current number of iterations (this function will be called more than
        once during the optimization).
    n_iter : int
        Maximum number of gradient descent iterations.
    n_iter_check : int
        Number of iterations before evaluating the global error. If the error
        is sufficiently low, we abort the optimization.
    objective_error : function or callable
        Should return a tuple of cost and gradient for a given parameter
        vector.
    n_iter_without_progress : int, optional (default: 30)
        Maximum number of iterations without progress before we abort the
        optimization.
    momentum : float, within (0.0, 1.0), optional (default: 0.5)
        The momentum generates a weight for previous gradients that decays
        exponentially.
    learning_rate : float, optional (default: 1000.0)
        The learning rate should be extremely high for t-SNE! Values in the
        range [100.0, 1000.0] are common.
    min_gain : float, optional (default: 0.01)
        Minimum individual gain for each parameter.
    min_grad_norm : float, optional (default: 1e-7)
        If the gradient norm is below this threshold, the optimization will
        be aborted.
    min_error_diff : float, optional (default: 1e-7)
        If the absolute difference of two successive cost function values
        is below this threshold, the optimization will be aborted.
    verbose : int, optional (default: 0)
        Verbosity level.
    args : sequence
        Arguments to pass to objective function.
    kwargs : dict
        Keyword arguments to pass to objective function.
    Returns
    -------
    p : array, shape (n_params,)
        Optimum parameters.
    error : float
        Optimum.
    i : int
        Last iteration.
    """
    if args is None:
        args = []
    if kwargs is None:
        kwargs = {}

    p = p0.copy().ravel()
    update = np.zeros_like(p)
    gains = np.ones_like(p)
    error = np.finfo(np.float).max
    best_error = np.finfo(np.float).max
    best_iter = 0

    for i in range(it, n_iter):
        # We save the current position.
        positions.append(p.copy())
        new_error, grad = objective(p, *args, **kwargs)
        grad_norm = linalg.norm(grad)

        inc = update * grad >= 0.0
        dec = np.invert(inc)
        gains[inc] += 0.05
        gains[dec] *= 0.95
        np.clip(gains, min_gain, np.inf)
        grad *= gains
        update = momentum * update - learning_rate * grad
        p += update

        if (i + 1) % n_iter_check == 0:
            if new_error is None:
                new_error = objective_error(p, *args)
            error_diff = np.abs(new_error - error)
            error = new_error

            if verbose >= 2:
                m = "[t-SNE] Iteration %d: error = %.7f, gradient norm = %.7f"
                print(m % (i + 1, error, grad_norm))

            if error < best_error:
                best_error = error
                best_iter = i
            elif i - best_iter > n_iter_without_progress:
                if verbose >= 2:
                    print("[t-SNE] Iteration %d: did not make any progress "
                          "during the last %d episodes. Finished."
                          % (i + 1, n_iter_without_progress))
                break
            if grad_norm <= min_grad_norm:
                if verbose >= 2:
                    print("[t-SNE] Iteration %d: gradient norm %f. Finished."
                          % (i + 1, grad_norm))
                break
            if error_diff <= min_error_diff:
                if verbose >= 2:
                    m = "[t-SNE] Iteration %d: error difference %f. Finished."
                    print(m % (i + 1, error_diff))
                break

        if new_error is not None:
            error = new_error

    return p, error, i
sklearn.manifold.t_sne._gradient_descent = _gradient_descent
# 再运行TSNE算法
# 这里是最后的结果
X_proj = TSNE(random_state=RS).fit_transform(X)
# 这里是每一步的结果，position是一个二维数组，梯度下降的每一步是一个一维数组，存着当前步中所有点的坐标
# 我们把它变为一个三维数组，第一维是每一步，第二维是每一步中所有的点，第三维是每个点的坐标
X_iter = np.dstack(position.reshape(-1, 2)
                   for position in positions)
print(X_iter)
print(X_iter.shape)

# 将每一步的结果渲染为视频
f, ax, sc, txts = scatter(X_iter[..., -1], y)


def make_frame_mpl(t):
    i = int(t*40)
    x = X_iter[..., i]
    sc.set_offsets(x)
    for j, txt in zip(range(10), txts):
        xtext, ytext = np.median(x[y == j, :], axis=0)
        txt.set_x(xtext)
        txt.set_y(ytext)
    return mplfig_to_npimage(f)

animation = mpy.VideoClip(make_frame_mpl,
                          duration=X_iter.shape[2]/40.)
animation.write_videofile("TSNE_step.mp4", fps=25, codec="mpeg4", audio=False)

