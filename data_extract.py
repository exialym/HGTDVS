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

import urllib
import urllib2
import csv
import json
reader = csv.reader(file('csv_test.csv', 'rb'))
csvfile = file('csv_test1.csv', 'wb')
writer = csv.writer(csvfile)
for line in reader:
    address = line[0]
    daddress = address.replace(",Not in a city","")
    daddress = urllib.quote(daddress)
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + daddress + "&key=AIzaSyBVXv_gprmOr40uPQTYSH0KpUhsN6sL95Y"
    req = urllib2.Request(url)
    print req
    res_data = urllib2.urlopen(req)
    res = res_data.read()
    print res
    obj = json.loads(res)
    if obj["status"] == "OK":
        writer.writerow([address, "OK", obj["results"][0]["geometry"]["location"]["lat"], obj["results"][0]["geometry"]["location"]["lng"]])
    else:
        writer.writerow([address, obj["status"],"",""])

csvfile.close()

# import urllib
# import urllib2
# import csv
# import json
# daddress = "Walden,Colorado,Jackson"
# daddress = urllib.quote(daddress)
# url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + daddress + "&key=AIzaSyBVXv_gprmOr40uPQTYSH0KpUhsN6sL95Y"
# req = urllib2.Request(url)
# print req
# res_data = urllib2.urlopen(req)
# res = res_data.read()
# print res
# obj = json.loads(res)
# if obj["status"] == "OK":
#     print(obj["results"][0]["geometry"]["location"]["lat"])
#     print(obj["results"][0]["geometry"]["location"]["lng"])
# else:
#     print(obj["status"])
