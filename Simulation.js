console.log("Simulator is live");
function setup() {
    createCanvas(500, 500);
    // Create object
    //particle = new Particle(random(width),random(height));
    UIElement = new UIElements();
    particles = new Particles()
    particles.createParticles(defaultAmt)
}
  
  function draw() {
    background(0);
    UIElement.updateVals();
    particles.draw();
  }