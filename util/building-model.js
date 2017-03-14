/*******************************************************
**programmer:hzw.
**
**time:2017/03/07
**
**summary:当前文件用于DOM操作功能，方便相关操作。
********************************************************/

var exp = (function(e){

/*************************************************************************obj1:baseInfo
**summary:当前端口需要使用的到的数据或是端口判断等基础性的内容信息。
********************************************************/
    var baseinfo = {};
    
/********************************************************
**summary:存储相关当前文件的版本信息内容。
*********************************************************/ 
    baseinfo.version = '1.0.0';
    
/********************************************************
**summary:服务器端相关作用信息获取。
**
**parameter：无。
**
**return:空
*********************************************************/
    //明确表明当前的浏览器的类型与IE浏览器的版本信息。
    baseinfo.Brower = (function(){
        
        var final, date;
        var ua = window.navigator.userAgent;
        
        if(/Android/.test(ua)){
            final = 'Android';   
        }
        else if(/iPhone/.test(ua)){
            final = 'iPhone';
        }
        else if(/iPad/.test(ua)){
            final = 'iPad';   
        }
        else if(/Firefox/.test(ua)){
            final = 'ff';   
        }
        else if(/Chrome/.test(ua)){
            final = 'chrome';   
        }
        else if(/Opera/.test(ua)){
            final = 'Opera';   
        }
        else if(/Safari/.test(ua)){
            final = 'Safari';   
        }
        else if(/compatible/.test(ua) && /MSIE/.test(ua)){
            date = /MSIE(.?\d+.\d+)?/.exec(ua);
            if(parseInt(date[1]) === 9){
                final = 'IE9';
            }
            if(parseInt(date[1]) === 10){
                final = 'IE10';
            }
            if(parseInt(date[1]) === 11){
                final = 'IE11';   
            }
            if(parseInt(date[1]) < 9){
                final = 'other';   
            }
        }
        return final;
        
    })();
    
    //表明当前的运行的实在手机上还是PC上面。
    baseinfo.userAgent = (function(){
    
        if(/Android|iPhone|iPad/.test(baseinfo.Brower)){
            return 'Moblie';
        }
        else {
            return 'PC';   
        }
        
    })();
    
    e.info = baseinfo;
    
/************************************************************************obj2:DOMOperation
**summary:当前文件用于DOM操作功能，方便相关操作。
********************************************************/
    var dom = {};
    
    e.dom = {}; //此处为扩展命名空间，防止命名污染。
    
    dom.doc = document;
    
/********************************************************
**summary:设置当前的DOM操作的上下文环境，改变document文档对象。
**
**parameter：
**  1.doc需要改变的文档对象。
**
**return:空
*********************************************************/
    dom.setDoc = function(doc){
        if(doc instanceof Document){
            obj.doc = doc;
        }
        else{
            console.error('TypeError:Type of Parameter was wrong');
            obj.doc = document;
        }
    };
    
/********************************************************
**summary:获取document文档中的相关元素内容。
**
**parameter：
**  1.id：需要获取元素的某一属性的内容。
**  2.extra：按照属性名称，文档对象指定的形式进行传输。
**  没有属性名称的情况之下会按照ID为默认形式来进行搜索，无文档对象则以当前的
**  文档对象为默认对象。
**
**return:返回元素数组或单个值
*********************************************************/    
    dom.getElements = function(id, extra){
        
        var final, checkStr, doc;
        
        doc = dom.doc;
        if(arguments[2]){
            doc = arguments[2];
        }
        
        //第二个参数传递的是document文档。
        if(extra instanceof Document){
            doc = extra;   
        }
        
        //内有第二个参数的时候。
        if(!extra){
            final = doc.getElementById(''+id);
        }
        
        //当有第二个以上的参数的时候。
        checkStr = extra.toLowerCase();
        if(/id/.test(checkStr)){
            final = doc.getElementById(''+ id);   
        }
        else if(/class/.test(checkStr)){
            final = doc.getElementByClass('' + id); 
        }
        else if(/tag/.test(checkStr)){
            final = doc.getElementsByTagName('' + id);   
        }
        
        return final;
    };

/********************************************************
**summary:添加，修改，或是删除相关元素的某一属性的值。
**
**parameter：
**  1.ele：元素可谓单一元素或者是元素数组。
**  2.extra：属性名称。修改内容。是否为前缀（布尔）
**  前缀默认为false当为true的时候会将修改内容添加到元素对应属性值得前方。
**  属性名称传递，但是修改内容为空的情况下，为删除当前的元素标签的属性。
**  当属性名称没有的时候，属性值有的情况下，属性名称佳慧自动的设置为style属性。
**  当两者都没有的情况下会报错返回。
**  设置属性的时候会讲传递的ele的上下文与当前的默认上下文进行比较。如果相同则
**  使用默认上下文，如果不同这使用元素上下文。
**  当attrName为style的时候，
**
**return:返回ele值
*********************************************************/
    dom.setElements = function(ele, extra){
        
        var attrName, attrDate, ex = false, i, eles = [];
        
        if(!(ele instanceof Element) && !(ele instanceof Array)){
            console.error("TypeError: Type of arguments was wrong");
            return ;
        } 
        
        if(!extra){
            console.error('syntaxError: Wrong parmeter of function');
            return;   
        }
        
        if(typeof extra === 'boolean'){
            console.error('syntaxError: Wrong parmeter of function');
            return;
        }
        
        //确定使用参数数值。
        if(/[\d\w\-]+\:[\d\w]+\;/.test(extra)){
            attrDate = extra;
            attrName = 'style';
            if(typeof arguments[2] === 'boolean'){
                ex = arguments[2];
            }
        }
        else {
            attrName = extra.toLowerCase();  
            if(typeof arguments[2] === 'string'){
                attrDate = arguments[2]; 
                if(typeof arguments[3] === 'boolean'){
                    ex = arguments[3];   
                }
            }
            else if(typeof arguments[2] === 'boolean'){
                ex = arguments[2];   
            }
        }
        
        if(ele instanceof Array){
            eles = ele;
        }
        else {
            eles.push(ele);
        }
        for(i = 0; i < eles.length; i++){
            if(ex){
                if(attrName === 'style' || attrName === 'class'){
                    eles[i].setAttribute(attrName, eles[i].getAttribute(attrName) + ';' +attrDate);   
                }
                else{
                    eles[i].setAttribute(attrName, attrDate + '-' + eles[i].getAttribute(attrName));
                }
            }
            else {
                eles[i].setAttribute(attrName, attrDate);   
            }
        }    
        return ele;
    };
    
/********************************************************
**summary:添加，修改，或是删除相关元素的某一属性的值。
**
**parameter：
**  1.ele：元素可谓单一元素或者是元素数组。
**  2.con：style中存在的某一中属性的名称。
**
**return:返回ele值
*********************************************************/
    dom.deleteStyle = function(ele, con){
        
        var content, check, eles = [], i;
        
        check = new RegExp(con + '\:.+\;');
        
        if(ele instanceof Array){
            eles = ele;
        }
        else {
            eles.push(ele);  
        }
        
        for(i = 0 ; i < eles.length; i++){
            
            content = '' + eles[i].getAttribute('style');
            if(check.test(content)){
                content.replace(check, '');
                eles[i].setAttribute('style', content);
            }
        }
        
        return ele;
    }

/********************************************************
**summary:创建新元素内容并返回相关的内容。
**
**parameter:
**  1.title:元素标签内容。
**  2.attr:与json对象的格式传递需要创建的标签的属性与内容。属性有如下：
**  id，class，style，content，name，等等。
**
**return:返回创建的新元素。
*********************************************************/
    dom.createElement = function(title, attr){
        
        var doc, attrs, newEle;
        
        if(!(attr instanceof Object)){
            console.error("TypeError: Type of arguments was wrong");
            return ;       
        }
        doc = dom.doc;
        
        newEle = doc.createElement(title);
        
        for(attrs in attr){
            newEle.setAttribute(''+attrs, attr[attrs]);   
        }
        
        return newEle;
    };
    
/********************************************************
**summary:树遍历算法内容
**
**parameter：
**  1.ele:元素节点内容。
**  2.doc:新内容上下文对象。
**
**return:返回一个拷贝的元素内容
*********************************************************/  
    var queryTree = function(ele, doc){
           
    }
        
/********************************************************
**summary:拷贝document文档中的相关元素内容。(unfinish)
**
**parameter：
**  1.id：需要获取元素的某一属性的内容。
**  2.extra：是否为深度拷贝。深度拷贝将会同时拷贝当前内容的子节点内容，
**  如果节点内容中包含id属性内容，则会以当前节点的id之前添加copy字段
**  前缀的方式进行内容的拷贝。函数功能依赖于元素创建功能。如果传递内容中
**  有上下文文档对象内容，创建元素将会以传递的文档内容进行创建。
**
**return:返回一个拷贝的元素内容
*********************************************************/    
    dom.copyElements = function(ele, extra){
        
        var originDoc, newDoc, deepCopy = false, newEle, each, i, eles = [];
        
        if(!(ele instanceof Element) && !(ele instanceof Array)){
            console.error("TypeError: Type of arguments was wrong");
            return ;
        }  
        
        //确定相关的使用参数。
        originDoc = ele.ownerDocument;
        
        newDoc = dom.doc;
        if(arguments[2] instanceof Document){
            newDoc = arguments[2];
        }
        
        if(extra instanceof Document){
            newDoc = extra;   
        }
        
        if(typeof extra === 'boolean'){
            deepCopy = extra;   
        }
        
        if(ele instanceof Array){
            eles = ele;
        }
        else {
            eles.push = ele;   
        }
        
        for(i = 0; i < eles.length; i++){
               
        }
    };
    
/********************************************************
**summary:删除相关的当前的元素
**
**parameter:
**  1.ele:向相关元素信息，或直接传递元素本身。
**  2.extra：是否删除其子元素。
**  获取当前元素的document然后对于当前的内容进行操作。
**  默认为删除其中子元素内容，如果设置其为false的话将会将其中的子元素内容
**  添加到当前元素的后面。
**
**return:空。
*********************************************************/  
    dom.deleteElements = function(ele, extra){
        var notDeleteChild = false, doc, eles = [], i, j, child;
        
        if(!(ele instanceof Element) && !(ele instanceof Array)){
            console.error("TypeError: Type of arguments was wrong");
            return ;
        } 
        
        if(ele instanceof Array){
            eles = ele;
        }
        else {
            eles.push = ele;   
        }
        
        if(typeof extra === 'boolean'){
            notDeleteChild = extra;
        }
        
        try{
            for(i = 0; i< elels.length; i++){
                doc = eles[i].parentNode;
                if(notDeleteChild){
                    child = eles[i].childNodes;
                    for(j = 0 ; j < child.length; j++){
                        doc.insertBefore(child[j], eles[i]);   
                    } 
                }
                doc.removeChild(eles[i]);
            }
        }catch(e){
            console.error(e);
        }
        return ele;
    };
    
/********************************************************
**summary:插入相关元素到
**
**parameter:
**  1.ele:需要插入的元素或是数组。
**  2.existEle：已经存在的元素。
**  3.type：插入方式。总共三种'before', 'after', 'child',此三个参数
**  将会作为对象中的常量存在。
**  4.extra：其他参数可控值。
**  插入元素时会将ele与existEle的上下文进行比较，如果元素上下文不同的话将会
**  拷贝当前元素的副本内容归并到existEle的文档对象下并进行插入操作。并删除
**  当前需要插入元素。
**
**return:空。
*********************************************************/    
    dom._AFTER = 'after';
    dom._BEFORE = 'before';
    dom._CHILD = 'child';
    dom.insertElements = function(ele, existEle, type, extra){
        
        var existDoc, eleDoc,eles=[], i ;
        
        if(!(ele instanceof Element) && !(existEle instanceof Element)){
            console.error("TypeError: Type of arguments was wrong");
            return ;
        }
        
        if(ele instanceof Array){
            eles = ele;   
        }
        else {
            eles.push(ele);   
        }
        
        existDoc = existEle.ownerDocument;
        if(type === dom._AFTER){
            for(i = 0 ; i < eles.length; i++){
                existDoc.insertAfter(eles[i], existEle);
            }
        }
        else if(type === dom._BEFORE){
            for(i = 0 ; i < eles.length; i++){
                existDoc.insertBefore(eles[i], existEle);
            }   
        }
        else if(type === dom._CHILD){
            for(i = 0 ; i < eles.length; i++){
                existEle.appendChild(eles[i]);
            }   
        }
        return ele;
    };

/********************************************************
**summary:替换页面内容文本节点。
**
**parameter:
**  1.rep：替换的字符串。
**  2.content:替换的内容。其为函数，内容为返回一个字符串。
**  rep中传递的内容将会是被content替换。
**  替换内容的时候将会检测rep的上下文环境，并进行内容的
**  如果rep中的内容是标签的话，其子元素将会完全替换，如果rep是文本的话。
**  将会搜索当期的HTML中所有的相应文本并在其原本位置替换相关的内容。
**
**return:空。
*********************************************************/ 
    dom.replaceElements = function(rep, content){
        //to do:替换HTML页面中的某一个字段的内容。
    };

/********************************************************
**summary:遍历元素中的所有相关内容并组成遍历数组予以返回。
**
**parameter:
**  1.find:查询内容，可以为一个字符串，也可以是一个标签。或者是某一属性值
**  如果是属性值则需要输入第二个参数，属性名称。
**  2.extra。
**
**return：查找到的元素的节点对象数组。
*********************************************************/
    dom.queryElements = function(find, extra){
        //to do:遍历当前的内容中的所有的元素进行相关的操作。通过船只来进行标签查找。
    };
    
    e.dom = dom;
    
/************************************************************************obj3:eventOperation
**summary:用于事件绑定内容的设置。
********************************************************/
    var events = {};

/********************************************************
**summary:PC与移动端事件相关性对照列表。以一个二维数组的形式存储。存储的是常用的匹配内容，非常用的需要用户进行设置。
*********************************************************/
    var corresponding = [['mousedown', 'touchstart'],['mousemove','touchmove'],['mouseup','touchend']];
    
/********************************************************
**summary:PC与移动事件类型转换器
**
**parameter：
**  1.type:事件类型内容。
**
**return:相关字符段的数组。
*********************************************************/
    var equals = function(type){
        var i , j;
        
        for(i = 0; i < corresponding.length; i++){
            for(j = 0; j < corresponding[i].length; j++){
                if((new RegExp(''+type)).test(corresponding[i][j])){
                    return corresponding[i];   
                }
            }
        }
        return type;
    };
    
/********************************************************
**summary:事件内容绑定函数。
**
**parameter：
**  1.type：事件类型。
**  2.ele:触发元素。可以是多元素内容。
**  3.callback：事件毁掉函数对应。
**  4.setting：布尔值是否立即触发。（默认情况下是为false值）
**  依据当前多口类型进行绑定内容的封装和内容性质的划分。
**
**return:空
*********************************************************/
    events.addEvents = function(ele, type, callback, setting){
        
        var eles=[], munkup=false, finalType, i;
        
        if(ele instanceof Array){
            eles = ele;   
        }
        else {
            eles.push(ele);
        }
        
        type = equals(type);
        if(type instanceof Array){
            if(exp.info.userAgent.toLowerCase() === 'pc'){
                finalType = type[0];
            }
            else if(exp.info.userAgent.toLowerCase() === 'mobile'){
                finalType = type[1];   
            }   
        }
        else {
            finalType = type;   
        }
        
        
        if(typeof setting === 'boolean'){
            munkup = setting;   
        }
        
        for(i = 0 ; i< eles.length; i++){
            if(ele.addEventListener){
                eles[i].addEventListener(finalType, callback, munkup);
            }
            else if(ele.attachEvent){
                eles[i].addEventListener('on'+finalType, callback);   
            }
            else {
                eles[i]['on'+finalType] = callback(e);   
            }
        }
    };
    
/********************************************************
**summary:事件对应关键字设置与添加。
**
**parameter：
**  1.PCtype:PC端事件类型。
**  2.Moblietype：移动端事件类型。
**
**return:空
*********************************************************/
    events.opposite = function(PCType, MoblieType){
        
        var i, position, prepos;
        
        var Str = corresponding.toString().split(',');
        
        for(i = 0; i < Str.length;i++){
            if((new RegExp(''+PCType)).test(Str[i])){
                break;   
            }
        }
        
        if(i >= Str.length){
            position = corresponding.length;   
            corresponding.push([PCType, MoblieType]);
        }
        else {
            position = Math.floor(i/2);
            corresponding[i] = [PCType, MoblieType];
        }
    };

/********************************************************
**summary:对象制定内容解读形式。依赖注入形式。
**
**parameter：
**  1.object：按照某一格式编写的对象内容.其中必定包括内容有元素信息和
**  编写好了的类型内容以及函数。
**
**return:空
*********************************************************/
    events.addEventsByObj = function(object){
        var type, info, eventType, callback, each, check;
        
        if(!(object instanceof 'object')){
            console.error("TypeError: Type of arguments was wrong");
            return ;
        }
        
        for(each in object){
            check = /id|class|tag|ele/.exec(each);
            if(check){
                type = check[0]; 
                if(type !== 'ele'){
                    info = exp.dom.getElements(object[each], type, window.document);    
                }
            }
            else {
                eventType = each;
                callback = object[each];
            }
        }
        exp.event.addEvents(info, eventType, callback); 
    };
    
/*********************************************************
**summary:添加依赖注入内容的数组内容。
**********************************************************/
/*********************************************************
**依赖注入对象形式的内容。
**{
    'id':'xxx' //可以为ID或是class或者是直接使用ele。
    'click':function(){xxx...} //关键字可以为任意的事件类型。
    ....
**}
**********************************************************/
    events.dependencyEvent = []; //可以使用数组形式进行添加或者用户可以直接将数组进行替换。
    
/*********************************************************
**summary:结束数据注入内容进行相关的时间绑定内容。但对象多时间同时添加。
**
**rely:当前的对象dependency对象中已经注入了相关的内容。
**
**parameter:无
**
**return：空。
**********************************************************/
    events.injection = function(){
        
        var i;
        
        for(i = 0 ; i < exp.event.dependencyEvent.length; i++){
            exp.event.addEventsByObj(exp.event.dependencyEvent[i]);   
        }
    }
    
    e.event = events;
    
/************************************************************************obj4:preload
**summary:当前文件用于内容预加载以及预加载状况查询工作。
********************************************************/
    
    var pre = {};
    
    e.preload = {};
    
/********************************************************
**summary:图片内容预加载完成判断函数。
**
**parameter:
**  1.src:获取图片的路径。
**  2.callback：回调函数，加载完成之后要实行什么功能。
**  3.err:当加载错误时的县对应措施。
**  err为空的情况加，将会自动重新加载，如果第二遍还是错误的话将会自动中断。(调用当前对象中的reload方法。)
**
**return:空。
*********************************************************/  
    var validateImage = function(img){
        var check = arguments[1];
        
        if(check){
            imageCheck++;
            return;
        }
        if(!img.complete){   
            setTimeout(function(){
                exp.preload.preloadImages(img.src, true);
            }, 200);
        }
        else if(typeof img.naturalWidth != "undefined" && img.naturalWidth == 0){
            setTimeout(function(){
                exp.preload.preloadImages(img.src, true);
            }, 200);  
        }
        else{
            imageCheck++
            return;
        }
    };

/********************************************************
**summary:图片内容预加载
**
**parameter:
**  1.src:获取图片的路径。
**  2.callback：回调函数，加载完成之后要实行什么功能。
**  3.err:当加载错误时的县对应措施。
**  err为空的情况加，将会自动重新加载，如果第二遍还是错误的话将会自动中断。(调用当前对象中的reload方法。)
**
**return:空。
*********************************************************/  
    pre.preloadImages = function(src){
        
        var check = arguments[1];
        
        var img = new Image();
        if(check){
            img.onload = function(){validateImage(img, true)};
            img.onerror = function(){validateImage(img, true)};
        }
        else {
            img.onload = function(){validateImage(img)};
            img.onerror = function(){validateImage(img)};
        }
        img.src = src;
    };
    
/********************************************************
**summary:音频内容预加载反馈
**
**return:空。
*********************************************************/
    var validateMusic = function(ele){
        
        var check = arguments[1];
        
        if(!check){
            console.error('AudioError: Cannot loading this audio');
        }
        else {
            audioCheck++;
            return;
        }
        
    }
    
/********************************************************
**summary:音频内容预加载
**
**parameter:
**  1.src:获取音频的路径。
**  2.callback：回调函数，加载完成之后要实行什么功能。
**  3.err:当加载错误时的县对应措施。
**  err为空的情况加，将会自动重新加载，如果第二遍还是错误的话将会自动中断。
**
**return:空。
*********************************************************/  
    pre.preloadAudio = function(src){
        
        var aud = new Audio(src);
        aud.onloadedmetadata = function(){validateMusic(aud, true)};
        aud.onerror = function(){validateMusic(aud)};
        aud.src = src;
    };
    
/********************************************************
**summary:视频内容预加载情况判断
**
**return:空。
*********************************************************/
    var vaildateVideo = function(ele){
        
        var check = arguments[1];
        
        if(!check){
            console.error('AudioError: Cannot loading this audio');
        }
        else {
            audioCheck++;
            return;
        }
        
    }
    
/********************************************************
**summary:视频内容预加载
**
**parameter:
**  1.src:获取视频的路径。
**  2.callback：回调函数，加载完成之后要实行什么功能。
**  3.err:当加载错误时的县对应措施。
**  err为空的情况加，将会自动重新加载，如果第二遍还是错误的话将会自动中断。
**
**return:空。
*********************************************************/  
    pre.preloadVideo = function(src){
        
        var vid = new Video();
        vid.onloadedmetadata = function(){vaildateVideo(vid, true)};
        vid.onerror = function(){vaildateVideo(vid)};
        vid.src = src;
    };
    
/********************************************************
**summary:数组内容形式添加与加载内容编写。
*********************************************************/ 
/********************************************************
**数组项内容规范。数组每一项为一个对象，对象内容如下。
**{
**  type:'image' //为image,audio,vedio的一种，不限制大小写。
**  src: [xxx,xxx] //每一项是为加载内容的路径内容。多张图片与加载内容使用数组形式传递数据。
**}
*********************************************************/
    pre.dependencySource = [];//按照对象的形式进行编写。
    
/********************************************************
**summary:调用当前的函数预加载dependencySource中的信息。
**
**parameter:无
**
**return:空。
*********************************************************/
    
    var imageCount = 0;
    var audioCount = 0;
    var videoCount = 0;
    var imageCheck = 0;
    var audioCheck = 0;
    var videoCheck = 0;
    
    
    pre.preload = function(){
        var i, j, pre, list = exp.preload.dependencySource, useage;
        
        if(!exp.preload.preloadFinish){
            return ;
        }
        exp.preload.preloadFinish = false;
        
        imageCount = 0;
        audioCount = 0;
        videoCount = 0;
        imageCheck = 0;
        audioCheck = 0;
        videoCheck = 0;
        
        for(i = 0; i < list.length; i++){
            pre = list[i];
            if((/image|img/g).test(pre.type.toLowerCase())){
                useage = exp.preload.preloadImages;
                imageCount = pre.src.length;
            }
            else if((/aud|audio/g).test(pre.type.toLowerCase())){
                useage = exp.preload.preloadAudio;  
                audioCount = pre.src.length;
            }
            else if((/vid|video/g).test(pre.type.toLowerCase())){
                useage = exp.preload.preloadVideo;   
                videoCount = pre.src.length;
            }
            else {
                continue;   
            }
            
            for(j = 0; j < pre.src.length; j++){
                useage(pre.src[j]);
            }
        }
        judgePreloadStutas();
    }
    
    
    //默认情况下为false内容，当为true的请款下表示加载完成可以再次加载，而false表示加载未完成，不可在加载。
    pre.preloadFinish = true;
    
/********************************************************
**summary:判断当前的内容预加载是否已经完成了。
********************************************************/ 
    var judgePreloadStutas = function(){
        var clear1, clear2, clear3, fclear, final1, final2, final3;
        
        clear1 = setInterval(function(){
            if(imageCheck === imageCount){
                final1 = true;   
                clearInterval(clear1);
            }
        }, 400);
        
        clear2 = setInterval(function(){
            if(audioCheck === audioCount){
                final2 = true;   
                clearInterval(clear2);
            }
        }, 400);
        
        clear3 = setInterval(function(){
            if(videoCheck === videoCount){
                final3 = true;   
                clearInterval(clear3);
            }
        }, 400);
        
        fclear = setInterval(function(){
            if(final1 && final2 && final3){
                exp.preload.preloadFinish = true;   
                clearInterval(fclear);
            }
        }, 400);
        
    }

    e.preload = pre;

/************************************************************************obj5:building
**summary:当前文件用于内容预加载以及预加载状况查询工作。
********************************************************/    

    var build = {};
    
/********************************************************
**summary:创建script标签内内容并进行添加版本编号内容，以此来确立是否需要尽心缓存更新。
**
**rely：依赖的文件功能函数有DOMOperation.js以及baseInfo.JS内容。
**
**parameter：无。
**
**return:空
*********************************************************/
    var createScript = function(){
        var newScript = exp.dom.createElement('script', {
            //编写相关的属性。
        });
    }
   
/********************************************************
**summary:创建JS内容并对其进行标签的创建与添加内容。使用createScript函数进行创建。
**
**rely：依赖文件为DOMOperation.js
**
**parameter：无。
**
**return:空
*********************************************************/
    build.loadFile = function(){
        //to do：head标签中添加相关的script标签进行JS加载。 
    }
    
/********************************************************
**summary:依赖添加，当调用loadFile时会进行dependencyFile数组中的内容的添加。
**        虽说可以多次进行添加，但是推荐单次使用相关的函数内容
**
**rely：依赖文件为DOMOperation.js
**
**parameter：无。
**
**return:空
*********************************************************/
    build.dependencyFile = []; //依赖注入内容形式的文件数组内容。添加文件的路径，会议数组右前向后的进行一次的添加内容，
    build.loading = function(){
        //同时动态加载多个JS文件内容。
    }

//放置controller中。
///********************************************************
//**summary:page内容的自动加载与替换。首先替换引入CSS然后替换当前页面中的HTML进行添加和绘制。
//**
//**parameter：无。
//**
//**return:空
//*********************************************************/
//    obj.pagesInit = function(){
//           
//    }
    
    e.build = build;
    
    
    return e;
    
})(exp || window.exp || {});


//以上部分可以进行内容复用。
/***********************************************************************************************/


//下面部分为关联性内容
/*******************************************************
**programmer:hzw.
**
**time:2017/03/07
**
**summary:index内容事件绑定，预设事件内容，页面初始化的内容的设置和使用。
********************************************************/

//展示屏幕比例数据
var width = 640;
var height = 1008;

var currentPage = 0;

var router = (function(r){
/*******************************************************
**summary：获取当前课程页面内容页面数量以及src地址。替换与添加页面中的iframe元素。
**  替换loading页面中的内容。页面内容适配通过调用suitable函数。
********************************************************/
    r.init = function(){
        //页面展示适配。读取loading页面内容。
        var loadPage = document.getElementById("page0");
        var doc = document.getElementById("page0").contentWindow;
        
        exp.dom.setElements(loadPage, 'src', './public/page0/index.html');
        suitable();
    }
    
/*******************************************************
**summary：当前页面在加载页的时候部分功能。
********************************************************/
    r.loadingParent = function(count){
        //后续页面内容加载进入，并对于其中的内容进行编写与运行。
        var i, newEle, parent;
        
        if(document.getElementById('page1')){
            return;   
        }
        
        for(i = 1; i < count; i++){
            newEle = exp.dom.createElement('iframe', {'src':'./public/page1/index.html',
                                         'name':'page'+i,
                                         'id':'page'+i,
                                         'frameborder':0,
                                         'sandbox':'allow-same-origin allow-forms allow-scripts',
                                         'style':'display:none;'});
            parent = document.getElementById('package');
            exp.dom.insertElements(newEle, parent, exp.dom._CHILD);
        }
    }

/********************************************************
**summary:页面内容适配对象。微页面添加变形自动适配函数。设置主页。
*********************************************************/
    var suitable = function(){
        
        var height, width;
        
        if(exp.info.userAgent.toLowerCase() === 'mobile'){
            exp.dom.setElements(document.getElementById('package'), 'style', 'width:100%;height:100%;');
        }
        else if(exp.info.userAgent.toLowerCase() === 'pc'){
            height = document.body.offsetHeight;
            width = height/1008*640;
            exp.dom.setElements(document.getElementById('package'), 'style', 'width:'+width+'px;');
        }
    }
    
/********************************************************
**summary:pc端页面横屏
*********************************************************/
    r.resuit = function(){
        
    }
    
    var removeChange = function(){
           
    }
    
/*********************************************************
**summary:展示新页面进行展示操作。
**********************************************************/
    r.exchangePage = function(num, extra, time){
        //子页面通过调用这一方法并传递数据从而可以达到翻页的效果。
        //函数默认行为是向下翻页，当num传递为false的时候则为向上翻页。
        //extra为相关翻页前的动画内容。time:为动画事件，如果内容不同时出现则判定为错误。
        var i, count=true, pastPage = currentPage, cover;
        var pages =document.getElementsByTagName('iframe');
        
        if(typeof num === 'number'|| typeof num === 'boolean'){
            count = num;   
            if(num === currentPage){
                return;   
            }
        }
        else {
            console.error('TypeError:Type of parameter was wrong');
            return;
        }

        
        if(typeof num === 'number'){
            currentPage = num;   
        }
        else if(num){
            currentPage++;
        }
        else {
            currentPage--;   
        }
        pastPage = document.getElementById('page'+pastPage);
        
        if(!extra){
            exp.dom.setElements(pastPage, 'style', 'display:none;');
            exp.dom.deleteStyle(document.getElementById('page'+currentPage), 'display');
        }
        else{
            exp.dom.setElements(pastPage, 'style', ' '+extra);

            //设置事件对当前的内容进行动画设置和延时隐藏展示操作。
            setTimeout(function(){
                cover = pastPage.getAttribute('style').replace((new RegExp(' '+extra)), '');
                exp.dom.setElements(pastPage, 'style', cover); 
                exp.dom.setElements(pastPage, 'style', 'display:none;', true);
                exp.dom.deleteStyle(document.getElementById('page'+currentPage), 'display');
            }, time);
        }
    } 
    
    return r;

})(router || window.router || {});

//主题页面内容进行事件的添加。
exp.event.addEvents(window, 'load', function(){
       
    router.init();
    
},false);