# coding:utf-8


"""
读出元数据中所有地址
"""
# import csv
# reader = csv.reader(file('E:/uspollution/pollution_us_2000_2016.csv', 'rb'))
# adddict = {}
# for line in reader:
#     add = line[4] + "," + line[5] + "," + line[6] + "," + line[7]
#     if add in adddict:
#         adddict[add] += 1
#     else:
#         adddict[add] = 1
# print(adddict)
#
# csvfile = file('csv_test.csv', 'wb')
# writer = csv.writer(csvfile)
# for key in adddict:
#     writer.writerow([key, "NO"])
# csvfile.close()

"""
使用google解析地址
"""

# import urllib
# import urllib2
# import csv
# import json
# reader = csv.reader(file('csv_test.csv', 'rb'))
# csvfile = file('csv_test1.csv', 'wb')
# writer = csv.writer(csvfile)
# for line in reader:
#     address = line[0]
#     daddress = address.replace(",Not in a city","")
#     daddress = urllib.quote(daddress)
#     url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + daddress + "&key=AIzaSyBVXv_gprmOr40uPQTYSH0KpUhsN6sL95Y"
#     req = urllib2.Request(url)
#     print req
#     res_data = urllib2.urlopen(req)
#     res = res_data.read()
#     print res
#     obj = json.loads(res)
#     if obj["status"] == "OK":
#         writer.writerow([address, "OK", obj["results"][0]["geometry"]["location"]["lat"], obj["results"][0]["geometry"]["location"]["lng"]])
#     else:
#         writer.writerow([address, obj["status"],"",""])
#
# csvfile.close()

"""
处理数据，地址转为坐标，不用的列去除
"""
# import csv
# addressReader = csv.reader(file('E:/Git/HGTDVS/csv_test1.csv', 'rb'))
# adddict = {}
# for line in addressReader:
#     adddict[line[0]] = [line[2], line[3]]
# #print(adddict)
#
# reader = csv.reader(file('E:/uspollution/pollution_us_2000_2016.csv', 'rb'))
# csvfile = file('pollution_data.csv', 'wb')
# writer = csv.writer(csvfile)
# for line in reader:
#     if line[0] == "":
#         writer.writerow(["No.", "lat", "lng", line[8], line[10], line[11], line[12], line[13],
#                          line[15], line[16], line[17], line[18],
#                          line[20], line[21], line[22], line[23],
#                          line[25], line[26], line[27], line[28]])
#     else:
#         add = line[4] + "," + line[5] + "," + line[6] + "," + line[7]
#         lat = adddict[add][0]
#         lng = adddict[add][1]
#         writer.writerow([line[0], lat, lng, line[8], line[10], line[11], line[12], line[13],
#                          line[15], line[16], line[17], line[18],
#                          line[20], line[21], line[22], line[23],
#                          line[25], line[26], line[27], line[28]])
# csvfile.close()

"""
处理数据，地址转为坐标，不用的列去除
"""
# import csv
# reader = csv.reader(file('E:/Git/HGTDVS/pollution_data.csv', 'rb'))
# csvfile = file('pollution_data_raw.csv', 'wb')
# writer = csv.writer(csvfile)
# co2 = ""
# so2 = ""
# for line in reader:
#     if line[0] != "No.":
#         if line[15] == "":
#             line[15] = so2
#         else:
#             so2 = line[15]
#         if line[19] == "":
#             line[19] = co2
#         else:
#             co2 = line[19]
#         if line[0] != "":
#             writer.writerow([line[4], line[5], line[6], line[7], line[8],
#                              line[9], line[10], line[11], line[12],
#                              line[13], line[14], line[15], line[16],
#                              line[17], line[18], line[19]])
# csvfile.close()

"""
数据太多，筛选
"""
import csv
reader = csv.reader(file('E:/Git/HGTDVS/pollution_data.csv', 'rb'))
csvfile = file('pollution_data_raw_small.csv', 'wb')
writer = csv.writer(csvfile)
flag = 0
for line in reader:
    if (flag % 3) == 0:
        writer.writerow([line[0], line[1], line[2], line[3],line[4], line[5], line[6], line[7], line[8],
                         line[9], line[10], line[11], line[12],
                         line[13], line[14], line[15]])
    flag++
csvfile.close()
