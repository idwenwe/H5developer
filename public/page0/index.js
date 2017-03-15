concat.dependencyPreload = [
    {   
        type:'image',
        src: ["./public/page1/image/0_1.png",
        "./public/page1/image/0_2.png",
        "./public/page1/image/0_3.png",
        "./public/page1/image/0_4.png",
        "./public/page1/image/0_5.png",
        "./public/page1/image/0_6.png",
        "./public/page1/image/0_7.png",
        "./public/page1/image/0_8.png",
        "./public/page1/image/0_9.png",
        "./public/page1/image/0_71.png",
        "./public/page1/image/0_72.png"]
    },
    
    {
        type:'audio',
        src: [
                './public/page1/audio/page0.mp3',
                './public/page1/audio/page0.wav'
             ]
    
    }
];

concat.initalize();

concat.exchangeLoadingPage();