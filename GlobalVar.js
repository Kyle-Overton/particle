console.log("GlobalVar is Live")
let particles;
let particleSize;
let particleScale;
let particleColor;
let particle;
let defaultPos;
let defaultAmt;
let G;
let UIElement;
let minConstrain;
let maxConstrain;
let frictionStrength;
let ticAmnt;
let limitSpeed;
let edgeStroke;

function preload(){
    defaultAmt = 50;
    particleSize = 10//random(25,50);
    particleScale = 1;
    particleColor = color(255,255,255,250);
    //stroke(255,255,255);
    defaultPos = createVector(250,250);
    limitSpeed = 1.2
    G = particleSize;
    minConstrain = particleSize;
    maxConstrain = 2*particleSize;
    frictionStrength = .001;
    ticAmnt = .0005;
}
