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
处理数据，补全数据
"""
# import csv
# reader = csv.reader(file('E:/uspollution/pollution_data.csv', 'rb'))
# csvfile = file('pollution_data_filled.csv', 'wb')
# writer = csv.writer(csvfile)
# co2 = ""
# so2 = ""
# for line in reader:
#         if line[15] == "":
#             line[15] = so2
#         else:
#             so2 = line[15]
#         if line[19] == "":
#             line[19] = co2
#         else:
#             co2 = line[19]
#         writer.writerow([line[0], line[1], line[2], line[3], line[4], line[5], line[6],
#                          line[7], line[8], line[9], line[10], line[11], line[12], line[13],
#                          line[14], line[15], line[16], line[17], line[18], line[19]])
# csvfile.close()

"""
数据筛选，每月or日的同一地点数据合并  
"""
# import csv
# reader = csv.reader(file('/Users/exialym/Desktop/uspollution/pollution_data_withGPS_filled.csv', 'rb'))
# csvfile = file('pollution_data_withGPS_filled_combined_day.csv', 'wb')
# writer = csv.writer(csvfile)
# record = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
# count = 1
#
#
# def s2f(x):
#     return float(x)
#
#
# for lineS in reader:
#     if lineS[0] == "No.":
#         writer.writerow(lineS)
#         continue
#     line = [lineS[0], lineS[1], lineS[2], lineS[3], float(lineS[4]), float(lineS[5]),
#             float(lineS[6]), float(lineS[7]), float(lineS[8]), float(lineS[9]), float(lineS[10]), float(lineS[11]),
#             float(lineS[12]), float(lineS[13]), float(lineS[14]), float(lineS[15]), float(lineS[16]), float(lineS[17]),
#             float(lineS[18]), float(lineS[19])]
#
#     #if (line[1] != record[1]) or (line[2] != record[2]) or (line[3][0:7] != record[3][0:7]):
#     if (line[1] != record[1]) or (line[2] != record[2]) or (line[3] != record[3]):
#         writer.writerow([record[0], record[1], record[2], record[3], record[4]/count, record[5]/count,
#                          record[6]/count, record[7]/count, record[8]/count, record[9]/count, record[10]/count,
#                          record[11]/count, record[12]/count, record[13]/count, record[14]/count, record[15]/count,
#                          record[16]/count, record[17]/count, record[18]/count, record[19]/count])
#         record = line
#         count = 1
#     else:
#         record[4] += line[4]
#         record[5] += line[5]
#         record[6] += line[6]
#         record[7] += line[7]
#         record[8] += line[8]
#         record[9] += line[9]
#         record[11] += line[11]
#         record[12] += line[12]
#         record[13] += line[13]
#         record[14] += line[14]
#         record[15] += line[15]
#         record[16] += line[16]
#         record[17] += line[17]
#         record[18] += line[18]
#         record[19] += line[19]
#         count += 1
#
# writer.writerow([record[0], record[1], record[2], record[3], record[4]/count, record[5]/count,
#                  record[6]/count, record[7]/count, record[8]/count, record[9]/count, record[10]/count,
#                  record[11]/count, record[12]/count, record[13]/count, record[14]/count, record[15]/count,
#                  record[16]/count, record[17]/count, record[18]/count, record[19]/count])
# csvfile.close()

"""
取出不带日期和坐标的数据
"""
import csv
reader = csv.reader(file('pollution_data_withGPS_filled_combined_day.csv', 'rb'))
csvfile = file('pollution_data_withGPS_filled_combined_day_raw.csv', 'wb')
writer = csv.writer(csvfile)
for line in reader:
    if line[0] != "No.":
        writer.writerow([line[4], line[5], line[6],
                         line[7], line[8], line[9], line[10], line[11], line[12], line[13],
                         line[14], line[15], line[16], line[17], line[18], line[19]])
csvfile.close()

"""
取出2000年的所有数据
"""
# import csv
# reader = csv.reader(file('E:/uspollution/pollution_data_withGPS_filled_selected_raw.csv', 'rb'))
# csvfile = file('pollution_data_withGPS_filled_selected_raw_AD2000.csv', 'wb')
# writer = csv.writer(csvfile)
# count = 1
# for line in reader:
#     writer.writerow(line)
#     count += 1
#     if count > 22797:
#         break
# csvfile.close()

