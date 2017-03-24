var button = document.getElementById('changePage');

concat.dependencyPreload =[
    {
        type:'img',
        src:[
            '../page3/image/1_1.png',
            '../page3/image/1_2.png',
            '../page3/image/1_3.png',
            '../page3/image/1_4.png',
            '../page3/image/1_5.png',
            '../page3/image/1_6.png'
            ]
    },
    {
        type:'aud',
        src:[
            '../page3/audio/page1.mp3',
            '../page3/audio/page1.wav'
        ]
    }
];

concat.dependencyEvent = [

    {
        ele:button,
        click:function(){
            concat.exchangePage(true);   
        }
    }

]

concat.initalize();