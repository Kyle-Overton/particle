console.log("Edge is live");
class Edge{
    constructor(start,end){
        this.start = createVector(start.pos.x,start.pos.y)
        this.end = createVector(end.pos.x,end.pos.y)
        this.b1 = createVector(this.end.x,this.start.y)
        this.b2 = this.b1
        //this.stroke = edgeStroke;
        this.edge;
    }
    style(){
        
    }
    update(start,end){
        this.start = createVector(start.pos.x,start.pos.y)
        this.end = createVector(end.pos.x,end.pos.y)
        this.b1 = createVector(this.end.x,this.start.y)
        this.b2 = this.b1
    }
    draw(){
        stroke(255,255,255,125);
        noFill();
        //console.log("I'm drawing")
        bezier(this.start.x,
                this.start.y,
                this.b1.x,
                this.b1.y,
                this.b2.x,
                this.b2.y,
                this.end.x,
                this.end.y)
    }
}