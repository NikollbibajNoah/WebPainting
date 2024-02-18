package;

import js.Browser;
import js.html.*;

class Painting {

    var js = Browser.document;

    public var canvas:CanvasElement;
    var width:Int = 600;
    var height:Int = 400;

    var pen:Pen;

    var cSteps:Array<String> = [];
    var maxStep:Int = 5;
    var cStep:Int = -1;

    public function new() {
        canvas = cast js.querySelector('.painting');

        initPainting();

        //Pick Color
        var colorpicker = js.querySelector('.colorpicker').children;

        for (i in colorpicker) {
            i.onclick = () -> {
                pen.setPenColor(i.innerText);
            }
        }

        ///change pen size
        var penSizeSlider:InputElement = cast js.getElementById('pensize');
        penSizeSlider.value = Std.string(pen.size);

        penSizeSlider.onchange = () -> {
            pen.setPenSize(Std.parseInt(penSizeSlider.value));
        }

        ///Save Export Painting
        var saveBtn = js.getElementById('save');

        saveBtn.onclick = () -> {
            ///url
            var url = canvas.toDataURL();

            var img = new Image(canvas.width, canvas.height);
            img.src = url;

            var download = saveBtn.children[0];
            download.setAttribute('download', 'untitled.jpg');
            download.setAttribute('href', url);
        }

        //Undo
        var undoBtn = js.getElementById('undo');
        undoBtn.onclick = () -> {
            undo();
        }

        //Redo
        var redoBtn = js.getElementById('redo');
        redoBtn.onclick = () -> {
            redo();
        }

        js.onkeydown = (e:KeyboardEvent) -> {
            if (e.keyCode == 90 && e.ctrlKey) {
                undo();
            }

            if (e.keyCode == 89 && e.ctrlKey) {
                redo();
            }
        }
    }

    function undo():Void {
        if (cStep > 0) {
            cStep--;

            var src = cSteps[cStep];

            var img = createImg(src);

            img.onload = () -> {
                pen.drawImage(img);
            }
        }
    }

    function redo():Void {
        if (cStep < cSteps.length - 1) {
            cStep++;

            var src = cSteps[cStep];

            var img = createImg(src);
            
            img.onload = () -> {
                pen.drawImage(img);
            }
        }
    }
    
    function initPainting():Void {
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext2d();

        ///White Space
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        pen = new Pen(this);

        addStep();
        
        ///Canvas Size
        var res = js.getElementById('canvasResolution').children[0];
        res.innerText = '${width}x${height}';
    }

    function createImg(src:String):Image {
        var img = new Image(width, height);
        img.src = src;
    
        return img;
    }

    public function addStep():Void {
        var img = canvas.toDataURL();

        cSteps.push(img);

        cStep++;
    }
}