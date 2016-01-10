#!/usr/bin/env python3
import sys
import csv
import json
import io

if len(sys.argv) < 3:
    print("Usage: ./make_json.py in_file.csv out_file.json")
    sys.exit(0)
    pass

in_f = sys.argv[1]
out_f = sys.argv[2]

f = open(in_f)
rd = csv.DictReader(f)

data = {}
items = {}
years = list(range(1990,2015))

for ln in rd:
    if ln['oblast_code'] == '': ln['oblast_code'] = 'kg-oc'
    if ln['oblast_code'] not in data:
        data[ln['oblast_code']] = {'items':{}}
        data[ln['oblast_code']]['russian'] = ln['rus_oblast']
        data[ln['oblast_code']]['kyrgyz'] = ln['kyr_oblast']
        data[ln['oblast_code']]['english'] = ln['oblast']
    if ln['label'] not in data[ln['oblast_code']]['items']:
        data[ln['oblast_code']]['items'][ln['label']] = {}
    prod = data[ln['oblast_code']]['items'][ln['label']] = {}
    if ln['label'] not in items:
        items[ln['label']] = {}
        items[ln['label']]['russian'] = ln['rus_items']
        items[ln['label']]['kyrgyz'] = ln['kyr_items']
        items[ln['label']]['english'] = ln['items']
        items[ln['label']]['max'] = 0
    for i in years:
        try:
            num = float(ln[str(i)].strip())
        except:
            num = ''
            print("Failed to convert >"+ln[str(i)]+"< into a float")
            
        if num != '' and num > items[ln['label']]['max']:
            items[ln['label']]['max'] = num
        if str(i) in ln and num != '':
            prod[i] = num

output = {'years':years, 'data':data, 'crops':items}
        
with io.open(out_f,'w',encoding='utf8') as f:
    json.dump(output,f,ensure_ascii=False,indent=2)
