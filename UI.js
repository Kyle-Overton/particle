class UIElements{
    constructor(){
        this.pScaleSlider = select('#particleScale');
        this.pScaleSlider.value(map(1,.5,2,1,100));
        this.Gravity = select('#Gravity');
        this.Gravity.value(map(particleSize,25,50,1,100))
        this.Tic = select('#tic');
        this.Tic.value(map(.005,.001,.01,1,100))

 
    }
    updateVals(){
        particleScale = map(this.pScaleSlider.value(),1,100,.5,2);
        G = map(this.Gravity.value(),1,100,1,particleSize);
        ticAmnt = map(this.Tic.value(),1,100,.001,.01);
        
    }
}