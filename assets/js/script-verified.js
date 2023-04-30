if(document.getElementById('donate-not')){
    $('#donate-not').click(function(e){
        e.preventDefault();
        new Noty({
            theme:'relax',
            text:"Please Verify your email first",
            type:"error",
            layout:"topRight",
            timeout:1500
        }).show()
    })
}

else if(document.getElementById('donate-not1')){
    $('#donate-not1').click(function(e){
        e.preventDefault();
        new Noty({
            theme:'relax',
            text:"Please Login to donate",
            type:"error",
            layout:"topRight",
            timeout:1500
        }).show()
    })
}


