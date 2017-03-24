/**************************************plant平台相关联内容****************************************/

var KEY = "cmi.suspend_data";

var STATUS = "cmi.core.lesson_status";

var FINISH = 1;

var UNFINISH = 0;

//初始化数据设置。
var INIT = "1";

var CONNECTION = 1;

var UNCONNECTION = 0;


var ser = (function(s){

    var Server = function(){
         return new Server.prototype.init();
    }

    Server.prototype = {

         init:function(){

            //设置当前对象的特殊数据和方法。
            var me =this;

            //当前对象中的私有变量声明。
            var plantData = "";

            //用于存储当前是否连接到平台。0表示可以连接到平台，而1表示不能连接到平台。
            me.connection = CONNECTION;

            //问题内容的设置,data数据是一个plantData对象。程序内部控制当前的data将不会出错。
            me.setData = function(data){
                plantData = data;
            }

            //获取当前的问题内容。当当前的对象中没有问题数据的时候。我们返回的将会是undefined
            me.getData = function(){
                if(!plantData){
                    return null;
                }
                return plantData;
            }
            
            loadPage();

            //调用方法已达到初始化当前的对象中的数据的目的。
            me.connectTo();

            var result;
            result = this.getValueOfStorage();//获取当前的存储字段的内容。如果是首次进入这实行初始化数据的处理。
            me.plantDataInit(result);//设置初始化的平台数据对象。
            return this;
        },


      //connectTo函数逻辑：
        //  1.调用doLMSGetValue函数获取当前的内容.
        //  2.如果当前的内容为空字符串则说明没有连接到当前的平台中，如果获取的内容是"null"则我们可以确定当前的页面连接到了平台。
        //  3.如果当前页面没有连接到平台则将当前对象的连接状态更改为UNCONNECT。
        //  4.如果当前的页面连接到了，则直接设置成为CONNECTED;
        connectTo: function(){
            var result;

            result = doLMSGetValue(KEY);

            if(!result){
                this.connection = UNCONNECTION;   
            }
            else {
                this.connection = CONNECTION;   
            }
        },

        //getValueOfStorage获取存储的额内容。
        //  1.判断当前的连接状态。
        //  2.一句判断的数据来获取相应的值。
        //  3.判断获取的值，如果当前的值是空着使用定义好的初始值进行返回。
        //  4.如果当前的最终值为初始化值得时候，存储当前的额初始值。
        getValueOfStorage:function(){
            var result;

            if(this.connection) { //当前的连接状态为已经连接到平台的情况。
                result = this.getValue(); // 获取当前的平台数据。
                if(result == "null"){
                    result = INIT;
                    this.setValue(INIT);
                }
            }
            else {
                result = sessionStorage.getItem(KEY);
                if(!result){
                    result = INIT;
                    this.setValue(INIT);
                }
            }
            return result;
        },

        //plantDataInit为当前页面数据转换累的函数。传递的内容为str类型并按照相关的额格式。
        //  1.获取当前字符串并把当前的数据内容编传递到Plantdata对象的构造方法中进行数据对象的初始化。
        //  2.根据返回的内容对当前对象中的内容进行内容的相对应的设置。
        plantDataInit:function(str){
            
            this.setData(str);
        },

        //getValue用于获取平台数值
        //  1.使用doLMSGetValue函数来获取当前的值。
        //  2.设置当前的额已经结束，通过doFinish()函数来进行的。
        getValue:function(){
            var result;

            result = doLMSGetValue(KEY);
            if(!result){
                result = sessionStorage.getItem(KEY);   
            }
            doLMSCommit();
            doLMSFinish();
            return result;
        },

        //setValue设置平台数据。
        //设置当前平台内容的相关数据。
        setValue:function(value){
            var result = doLMSSetValue(KEY, value);
            if(!result){
                sessionStorage.setItem(KEY, value);   
            }
        },

        //设置当前的课程是完成状态。
        finishCheck:function(station){
            var status = doLMSGetValue( "cmi.core.lesson_status" );
            console.log('check complete:'+status);
            if(status == "complete"){
                return;   
            }
            if(/incomplete/ig.test(station)){
                doContinue("incomplete");   
            }
            else if(/complete/ig.test(station)){
                doContinue("complete");   
            }
        },
         //判断当前课程是否已经结束
        complete:function(){
            this.finishCheck("complete");
        }
    };
    
    Server.prototype.init.prototype = Server.prototype;
    
    s = new Server();
    
    return s;

})(ser || window.ser || {});

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
var widthDef = 640;
var heightDef = 1008;

var currentPage = 0;
var pageCount = 0;

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
        
        for(i = 1; i < pageCount; i++){
            newEle = exp.dom.createElement('iframe', {'src':'./public/page'+i+'/index.html',
                                         'name':'page'+i,
                                         'id':'page'+i,
                                         'frameborder':0,
                                         'sandbox':'allow-same-origin allow-forms allow-scripts allow-modals',
                                         'style':'display:none;'});
            parent = document.getElementById('package');
            exp.dom.insertElements(newEle, parent, exp.dom._CHILD);
            (function(){
                var ele = newEle;
                ele.onload = ele.onreadystatechange = function() 
                {
                     if (this.readyState && this.readyState != 'complete') return;
                     else {
                         onComplete(ele);
                     }
                }
            })();
        }
    }
    
    var onComplete = function(ele){  
        ele.contentWindow.postMessage('addStyle:body', '*');
		document.getElementById('page0').contentWindow.postMessage('complete', '*'); 
    }

/********************************************************
**summary:页面内容适配对象。微页面添加变形自动适配函数。设置主页。
*********************************************************/
    var suitable = function(){
        
        var height, width, bh, bw, check;
        
        if(exp.info.userAgent.toLowerCase() === 'mobile'){
            height = window.screen.availHeight;
            width = window.screen.availWidth;
            bh = document.body.offsetHeight;
            check = document.body.offsetWidth;
            bw = bh/heightDef*widthDef;
            if(check < bw){
                bw = check;   
            }
            bh = bh/height;
            bw = bw/width;
            exp.dom.setElements(document.body, 'style', 'width:'+width+'px;height:'+height+'px;transform:scaleX('+bw+') scaleY('+bh+');transform-origin:0 0;overflow:visible;position:absolute;top:0;left:0;margin:0;');
        }
        else if(exp.info.userAgent.toLowerCase() === 'pc' || exp.info.userAgent.toLowerCase() === 'ipad'){
            height = document.body.offsetHeight;
            width = height/heightDef*widthDef;
            exp.dom.setElements(document.getElementById('package'), 'style', 'width:'+width+'px;height:'+height+'px;');
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
        //当extra内容为true时候。跳转到平台页面数据置顶页数。
        var i, count=true, pastPage = currentPage, cover, plant , cpage, changed = true;
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

        if(typeof extra === 'boolean'){
            plant = parseInt(ser.getData()); 
            alert('transto page：'+plant);
            if(plant){
                num = plant
            }
            else {
                num = 1;   
            }
            currentPage = num;
            extra = false;
        }
        else
        { 
            if(typeof num === 'number'){
                currentPage = num;   
            }
            else if(num){
                currentPage++;
            }
            else {
                currentPage--;   
            }
        }
        if(currentPage >= pageCount){
            currentPage = pastPage;
            changed = false;
        }
        else if(currentPage <= 0 && typeof extra !== 'boolean'){
            currentPage = pastPage;
            changed = false;
        }
        ser.setData(currentPage);
        pastPage = document.getElementById('page'+pastPage);
        cpage = document.getElementById('page'+currentPage);
        if(!extra){
            exp.dom.setElements(pastPage, 'style', 'display:none;');
//            exp.dom.setElements(pastPage.contentWindow.document.body, 'style', 'display:none;');
            pastPage.contentWindow.postMessage('pastPage:display', '*');
            exp.dom.deleteStyle(cpage, 'display');
        }
        else{
            exp.dom.setElements(pastPage, 'style', ' '+extra);
            //设置事件对当前的内容进行动画设置和延时隐藏展示操作。
            setTimeout(function(){
                cover = pastPage.getAttribute('style').replace((new RegExp(' '+extra)), '');
                exp.dom.setElements(pastPage, 'style', cover); 
                pastPage.contentWindow.postMessage('pastPage:display', '*');
                exp.dom.deleteStyle(cpage, 'display');
                exp.dom.deleteStyle(cpage, 'transform');
                exp.dom.deleteStyle(cpage, 'transition');
            }, time);
        }
        if(currentPage === (pageCount - 1)){
            ser.complete();   
        }
        for(var a = 0 ; a < pages.length; a++){
            pages[a].contentWindow.postMessage("currentPage:"+currentPage, '*');   
        }
        if(changed){
            pages[currentPage].contentWindow.postMessage('changed:'+changed, '*');
        }
    } 
    
    return r;

})(router || window.router || {});

//主题页面内容进行事件的添加。
exp.event.addEvents(window, 'load', function(){
       
    router.init();
    window.addEventListener('message', function(e){
        
        var data = e.data.split(':');
        var datalist;
        var cp = document.getElementById('page' + currentPage);
        if(data[0] === 'deleteStyle'){
            exp.dom.deleteStyle(cp, data[1]); 
        }
        else if(data[0] === 'addStyle'){
            exp.dom.setElements(cp, 'style', data[1], true);
        }
        else if(data[0] === 'exchangePage'){
            datalist = data[1].split(',');
            if(datalist[0] === 'true'){
                datalist[0] = true;   
            }
            else if(datalist[0] === 'false'){
                datalist[0] = false;   
            }
            else {
                datalist[0] = parseInt(datalist[0]);   
            }
            if(datalist[1] === 'true'){
                datalist[1] = true;   
            }
			else if(datalist[1] === 'undefined' || datalist[1] === 'null'){
				datalist[1] = undefined;	
			}
            if(datalist[2] !== 'undefined' && datalist[2] !== 'null'){
                datalist[2] = parseInt(dataList[2]);   
            }
            else {
                datalist[2] = undefined;   
            }
            router.exchangePage(datalist[0],datalist[1],datalist[2]);
        }
        else if(data[0] === 'loadingPage'){
            pageCount = parseInt(data[1]);
            router.loadingParent();
        }
    
    }, false);
    
},false);