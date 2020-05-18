const pixel_point = [
    ["현관", 46, 141],
    ["거실", 82, 202],
    ["발코니1", 105, 266],
    ["발코니2", 58, 42],
    ["발코니3", 205, 14],
    ["침실1", 190, 207],
    ["침실2", 60, 88],
    ["침실3", 207, 61],
    ["주방/식당", 130, 76],
    ["욕실1", 184, 130],
    ["욕실2", 230, 143]
];

function loadDrawingPoint(){
    var drawTarget = document.getElementById('div_drawing');
    
    //<div class="px-point"><div class="px-point-title"></div></div>
    
    for(var i=0; i<11; i++){
        var innerCode = '<div class="px-point" id="' + 'point'+i+'" value="'+ pixel_point[i][0]+'"><div class="px-point-title">'+pixel_point[i][0]+'</div></div>'
        
        drawTarget.innerHTML += innerCode;
        
        var pixelTarget = document.getElementById("point"+i);
        pixelTarget.style.left = pixel_point[i][1] + 'px';
        pixelTarget.style.top = pixel_point[i][2] + 'px';
    }
}