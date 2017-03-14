/*******************************************************
**programmer:hzw.
**
**time:2017/03/07
**
**summary:确保页面内容与腹肌页面内容相互关联。可使用父页面内容函数。操作子页面之间的内容跳转。JS内容缓存之后在下一次读取的时候会再运行一次。。

********************************************************/

var doc = window.parent;

var parent = doc.document.getElementById('page'+doc.currentPage);

//预设定的相关事件内容。
var concat = (function(c){
    
    c.pageCount = 2;//页面内容总数。
    
    var slipping = false; //设置是否支持滑屏翻页内容。
    
    var accross = false; //默认为false表示竖屏，改为true则默认为横屏，如果直销要单页面横屏的话请调用pageAccess()函数。
    
    /*************************************************************/
    //既定内容无需修改。
    var point = {'x':0, 'y':0};
    
    var moved = false;
    
    var distance = 0;
    
    //获取PC端上的鼠标点击位置。参数为事件对象
    c.getPoint = function(e){
        var event = e||window.Event;
        var x = event.pageX || event.clientX;
        var y = event.pageY || event.clientY;
        point.x = x;
        point.y = y;
        return {'x':x, 'y':y};
    }
    
    //获取移动端的鼠标点击位置。参数为事件
    c.getMobilePoint = function(e){
        var event = e.touches[0];
        var x = Number(event.pageX || event.clientX);
        var y = Number(event.pageY || event.clientY);
        point.x = x;
        point.y = y;
        return {'x':x, 'y':y};
    }   

    c.slippingEvent = {
        'ele': document.body,
        
        'mousestart':function(e){
            
            var client = doc.exp.info.userAgent;
            
            if(moved){
                return;   
            }
            
            e.preventDefault();
            //获取当前的点击位置内容要求对于端判断。
            
            moved= true;
            
            if(client.toLowerCase() === 'mobile'){
                concat.getMobilePoint(e);
            }
            else {
                concat.getPoint(e);   
            }
            
        },
        
        'mousemove':function(e){
            
            var newPo, moved;
            var client = doc.exp.info.userAgent;
            e.preventDefault(); 
            //to do:移动动画效果设置。对是否移动作出判断。
            if(client.toLowerCase() === 'mobile'){
                newPo = concat.getMobilePoint(e);
            }
            else {
                newPo = concat.getPoint(e);   
            }
            
            distance = newPo.y - point.y;
            
            moved = 'transfrom:translateY('+distance+'px;);transition:all 0.5s ease-out 0s;';
            
            doc.exp.dom.setElements(parent, 'style', moved, true);
        },
        
        'mouseup':function(e){
            
            var moved;
            var height =document.body.offsetHeight;
            
            e.preventDefault();  
            //to do:调用exchangepage页面然后将当前的内容讲moved设置成为0.
            
            if(Math.abs(distance) >= 60){
                if(distance < 0){
                    moved = 'transform:translateY('+(-height)+'px);transition:all 0.5s ease-out 0s;';
                    concat.exchangePage(true, moved, 1000);
                }
                else {
                    moved = 'transform:translateY('+height+'px);transition:all 0.5s ease-out 0s;';
                    concat.exchangePage(false, moved, 1000);
                }
            }
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
        doc.exp.event.dependencyEvent = concat.dependencyEvent;
        doc.exp.event.injection();
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
        doc.exp.preload.dependencySource = concat.dependencyPreload;
        doc.exp.preload.preload();
    }
    
/*******************************************************
**点击跳页设置。
********************************************************/
    c.exchangePage = function(num, extra, time){
        doc.router.exchangePage(num, extra, time);
        concat.audioStop();
    }
    
/*******************************************************
**设置当前页面内容的单页面横屏
********************************************************/
    c.pageAccross = function(){
        //当前页面内容横屏。
        if(doc.exp.info.Brower.toLowerCase() === 'mobile'){
            doc.exp.dom.setElements(document.body, 'class', 'cross', true);
        }
        else {
            doc.router.resuit();
        }
    }
    
/*******************************************************
**加载页面预加载内容以及初始化完成。
********************************************************/
    c.initalize = function(){
        preload();
        injection();
    }
    //doc.exp.preload.preloadFinish位页面与加载内容完成选项。
    
/*******************************************************
**首页内容进行判断跳转,在其他页面将会不可用。
********************************************************/
    c.exchangeLoadingPage = function(){
        
        if(doc.currentPage != 0){
            return;   
        }
        
        var clear = setInterval(function(){
            if(doc.exp.preload.preloadFinish){
                clearInterval(clear);
                concat.exchangePage(true);   
            }
        },500);   
    }
    
/*******************************************************
**当前页面的音频播放。
********************************************************/
    var playing ;
    c.audioPlay = function(){
        playing = doc.exp.dom.getElements('audio', 'tag', document);
        if(playing.length === 0){
            return;   
        }
        playing.currentTime = 0;
        playing.play();
    }
    
    c.audioStop = function(){
        if(!playing){
            return;
        }
        playing.pause();  
        playing = null;
    }
    
/*******************************************************
**当前页面的视频播放。
********************************************************/
    var playingVideo ;
    c.videoPlay = function(){
        playingVideo = doc.exp.dom.getElements('video', 'tag', document);
        if(playingVideo.length === 0){
            return;   
        }
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
**初始化页面内容和适配。
********************************************************/
    c.init = function(){
        //当前页面内容大小适配。
        var parent = doc.document;
        if(!accross){
            //直接引入page.css就好了。
        }
        else if(accross){
            concat.pageAccross();
        }
        if(slipping){
            doc.exp.event.addEventsByObj(concat.slippingEvent);
        }
        if(doc.currentPage === 0){
            doc.router.loadingParent(concat.pageCount);   
        }
        concat.audioPlay();
    }
    
    return c;
})(concat || window.concat || {});

//页面初始化内容函数
doc.exp.event.addEvents(window, 'load', function(){
    
    concat.init();

},false);