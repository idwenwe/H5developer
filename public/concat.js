/*******************************************************
**programmer:hzw.
**
**time:2017/03/07
**
**summary:确保页面内容与腹肌页面内容相互关联。可使用父页面内容函数。操作子页面之间的内容跳转。JS内容缓存之后在下一次读取的时候会再运行一次。。

********************************************************/

//预设定的相关事件内容。
var concat = (function(c){
    
    c.pageCount = 4;//页面内容总数。
    
    var doc = window.parent;
    
    var slipping = false; //设置是否支持滑屏翻页内容。
    
    var accross = false; //默认为false表示竖屏，改为true则默认为横屏，如果直销要单页面横屏的话请调用pageAccess()函数。
	
    /*************************************************************/
    c.currentPage = 0;
	
	c.complete = 0;
    
    //既定内容无需修改。
    var point = {'x':0, 'y':0};
    
    var moved = false;
    
    var distance = 0;
    
    //获取PC端上的鼠标点击位置。参数为事件对象
    c.getPoint = function(e){
        var event = e||window.Event;
        var x = event.pageX || event.clientX;
        var y = event.pageY || event.clientY;
        return {'x':x, 'y':y};
    }
    
    //获取移动端的鼠标点击位置。参数为事件
    c.getMobilePoint = function(e){
        var event = e.touches[0];
        var x = Number(event.pageX || event.clientX);
        var y = Number(event.pageY || event.clientY);
        return {'x':x, 'y':y};
    }   

    c.slippingEvent = {
        'ele': document.body,
        
        'mousedown':function(e){
        
            var client = exp.info.userAgent;
            
            if(moved){
                return;   
            }
            
            e.preventDefault();
            //获取当前的点击位置内容要求对于端判断。
            
            moved= true;
            
            if(client.toLowerCase() === 'mobile'){
                point = concat.getMobilePoint(e);
            }
            else {
                point = concat.getPoint(e);   
            }
            
        },
        
        'mousemove':function(e){
            
            var newPo, move;
            var client = exp.info.userAgent;
            e.preventDefault(); 
            if(!moved){
                return;   
            }
            //to do:移动动画效果设置。对是否移动作出判断。
            if(client.toLowerCase() === 'mobile'){
                newPo = concat.getMobilePoint(e);
            }
            else {
                newPo = concat.getPoint(e);   
            }
            
            distance = newPo.y - point.y;
            
            
            move = 'transform:translateY('+distance+'px);';
            window.parent.postMessage('deleteStyle:transform', '*');
            window.parent.postMessage('addStyle:'+move, '*');
        },
        
        'mouseup':function(e){
            
            var move;
            var height =document.body.offsetHeight;
            
            e.preventDefault();  
            //to do:调用exchangepage页面然后将当前的内容讲moved设置成为0.
            moved = false;
            
            if(Math.abs(distance) >= 60){
                if(distance < 0){
                    move = 'transform:translateY('+(-height)+'px);';
                    concat.exchangePage(true, move, 500);
                }
                else {
                    move = 'transform:translateY('+height+'px);';
                    concat.exchangePage(false, move, 500); 
                }
            }
            window.parent.postMessage('deleteStyle:transform', '*');
        },
    }//编写相关的划屏点击事件内容进行设置。
    
    c.click = {}//编写点击跳转事件。
    
/*******************************************************
**事件注入。
**推荐使用依赖性质的事件绑定。编写denpendencyEvent对象数组后直接调用injection函数。
********************************************************/
    c.dependencyEvent = [];
    var injection = function(){
        if(concat.dependencyEvent.length === 0){
            return;   
        }
        exp.event.dependencyEvent = concat.dependencyEvent;
        exp.event.injection();
        exp.event.dependencyEvent = [];
    }
    
/*******************************************************
**预加载。
**推荐使用依赖性质的预加载。编写denpendencyPreload对象数组后直接调用loading函数。
********************************************************/
    c.dependencyPreload = [];
    //预加载设置图片内容。
    var preload = function(){
        if(concat.dependencyPreload.length === 0){
            return;   
        }
        exp.preload.dependencySource = concat.dependencyPreload;
        exp.preload.preload();
        exp.preload.dependencySource = [];
    }
    
    c.dependencyBuild = [];
    var build = function(){
        if(concat.dependencyBuild.length === 0){
            return;   
        }
        exp.build.dependencyFile = concat.dependencyBuild;
		concat.dependencyBuild = [];
        exp.build.loading(document);
        exp.build.dependencyFile = [];
    }
    
/*******************************************************
**点击跳页设置。
********************************************************/
    
    c.exchangePage = function(num, extra, time){
        var tr;
        window.parent.postMessage('exchangePage:'+num + ',' + extra + ',' + time, '*');
    }
    
/*******************************************************
**设置当前页面内容的单页面横屏
********************************************************/
    c.pageAccross = function(){
        //当前页面内容横屏。
        if(exp.info.Brower.toLowerCase() === 'mobile'){
            exp.dom.setElements(document.body, 'class', 'cross', true);
        }
        else {
            
        }
    }
    
/*******************************************************
**加载页面预加载内容以及初始化完成。
********************************************************/
    c.initalize = function(){
        
        preload();
        injection();
        build();
    }
    //doc.exp.preload.preloadFinish位页面与加载内容完成选项。
    
/*******************************************************
**首页内容进行判断跳转,在其他页面将会不可用。
********************************************************/
    c.exchangeLoadingPage = function(){
        
        var pre = exp.preload;
        if(concat.currentPage != 0){
            return;   
        }
        
        var clear = setInterval(function(){
            if(pre.imageCheck === pre.imageCount && pre.audioCheck === pre.audioCount && pre.videoCheck === pre.videoCount && concat.complete === (concat.pageCount - 1)){
                clearInterval(clear);
                concat.exchangePage(true, true);
            }
        },500);   
//        var clear = setTimeout(function(){
//                pre.preloadFinish = true;
//                clearInterval(clear);
//                if(!concat.exchangePage(true, true)){
//                    console.log('Error: At least one-another  without loaging page'); 
//                }
//        },5000);
    }
    
/*******************************************************
**当前页面的音频播放。
********************************************************/
    var playing ;
    c.audioPlay = function(ele){
        
        var i ;
        playing = [];
        if(ele instanceof Element){
            playing.push(ele)   
        }
        else{
            playing = exp.dom.getElements('audio', 'tag', document);
        }
        if(playing.length === 0){
            return;   
        }
        for(i =0 ;i < playing.length; i++){
            //获取data-default属性。
            if(playing[i].getAttribute('data-default')){
                playing[i].currentTime = 0;
                playing[i].play();   
            }
        }
    }
    
    c.audioStop = function(){
        
        var i ;
        if(!playing){
            return;
        }
        for(i = 0 ; i< playing.length; i++){
            playing[i].pause();   
        }
        playing = null;
    }
    
/*******************************************************
**当前页面的视频播放。
********************************************************/
    var playingVideo ;
    c.videoPlay = function(ele){
        playingVideo = ele;
        playingVideo.currentTime = 0;
        playingVideo.play();
    }
    
    c.videoStop = function(){
        if(!playingVideo){
            return;
        }
        playingVideo.pause();  
        playingVideo = null;  
    }
    
/*******************************************************
**页面转换
********************************************************/
    c.exchangePageStartEvent = function(){
        //当转换页面的时候子页面要做的事情。
        concat.dependencyBuild.push('index.js');
        exp.build.dependencyFile = concat.dependencyBuild;
		exp.build.loading(document);
		concat.dependencyBuild = [];
        concat.audioPlay();
        exp.dom.deleteStyle(document.body, 'display');
    }
    
/*******************************************************
**初始化页面内容和适配。
********************************************************/
    c.init = function(){
        //当前页面内容大小适配。
        if(!accross){
            //直接引入page.css就好了。
        }
        else{
            concat.pageAccross();
        }
        if(slipping){
            concat.slippingEvent.ele = document.body;
            exp.event.addEventsByObj(concat.slippingEvent);
        }
        if(concat.currentPage === 0){
            window.parent.postMessage('loadingPage:'+concat.pageCount, '*');
        }
    }
    
    return c;
})(concat || window.concat || {});

//页面初始化内容函数
window.addEventListener('load', function(){

    concat.init();
    window.addEventListener('message', function(e){
        var page;
        var data = e.data.split(":");
        if(data[0] === 'changed'){ 
            concat.exchangePageStartEvent(); 
        }
        else if(data[0] === 'currentPage'){
            page = parseInt(data[1]);
			concat.currentPage = page;
        }
        else if(data[0] === 'addStyle'){
            exp.dom.setElements(document.body, 'style', 'display:none;');   
        }
        else if(data[0] === 'pastPage'){
			concat.audioStop();   
            exp.dom.setElements(document.body, 'style', 'display:none;');    
		}
		else if(data[0] === 'complete'){
			concat.complete ++;
		}
    },false);

},false);