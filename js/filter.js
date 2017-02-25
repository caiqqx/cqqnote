/**
 * Created by cqq on 2016/3/15.
 */
var SX__jin = {
    "none": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],//无变色
    "stone": [0.299, 0.587, 0.184, 0, 0.299, 0.587, 0.184, 0, 0.299, 0.587, 0.184, 0, 0, 0, 0, 1],//石化 、黑白化
    "stone2": [0.299, 0.587, 0.184, 0, 0.299, 0.587, 0.184, 0, 0.299, 0.587, 0.184, 0, 0, 0, 0, 1],//石化 、黑白化
    "burn": [1.0, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0.6, 0, 1, 0, 0, 1],// 灼伤
    "poisoning": [0.6, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0.6, 0, 0, 1.0, 0, 1.0],//中毒
    "decelerate": [0.6, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 1.0, 0, 0, 0, 1.0, 1.0],//冰冻、减速
    "laozhaopian": [0.299, 0.587, 0.184, 0.3137, 0.299, 0.587, 0.184, 0.1686, 0.299, 0.587, 0.184, -0.0901, 0, 0, 0, 1.0],//老照片
    "select0": [1.0, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0.6, 0, 1, 0, 0, 1],
    "select1": [0.6, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0.6, 0, 0, 1.0, 0, 1.0],
    "red": [1, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1],
    "skill_black": [0.22, 0, 0, 0, 0, 0.22, 0, 0, 0, 0, 0.22, 0, 0, 0, 0, 1],
    "clone_blue": [0.4, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], //分身的蓝颜色
    "halt_transparent": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0.35], //半透明
    "white": "white", //白
    "blood": [1, 1, 1, 0.5, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], //吸血
    "endless":[0.46, 0, 0, 0, 0, 0.7, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]//无尽模式变色
};
var Filter = {
    SHADER_POSITION_GRAY_FRAG3 : ");\n" +
    "    gl_FragColor = v_orColor * vs;\n" +
    "}\n",

    SHADER_POSITION_GRAY_FRAG2 :
    "varying vec4 v_fragmentColor;\n" +
    "varying vec2 v_texCoord;\n" +
    (!cc.sys.isNative && cc.ENGINE_VERSION === "Cocos2d-JS v3.0 Final" ? "uniform sampler2D CC_Texture0;\n" : "") +
    "void main()\n" +
    "{\n" +
    "    vec4 v_orColor = texture2D(CC_Texture0, v_texCoord) * v_fragmentColor;\n" +
    "    mat4 vs = mat4(",

    SHADER_POSITION_GRAY_FRAG1 :
    "varying vec4 v_fragmentColor;\n" +
    "varying vec2 v_texCoord;\n" +
    (!cc.sys.isNative && cc.ENGINE_VERSION === "Cocos2d-JS v3.0 Final" ? "uniform sampler2D CC_Texture0;\n" : "") +
    "void main()\n" +
    "{\n" +
    "    vec4 v_orColor = texture2D(CC_Texture0, v_texCoord) * v_fragmentColor;\n" +
    "    v_orColor.rgb = vec3(1.0*v_orColor.a,1.0*v_orColor.a,1.0*v_orColor.a);\n" +
    "        gl_FragColor = v_orColor;\n" +
    "}\n",

    SHADER_POSITION_GRAY_VERT1 :
    "attribute vec4 a_position;\n" +
    "attribute vec2 a_texCoord;\n" +
    "attribute vec4 a_color;\n" +
    "\n" +
    "varying vec4 v_fragmentColor;\n" +
    "varying vec2 v_texCoord;\n" +
    "\n" +
    "void main()\n" +
    "{\n" +
    //"gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;\n" +
    "gl_Position = " + (!cc.sys.isNative ? "(CC_PMatrix * CC_MVMatrix)" : "CC_PMatrix") + " * a_position;\n" +
    "v_fragmentColor = a_color;\n" +
    "v_texCoord = a_texCoord;\n" +
    "}",

    SHADER_POSITION_GRAY_VERT2 :
    "attribute vec4 a_position;\n" +
    "attribute vec2 a_texCoord;\n" +
    "attribute vec4 a_color;\n" +
    "\n" +
    "varying vec4 v_fragmentColor;\n" +
    "varying vec2 v_texCoord;\n" +
    "\n" +
    "void main()\n" +
    "{\n" +
    "gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;\n" +
    "v_fragmentColor = a_color;\n" +
    "v_texCoord = a_texCoord;\n" +
    "}",

    setShader: function (armetrue, name, forced) {
        //变色的函数 传进 cc.Node子类 和 变色矩阵 mat4
        forced = true;
        if (_.isArray(name)) {
            if (name[0] == 'none') {
                name = name[1];
            } else if (name[1] == 'none') {
                name = name[0];
            } else {
                var newName = name[0] + name[1];
                if (!SX__jin[newName]) {
                    newName = name[1] + name[0];
                }
                name = newName;
            }
        }

        if (armetrue.__setShaderName__ == name && !forced) {
            return;
        }
        if (!armetrue.__setShaderName__ && name == 'none' && !forced) {
            return;
        }
        armetrue.__setShaderName__ = name;

        var color = SX__jin[name];
        //是否用到 默认的全变色
        if (color && armetrue && !(armetrue instanceof ccs.Armature) && !(armetrue instanceof ccs.Bone)) {
            Filter.setNodeShader(armetrue, color, name, forced);
        } else if (color && armetrue) {
            Filter.setShaderArmeture(armetrue, color, name);
        } else if (armetrue === null && name === "init") {
            for (var i in SX__jin) {
                Filter.setSpriteShader(null, SX__jin[i], name);
            }
        }
    },

    setNodeShader: function (arm, mat4, name, forced) {
        if (arm instanceof ccui.Text || arm instanceof cc.LabelTTF) return;
        var state = 0;
        if (mat4 === SX__jin["stone"])
            state = 1;
        else
            state = 0;
        if (arm instanceof ccui.Widget && cc.ENGINE_VERSION != "Cocos2d-JS v3.0 Final") {
            arm.setState && arm.setState(state);
            if (arm.getVirtualRenderer && arm.getVirtualRenderer()) {
                if (arm.getVirtualRenderer().setState){
                    arm.getVirtualRenderer().setState(state);
                }else{
                    Filter.setSpriteShader(arm.getVirtualRenderer(), mat4, name);
                }
            }
        } else {
            Filter.setSpriteShader(arm, mat4, name);
            if (arm.getVirtualRenderer && arm.getVirtualRenderer())
                Filter.setSpriteShader(arm.getVirtualRenderer(), mat4, name);
        }
        var childs = arm.getChildren();
        for (var i in childs) {
            if (cc.sys.isNative) {
                Filter.setShader(childs[i], name, forced);
            } else {
                Filter.setNodeShader(childs[i], mat4, name, forced);
            }
        }
    },

    setShaderArmeture: function (arm, vec4, name) {
        Filter.setSpriteShader(arm, vec4, name);
        var bones = arm.getBoneDic();
        for (var i in bones) {
            Filter.setSpriteShader(bones[i], vec4, name);
            var childs = bones[i].getChildren();
            if (childs.length > 0) {
                for (var j in childs) {
                    Filter.setSpriteShader(childs[j], vec4, name);
                    if (childs[j].getChildArmature && childs[j].getChildArmature()) {
                        Filter.setShaderArmeture(childs[j].getChildArmature(), vec4, name);
                    }
                }
            }
            if (bones[i].getChildArmature()) {
                Filter.setShaderArmeture(bones[i].getChildArmature(), vec4, name);
            }
        }
    },

    setSpriteShader: function (sprite, vec4, name) {
        var shader = cc.shaderCache.getProgram(name);
        if (!shader) {
            var SHADER_POSITION_GRAY_FRAG;
            if (_.isArray(vec4)) {
                SHADER_POSITION_GRAY_FRAG = Filter.SHADER_POSITION_GRAY_FRAG2 + vec4 + Filter.SHADER_POSITION_GRAY_FRAG3;
            } else {
                if (vec4 === "white") {
                    SHADER_POSITION_GRAY_FRAG = Filter.SHADER_POSITION_GRAY_FRAG1;
                }
            }

            var SHADER_POSITION_GRAY_VERT = name == "stone2" ? Filter.SHADER_POSITION_GRAY_VERT2 :Filter.SHADER_POSITION_GRAY_VERT1;
            if (cc.sys.isNative)
                shader = cc.GLProgram.createWithByteArrays(SHADER_POSITION_GRAY_VERT, SHADER_POSITION_GRAY_FRAG);
            else {
                shader = new cc.GLProgram();
                shader.initWithString(SHADER_POSITION_GRAY_VERT, SHADER_POSITION_GRAY_FRAG);
            }
            cc.shaderCache.addProgram(shader, name);
            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            shader.link();
            shader.updateUniforms();
        }
        sprite && sprite.setShaderProgram(shader);
    }
};