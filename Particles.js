console.log("Particles is live");
class Particles{
    constructor(){
        this.collection = [];
        this.hello = "hello"
    }
    createParticles(amt){
        for(let a=0; a<amt; a++){
            let particle = new Particle(random(particleSize,width-particleSize),random(particleSize,height-particleSize),this)
            particle.id = a;
            particle.size = random(25,50)
            //console.log(particle.checkCollision())
            particle.checkCollision();
            //console.log(particle.isColliding);
            while(particle.constructedColliding){  
                particle.pos = createVector(random(particleSize,width-particleSize))
                particle.checkCollision();
                console.log("detected collision")
            }
            this.collection.push(particle)
        }
        for(let p=0; p<amt; p++){
            this.collection[p].updateTargets();
            this.collection[p].updateConnections();
        }
    }
    updateForces(particle){
        particle.tic += ticAmnt;
        for(let t=0; t<this.collection.length;t++){
            let target = this.collection[t];
            particle.checkCollision(particle,target);
            particle.updateForce(particle,target);
            
        }
        particle.vel = p5.Vector.lerp(particle.vel,createVector(0,0),particle.tic);
        if(particle.tic > 1){
            //particle.vel = createVector(0,0);
            //particle.acc.force = createVector(0,0);
        }
    }
    draw(){
        for(let p=0; p<this.collection.length; p++){
            let particle = this.collection[p];
            
            //this.updateForces(particle);
            particle.draw();
            
            
        }
    }

}