var button = document.getElementById('changePage');

concat.dependencyPreload =[
    {
        type:'img',
        src:[
            './public/page2/image/1_1.png',
            './public/page2/image/1_2.png',
            './public/page2/image/1_3.png',
            './public/page2/image/1_4.png',
            './public/page2/image/1_5.png',
            './public/page2/image/1_6.png'
            ]
    },
    {
        type:'aud',
        src:[
            './public/page2/audio/page1.mp3',
            './public/page2/audio/page1.wav'
        ]
    }
];

concat.dependencyEvent = [
    {
        'ele':button,
        'click':function(){
            concat.exchangePage(true, 'transition:all 0.5s ease-out;opacity:0;', 1000);   
        }
    }
];

concat.initalize();