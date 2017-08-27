# coding:utf-8

# That's an impressive list of imports.
import numpy as np
import os

# We'll use matplotlib for graphics.
import matplotlib.pyplot as plt



import seaborn as sns
sns.set_style('darkgrid')
sns.set_palette('muted')
sns.set_context("notebook", font_scale=1.5,
                rc={"lines.linewidth": 2.5})

def scatter(x, colors):
    # We choose a color palette with seaborn.
    palette = np.array(sns.color_palette("hls", 4))

    # We create a scatter plot.
    f = plt.figure(figsize=(8, 8))
    ax = plt.subplot(aspect='equal')
    sc = ax.scatter(x[:,0], x[:,1], lw=0, s=40,
                    c=palette[colors.astype(np.int)])
    plt.xlim(-250, 250)
    plt.ylim(-250, 250)
    ax.axis('off')
    ax.axis('tight')

    # We add the labels for each digit.
    txts = []
    # for i in range(10):
    #     # Position of each label.
    #     xtext, ytext = np.median(x[colors == i, :], axis=0)
    #     txt = ax.text(xtext, ytext, str(i), fontsize=24)
    #     txt.set_path_effects([
    #         PathEffects.Stroke(linewidth=5, foreground="w"),
    #         PathEffects.Normal()])
    #     txts.append(txt)

    return f, ax, sc#, txts



type = 'wine'
if not (os.path.exists(type)):
    os.mkdir(type)
    os.mkdir(type+'/me')
    os.mkdir(type+'/original')
file_label = open('../../data/'+type+'/'+type+'_label.txt')
# list_of_all_the_lines = file_object.readlines()
labels = []

for line in file_label:
    #labels.append(ord(line.lstrip()[0])-81)
    labels.append(line.lstrip().replace('\n',''))
file_label.close()

for i in range(0,50):
    file_proj = open('../wine_withPCA_withRank_2_P20_50times_exp-avg-multip_+0.0/wine_F_2.0_withPCA__withRank_result_'+str(i)+'.txt')
    datas = []
    for line in file_proj:

        arr = line.replace('\n','').split(',')
        datas.append([float(arr[0]),float(arr[1])])

    file_proj.close()
#    print(labels)
#    print(datas)
    scatter(np.array(datas), np.array(labels))
    plt.savefig(type+'/me/'+ type+'_me_'+str(i)+'.png', dpi=120)
    #plt.savefig(type+'/original/'+type + '_'+str(i) + '.png', dpi=120)






