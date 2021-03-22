console.log("Interaction is live");
function mousePressed(){
    //console.log("mousePressed")
    for(let p = 0; p<particles.collection.length; p++){
        particle = particles.collection[p];
        let d = dist(mouseX,mouseY,particle.pos.x,particle.pos.y);
        if(d<particle.size/2){
            particle.isDragging = true;
        }
    } 
}
function mouseReleased(){
    //console.log("mouseReleased")
    for(let p = 0; p<particles.collection.length; p++){
        particle = particles.collection[p];
        particle.isDragging = false;
        particle.color = particleColor;
    } 
}