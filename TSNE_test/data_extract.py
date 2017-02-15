# coding:utf-8

from sklearn.datasets import load_digits

"""
手写数据集
"""
digits = load_digits()
strings = []
print(len(digits.data))
# for index, item in enumerate(digits.data):
#     temp = "["
#     for ind,numbers in enumerate(item):
#         temp += str(numbers)
#         if ind!=len(item)-1:
#             temp += ','
#     if index != len(digits.data) - 1:
#         temp += '],'
#     else:
#         temp+=']'
#     strings.append(temp)
for index, item in enumerate(digits.data):
    temp = ""
    for ind,numbers in enumerate(item):
        temp += str(numbers)
        if ind!=len(item)-1:
            temp += ','
    temp+='\n'
    strings.append(temp)
file_object = file('mnist_data.txt','w')
file_object.writelines(strings)
file_object.close( )

