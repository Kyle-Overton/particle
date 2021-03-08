console.log("Force is live");
class Force{
    constructor(){
        this.force = createVector(0,0)
        this.dsquared = 0
        this.dsquared = 0
        this.strength = 0
        this.G = G;
        this.force.setMag(this.strength);
    }
    updateMag(self,target){
       // let d = p5.Vector.sub(target.pos,self.pos).mag();
        this.force = p5.Vector.sub(target.pos,self.pos);
        this.dsquared = this.force.magSq() +.001
        this.dsquared = constrain(this.dsquared,minConstrain,maxConstrain)
        this.strength = this.G/this.dsquared;
        this.force.setMag(this.strength);
           
        
        return this.force; 
    }
}
