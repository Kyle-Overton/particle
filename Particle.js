console.log("Particle is live");
class Particle {
    constructor(x, y, parent) {
        this.id = 0;
        this.tic = 0;
        //this.pos = createVector(defaultPos.x, defaultPos.y);
        this.pos = createVector(x, y)
        this.vel = p5.Vector.random2D();
        this.vel.mult(3);
        //this.vel = createVector(-1,1);
        //this.oldForce = new Force();
        //this.acc = new Force ();
        //this.attract = false;
        this.parent = parent
        this.targets = [];
        this.connectionIDs = [floor(random(defaultAmt))];
        this.connections = [];
        this.edges = [];
        this.canUpdate = true;
        this.canAttract = true;

        this.scale = 1 //random(.25, particleScale);
        this.size = particleSize * this.scale;
        this.color = particleColor;
        this.vecColor; // = createVector(0,random(127,255),random(127,255))
        this.newColorP = color(random(0, 127), random(75, 175), random(127, 255));
        this.newColorG = color(random(0, 127), random(127, 255), random(0, 127));
        this.newColorR = color(random(127, 255), random(0, 127), random(0, 127));
        this.draw();
        this.isColliding;
        this.collisionsDetected = 0;
        this.isDragging = false;
        this.constructedColliding = false;
        //this.r = this.size;
        this.m = this.size * 0.1;

    }
    style() {
        //this.color = particleColor;
        fill(this.color)

        if (this.scale > 1) {
            this.color = this.newColorP
            fill(this.color);
        }

        noStroke();
        this.size = particleSize * this.scale * particleScale;
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
        // style Children
        if (this.size > 1) {
            for (let p = 0; p < this.parent.collection.length; p++) {
                if (p != this.id) {
                    let particle = this.parent.collection[p]
                    for (let i = 0; i < particle.connectionIDs.length; i++) {
                        let targetID = particle.connectionIDs[i];
                        if (targetID == this.id) {
                            this.color = this.newColorP
                            particle.color = this.color;
                            particle.reStyle(particle);
                        }

                    }
                }

            }
        }
        /* Add Identifier
        textSize(this.size*.75);
        fill(255, 255, 255);
        text(this.id, this.pos.x-this.size/2, this.pos.y);
        */
    }
    reStyle(particle) {
        fill(particle.color)
        noStroke();
        particle.size = particleSize * particle.scale * particleScale;
        ellipse(particle.pos.x, particle.pos.y, particle.size, particle.size);
    }
    updateTargets() {
        for (let t = 0; t < this.parent.collection.length; t++) {
            if (t != this.id) {
                this.targets.push(this.parent.collection[t]);
                for (let s = 0; s < this.parent.collection[t].connectionIDs.length; s++) {
                    if (this.parent.collection[t].connectionIDs[s] == this.id) {
                        //console.log(this.parent.collection[t].connectionIDs[s].id)
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
            //console.log(end);
            let edge = new Edge(this, end);
            this.edges.push(edge);
            edge.draw();
        }
        //console.log(this.edges);
    }
    checkBounds() {
        let r = this.size / 2;
        if (this.pos.x > width - r) {
            this.pos.x = width - r;
            this.vel.x *= -1;
        } else if (this.pos.x < r) {
            this.pos.x = r;
            this.vel.x *= -1;
        } else if (this.pos.y > height - r) {
            this.pos.y = height - r;
            this.vel.y *= -1;
        } else if (this.pos.y < r) {
            this.pos.y = r;
            this.vel.y *= -1;
        }


    }
    precheckCollision() {
        let isColliding;
        let r = this.size / 2;
        this.collisionsDetected = 0;
        for (let t = 0; t < this.targets.length; t++) {
            let other = this.targets[t];
            // Get distances between the balls components
            let distanceVect = p5.Vector.sub(other.pos, this.pos);

            // Calculate magnitude of the vector separating the balls
            let distanceVectMag = distanceVect.mag();

            // Minimum distance before they are touching
            let minDistance = r + other.size / 2;

            if (distanceVectMag < minDistance) {
                this.collisionsDetected += 1;
            } 
        }
        if(this.collisionsDetected==0){
            isColliding = false;
            this.isColliding = false;
        }else{
            isColliding = true;
            this.isColliding = true;
        }
        return isColliding;
    }
    checkCollision() {
         
        let r = this.size / 2;
        for (let t = 0; t < this.targets.length; t++) {
            let other = this.targets[t];
            // Get distances between the balls components
            let distanceVect = p5.Vector.sub(other.pos, this.pos);

            // Calculate magnitude of the vector separating the balls
            let distanceVectMag = distanceVect.mag();

            // Minimum distance before they are touching
            let minDistance = r + other.size / 2;


            if (this.precheckCollision() && this.precheckCollision() != other.isColliding && distanceVectMag < minDistance) {

                this.collisionsDetected += 1;
                let distanceCorrection = (minDistance - distanceVectMag) / 2.0;
                let d = distanceVect.copy();
                let correctionVector = d.normalize().mult(distanceCorrection);
                other.pos.add(correctionVector);
                this.pos.sub(correctionVector);

                // get angle of distanceVect
                let theta = distanceVect.heading();
                // precalculate trig values
                let sine = sin(theta);
                let cosine = cos(theta);

                /* bTemp will hold rotated ball this.poss. You 
                 just need to worry about bTemp[1] this.pos*/
                let bTemp = [new p5.Vector(), new p5.Vector()];

                /* this ball's this.pos is relative to the other
                 so you can use the vector between them (bVect) as the 
                 reference point in the rotation expressions.
                 bTemp[0].this.pos.x and bTemp[0].this.pos.y will initialize
                 automatically to 0.0, which is what you want
                 since b[1] will rotate around b[0] */
                bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
                bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;

                // rotate Temporary velocities
                let vTemp = [new p5.Vector(), new p5.Vector()];

                vTemp[0].x = cosine * this.vel.x + sine * this.vel.y;
                vTemp[0].y = cosine * this.vel.y - sine * this.vel.x;
                vTemp[1].x = cosine * other.vel.x + sine * other.vel.y;
                vTemp[1].y = cosine * other.vel.y - sine * other.vel.x;

                /* Now that velocities are rotated, you can use 1D
                 conservation of momentum equations to calculate 
                 the final this.vel along the x-axis. */
                let vFinal = [new p5.Vector(), new p5.Vector()];

                // final rotated this.vel for b[0]
                vFinal[0].x =
                    ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) /
                    (this.m + other.m);
                vFinal[0].y = vTemp[0].y;

                // final rotated this.vel for b[0]
                vFinal[1].x =
                    ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) /
                    (this.m + other.m);
                vFinal[1].y = vTemp[1].y;

                // hack to avoid clumping
                bTemp[0].x += vFinal[0].x;
                bTemp[1].x += vFinal[1].x;

                /* Rotate ball this.poss and velocities back
                 Reverse signs in trig expressions to rotate 
                 in the opposite direction */
                // rotate balls
                let bFinal = [new p5.Vector(), new p5.Vector()];

                bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
                bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
                bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
                bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

                // update balls to screen this.pos
                other.pos.x = this.pos.x + bFinal[1].x;
                other.pos.y = this.pos.y + bFinal[1].y;

                this.pos.add(bFinal[0]);

                // update velocities
                this.vel.x = cosine * vFinal[0].x - sine * vFinal[0].y;
                this.vel.y = cosine * vFinal[0].y + sine * vFinal[0].x;
                other.vel.x = cosine * vFinal[1].x - sine * vFinal[1].y;
                other.vel.y = cosine * vFinal[1].y + sine * vFinal[1].x;
            }

        }
    }
    /*
    checkCollision() {
        if(this.collisionsDetected==0){
            this.isColliding = false;
        }
        for (let t = 0; t < this.targets.length; t++) {
            this.collisionsDetected = 0;
            let target = this.targets[t];
            let r = this.size / 2;
            let r2 = target.size / 2;
            this.isColliding = collideCircleCircleVector(this.pos, this.size, target.pos, target.size);
            let deltaY = abs(this.pos.y - target.pos.y)
            let deltaX = abs(this.pos.x - target.pos.x)
            UIElement.myConsole.html("particle " + this.id + " is colliding: " + this.isColliding);
            if (this.isColliding) {
                this.collisionsDetected += 1;
                if (deltaY >= deltaX) { //Top-Bottom
                    if (this.pos.y <= target.pos.y) { //Top
                        this.pos.y += -1 // -deltaY;
                        //this.vel.y *= -1
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
    */
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
        this.attract();
        this.checkCollision();
        this.drawConnections();
        this.reduceSpeed();
        this.interaction()
        this.pos.add(this.vel.limit(limitSpeed));


        //this.pos.add(this.vel);
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
        }
    }
    attract() {
        for (let c = 0; c < this.connections.length; c++) {
            let end = this.connections[c];
            if (this.tic>1 || this.isColliding) {
                this.canAttract = false;
            }else{
                this.canAttract = true;
                //this.tic -= ticAmnt/10
            }
            if (this.tic<0 || this.canAttract) {
                this.pos = p5.Vector.lerp(this.pos, end.pos, this.tic)
                //let d = p5.Vector.sub(this.pos, end.pos);
                //d.setMag(ticAmnt * d.mag())
                //this.pos.add(d);

                this.tic += ticAmnt/10
            }
        }

    }
    draw() {

        this.style();
        this.update();
    }
}