package;

import js.html.*;

class Pen {

    public var painting:Painting;

    public var canvas(default, null):CanvasElement;
    var ctx:CanvasRenderingContext2D;

    public var size(default, null):Int = 8;
    public var color(default, null):String = 'black';
    public var cap(default, null):String = 'round';

    var isDrawing:Bool;

    public function new(painting:Painting) {
        this.painting = painting;
        canvas = painting.canvas;

        ctx = canvas.getContext2d();

        ///Before drawing apply
        applyPenSettings();

        //Add Listeners
        drawingEvent();
    }

    function drawingEvent():Void {

        //Pen Start
        canvas.addEventListener('mousedown', (e:MouseEvent) -> {
            if (isDrawing) return;

            var box = canvas.getBoundingClientRect();
            var x = box.x;
            var y = box.y;

            isDrawing = true;

            //Draw
            ctx.beginPath();
            ctx.moveTo(e.clientX - x, e.clientY - y);
        });

        //Pen Down
        canvas.addEventListener('mousemove', (e:MouseEvent) -> {
            if (!isDrawing) return;

            var box = canvas.getBoundingClientRect();
            var x = box.x;
            var y = box.y;

            ///draw
            ctx.lineTo(e.clientX - x, e.clientY - y);
            ctx.stroke();
        });

        ///Pen Up
        canvas.addEventListener('mouseup', (e:MouseEvent) -> {
            if (!isDrawing) return;

            isDrawing = false;
            ctx.closePath();

            painting.addStep();
        });
    }

    public function drawImage(img:Image, dx:Float = 0, dy:Float = 0):Void {
        ctx.drawImage(img, dx, dy);
    }

    public function setPenSize(size:Int):Void {
        this.size = size;

        applyPenSettings();
    }

    public function setPenColor(color:String):Void {
        this.color = color;

        applyPenSettings();
    }

    public function setPenCap(cap:String):Void {
        this.cap = cap;

        applyPenSettings();
    }

    function applyPenSettings():Void {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = cap;
    }
}