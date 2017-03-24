concat.dependencyPreload = [
//    {   
//        type:'image',
//        src: [
//            "./public/page1/image/0_5.png",
//            "./public/page1/image/0_6.png",
//            "./public/page1/image/0_71.png",
//            "./public/page1/image/0_72.png",
//             ]
//    },
    
    {
        type:'audio',
        src: [
                '../page1/audio/page0.mp3',
                '../page2/audio/page1.mp3',
             ]
    
    }
];

concat.dependencyEvent = [
    {
        'ele':document.body,
        'click':function(){
            concat.exchangeLoadingPage();
        }
    }
    
];

concat.initalize();

//concat.exchangeLoadingPage();