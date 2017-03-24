var button = document.getElementById('image');

concat.dependencyEvent = [

    {
        ele:button,
        click:function(){
            concat.exchangePage(true);   
        }
    }

]

concat.initalize();