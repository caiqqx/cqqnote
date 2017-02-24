# -*- coding: utf-8 -*- 
import json
import os
import shutil
import md5
import sys
import string

rootPath = os.getcwd()
if os.path.exists("srcMD5.json"):
    print("--------------------------------------------------");
else:
    f = open("srcMD5.json", 'w')
    f.write("{}")
    f.close()
f = open("srcMD5.json","r+");
str1 = "";
for i in f:
    str1 += i
print str1
md5json = json.loads(str1)
filelist = [];
scriptlist = [];
def sumfile(fobj):    
    m = md5.new()
    while True:
        d = fobj.read(8096)
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
print type(md5json)
def compareFiles(dir,files):
    listfile = os.listdir(rootPath+dir)
    dir = dir + '/'
    for name in listfile:
        if name == '.svn':
            continue
        filename = dir+name       
        if os.path.isdir(rootPath + filename):
            compareFiles(filename,files)
        else:
            compareFile(filename,files)
            
def compareFile (filename,files):
    m = md5sum(rootPath + filename)
    if filename[1:] in md5json and m == md5json[filename[1:]]:
       return
    else:
       files.append(filename[1:])
       md5json[filename[1:]] = m
                
def copyFileToTemp (files,name = ""):
    for fl in files:
        #print fl
        if fl == "main.js" or fl == "project.json":
            shutil.copy(rootPath+"/"+fl,rootPath+"/_temp/")
            continue
        pa = rootPath+"/_temp/"+fl[:fl.rindex("/")]
        if name != "":            
            pa = string.replace(pa,name,"",1)
            print pa
        if not os.path.exists(pa):
            os.makedirs(pa)      
        shutil.copy(rootPath+"/"+fl,pa+"/")

compareFile("/main.js",filelist)
compareFile("/project.json",filelist)
compareFiles("/src",filelist)
compareFiles("/pomelo-cocos2d-jsb",filelist)
compareFiles("/frameworks/cocos2d-x/cocos/scripting/js-bindings/script",scriptlist)
copyFileToTemp(filelist)
copyFileToTemp(scriptlist,"/cocos2d-x/cocos/scripting/js-bindings/script")
_json = json.dumps(md5json,sort_keys=False,indent=4)
f.seek(0)
f.truncate()
f.write(_json)
f.close()
