/**
 * Created by test on 2014/11/4.
 */

var fs = require('fs');
var Path = require('path');

var extnames = {
  plist:true,
  png:true,
  xml:true,
  jpg:true,
  tmx:true,
  json:true,
  fnt:true,
  ttf:true
};

function assert(con, errmsg) {
  console.assert(con, errmsg);
}

var tmpFile = 'src/resource.js.tmp';
var realFile = 'src/resource.js';

function writeFile() {
  for (var key in arguments) {
    require('fs').appendFileSync(tmpFile, arguments[key]);
  }
  //console.log.apply(null, arguments);
}
try {
  fs.truncateSync(tmpFile);
} catch (err) {
  //console.log(err);
}

var getResPath = function (rootPath, paths, plists) {
  var readFile = fs.readdirSync(rootPath);
  var path = rootPath + '/';
  for (var key in readFile) {
    var fileName = readFile[key];
    var filePath = path + fileName;
    var state = fs.lstatSync(filePath);
    if (state.isDirectory()) {
      getResPath(filePath, paths, plists);
    } else {
      var ext = Path.extname(fileName).substr(1);
      if (ext === 'plist') {
        plists.push(filePath);
      }
      if (extnames[ext]) {
        paths.push(filePath);
      }
    }
  }
};

//生成音乐路径
var isMp3 = function (fileName) {
  return Path.extname(fileName).substr(1) == 'mp3';
};

var mainFileName = function (fileName) {
  if(fileName){
    var idx = fileName.lastIndexOf(".");
    if(idx !== -1)
      return fileName.substring(0,idx);
  }
  return fileName;
};

var genMusicPath = function () {
  var musicPath = 'res/music/';
  var readFile = fs.readdirSync(musicPath);
  var paths = {};
  for (var key in readFile) {
    var fileName = readFile[key];
    var filePath = musicPath + fileName;
    var state = fs.lstatSync(filePath);
    if (state.isDirectory()) {
      var readFile1 = fs.readdirSync(filePath);
      paths[fileName + 'Names'] = [];
      for (var key1 in readFile1) {
        var fileName1 = readFile1[key1];
        var filePath1 = filePath + '/' + fileName1;
        if (isMp3(fileName1)) {
          paths[fileName + '_' + mainFileName(fileName1)] = filePath1;
          paths[fileName + 'Names'].push(mainFileName(fileName1));
        }
      }
    } else {
      if (isMp3(fileName)) {
        paths[mainFileName(fileName)] = filePath;
      }
    }
  }

  return paths;
};

var res = [];
var plists = [];
getResPath('res', res, plists);

/*writeFile('var res = {\n');
writeFile('    HelloWorld_png : \"res/HelloWorld.png\",\n');
writeFile('    CloseNormal_png : \"res/CloseNormal.png\",\n');
writeFile('    CloseSelected_png : \"res/CloseSelected.png\"\n');
writeFile('};\n');*/
writeFile('var g_resources = ', JSON.stringify(res, null, '\n    '), ';\n');
//writeFile('var g_musicPaths = ', JSON.stringify(genMusicPath(), null, '\n    '), ';\n');
fs.rename(tmpFile, realFile);

var xml2js = require('xml2js');
var fs = require('fs');

var builder = new xml2js.Builder();  // JSON->xml
var parser = xml2js.Parser();   //xml -> json

var getPngName = function (prefix, fileName, pngName) {
  var xml = fs.readFileSync(fileName, 'utf8');
  var hasAdd = false;
  parser.parseString(xml, function (err, result) {
    if (!result) {
      console.log('错误:', err, fileName);
      throw err;
      return;
    }
    if (!result.plist.dict[0].dict) {
      return;
    }
    var key = result.plist.dict[0].dict[0].key;
    for (var i in key) {
      var v = key[i];
      if (v.indexOf(prefix) >= 0) {
        //说明已加了前缀
        console.log('file name :', fileName, 'has add');
        hasAdd = true;
        return;
      }
      if (v.indexOf('.png.png') >= 0) {
        console.log('找到异常plist', v, fileName);
      }
      pngName['<key>' + key[i]] = '<key>' + prefix + key[i].replace('.png.png', '.png');
    }
  });

  return hasAdd;
};

var trans = function (fileName, pngName) {
  var xml = fs.readFileSync(fileName, 'utf8');
  for (var key in pngName) {
    var v = pngName[key];
    xml = xml.replace(key, v);
  }

  fs.writeFileSync(fileName, xml);
};

var transXml = function (prefix, fileName) {
  console.log('transXml', fileName);
  var xml = fs.readFileSync(fileName, 'utf8');
  parser.parseString(xml, function (err, result) {
    var key = result.skeleton.TextureAtlas[0].SubTexture;

    for (var i in key) {
      var v = key[i];
      v['$'].name = prefix + v['$'].name;
    }

    for (var j in result.skeleton.armatures[0].armature) {
      var key1 = result.skeleton.armatures[0].armature[j].b;
      for (var i in key1) {
        for (var k in key1[i].d) {
          var v = key1[i].d[k]['$'];
          if (v.pX != undefined && v.pY != undefined) {
            v.name = prefix + v.name;
          }
        }
      }
    }

    fs.writeFileSync(fileName, builder.buildObject(result));
  });
};

for (var i in plists) {
  var name = plists[i];
  var dirname = Path.dirname(name);
  var names = dirname.split('/');
  var basename = Path.basename(name);
  basename = basename.substr(0, basename.length - 6);
  names.push(basename);
  var prefix = names[names.length - 1] + '__';
  var pngName = {};
  var hasAdd = getPngName(prefix, name, pngName);
  if (!hasAdd) {
    trans(name, pngName);
    var xmlName = names.join('/') + '.xml';
    if (fs.existsSync(xmlName)) {
      transXml(prefix, xmlName);
    }
  }
}

function travelJsList(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = Path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      travelJsList(pathname, callback);
    } else {
      var sit =pathname.indexOf('.svn');
      if(sit === -1){
        callback(pathname);
      }
    }
  });
}


//检查jsList文件
var project = require('./project');
var tmp = {};
var allFName =[];
function checkJsList(){
  travelJsList('src', function (pathname) {
	var ary =pathname.split('\\');
	allFName.push(ary[ary.length - 1]);

  });
  console.log('--------start check jsList----------');
  for (var i in project.jsList) {
	var name = project.jsList[i];
	if (tmp[name]) {
		console.log('js filename has exist:' + name);
	}
	tmp[name] = true;
	var nary =name.split('/');
	var realName =nary[nary.length - 1];
	var index =allFName.indexOf(realName);
	if(index == -1){
		console.log('js filename not exist:' + name);
	}else{
		allFName.splice(index, 1);
	}
  }
  console.log('--------check over----------');
  if(allFName.length > 0){
	  var noFile ="";
	  for(var f in allFName){
		noFile += (" "+allFName[f]);
	  }
	  console.log('has some file not add:' + noFile);
  }
}
checkJsList();