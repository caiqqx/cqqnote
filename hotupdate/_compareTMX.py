# -*- coding: utf-8 -*- 
import json
import os
import shutil
import md5
import sys
import string

rootPath = os.getcwd()
if os.path.exists("tmxMD5.json"):
    print("--------------------------------------------------");
else:
    f = open("tmxMD5.json", 'w')
    f.write("{}")
    f.close()
f = open("tmxMD5.json","r+");
str1 = "";
for i in f:
    str1 += i
print str1
md5json = json.loads(str1)

def sumfile(fobj):    
    m = md5.new()
    while True:
        d = fobj.read(8096*100)
        if not d:
            break
        m.update(d)
    return m.hexdigest()


def md5sum(fname):    
    if fname == '-':
        ret = sumfile(sys.stdin)
    else:
        try:
            f = file(fname, 'rb')
        except:
            return 'Failed to open file'
        ret = sumfile(f)
        f.close()
    return ret

def compareFiles(dir):
    listfile = os.listdir(rootPath+dir)
    dir = dir + '/'
    for name in listfile:
        if name == '.svn' :
            continue
        filename = dir+name
        if os.path.isdir(rootPath + filename):
            compareFiles(filename)
        elif filename.split(".")[1] == "tmx":
            compareFile(filename)
            
def compareFile (filename):
    m = md5sum(rootPath + filename)
    if filename[1:] in md5json and m == md5json[filename[1:]]:
       return
    else:
       md5json[filename[1:]] = m

compareFiles("/res")
_json = json.dumps(md5json,sort_keys=False,indent=4)
f.seek(0)
f.truncate()
f.write(_json)
f.close()
raw_input("...........")
