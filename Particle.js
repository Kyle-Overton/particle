console.log("Particle is live");
class Particle {
    constructor(x, y, parent) {
        this.id = 0;
        this.tic = 0;
        //this.pos = createVector(defaultPos.x, defaultPos.y);
        this.pos = createVector(x, y)
        this.vel = createVector(random(-1, 1), random(-1, 1));
        //this.vel = createVector(-1,1);
        //this.oldForce = new Force();
        //this.acc = new Force ();
        //this.attract = false;
        this.parent = parent
        this.targets = [];
        this.connectionIDs = [floor(random(50))];
        this.connections = [];
        this.edges = [];
        this.canUpdate = true;
        this.canAttract = true;
        this.size = particleSize;
        this.scale = 1//random(.25, particleScale);
        this.color = particleColor;
        this.draw();
        this.isColliding;
        this.isDragging = false;
        this.constructedColliding = false;

    }
    style() {
        //this.color = particleColor;
        fill(this.color)
        if (this.id == 25) {
            fill(color(0, 0, 255));
        }
        noStroke();
        this.size = particleSize * this.scale * particleScale;
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
    updateTargets() {
        for (let t = 0; t < this.parent.collection.length; t++) {
            if (t != this.id) {
                this.targets.push(this.parent.collection[t]);
                for(let s=0; s<this.parent.collection[t].connectionIDs.length; s++){
                    if(this.parent.collection[t].connectionIDs[s] == this.id){
                        console.log(this.parent.collection[t].connectionIDs[s].id)
                        this.scale += 1;
                    }
                }
            }
        }
    }
    updateConnections() {
        for (let t = 0; t < this.parent.collection.length; t++) {

                for (let c = 0; c < this.connectionIDs.length; c++) {
                    if (this.parent.collection[t].id == this.connectionIDs[c]) {
                        this.connections.push(this.parent.collection[t]);
                    }
                }
            
        }
        for (let c = 0; c < this.connections.length; c++) {
            let end = this.connections[c];
            console.log(end);
            let edge = new Edge(this, end);
            this.edges.push(edge);
            edge.draw();
        }
        console.log(this.edges);
    }
    checkBounds() {

        //Left
        if (this.pos.x < this.size * 2) {
            this.pos.x = this.size * 2;
            this.vel.x *= -1
        }
        //Right
        if (this.pos.x > width - this.size * 2) {
            this.pos.x = width - this.size * 2;
            this.vel.x *= -1;
        }
        //Bottom
        if (this.pos.y > height - this.size * 2) {
            this.pos.y = height - this.size * 2
            this.vel.y *= -1
        }

        //Top
        if (this.pos.y < this.size * 2) {
            this.pos.y = this.size * 2
            this.vel.y *= -1;
        }


    }
    checkCollision() {
        for (let t = 0; t < this.targets.length; t++) {
            let target = this.targets[t];
            this.isColliding = collideCircleCircleVector(this.pos, this.size * 2, target.pos, target.size * 2);
            let deltaY = abs(this.pos.y - target.pos.y)
            let deltaX = abs(this.pos.x - target.pos.x)
            if (this.isColliding) {
                if (deltaY >= deltaX) { //Top-Bottom
                    if (this.pos.y <= target.pos.y) { //Top
                        this.pos.y += -1 // -deltaY;
                        this.vel.y *= -1
                    }
                    if (this.pos.y > target.pos.y) { //Bottom
                        this.pos.y += 1 //deltaY
                        this.vel.y *= -1
                    }
                } else {
                    if (this.pos.x <= target.pos.x) { //Left
                        this.pos.x += -1 //-deltaY
                        this.vel.x *= -1
                    }
                    if (this.pos.x > target.pos.x) { //Right
                        this.pos.x += 1 //deltaY 
                        this.vel.x *= -1
                    }
                }
            }
        }
    }
    reduceSpeed() {
        if (this.vel.mag() > 0.1) {
            this.vel.setMag(this.vel.mag() * .99);
        } else {
            this.vel.setMag(0);
        }
    }
    updateForce(self, target) {

        let incrementForce = this.oldForce.updateMag(self, target)
        this.acc.force.add(incrementForce);
    }
    update() {
        this.checkBounds();
        this.checkCollision();
        this.interaction()
        this.reduceSpeed();
        this.pos.add(this.vel);
    }
    interaction() {
        if (this.isDragging) {
            let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
            if (d < this.size) {
                //console.log(this)
                this.pos.x = mouseX;
                this.pos.y = mouseY;
                this.color = color(255, 0, 0)

                this.isDragging = true;
            }
        }
        //this.isDragging = false;
        //this.color = particleColor;
    }
    drawConnections() {
        for (let c = 0; c < this.connections.length; c++) {
            let end = this.connections[c];
            this.edges[c].update(this, end);
            stroke(255);
            this.edges[c].draw();
            this.attract(end);
        }
    }
    attract(end){
        if(this.canAttract){
            this.pos = p5.Vector.lerp(this.pos,end.pos,this.tic)
            this.tic += ticAmnt
        }
        if(this.tic > 1){
            this.canAttract = false;
        }
    }
    draw() {
        this.drawConnections();
        this.style();
        this.update();
    }
}