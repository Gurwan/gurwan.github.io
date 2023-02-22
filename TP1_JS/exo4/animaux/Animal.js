class Animal {
  	constructor(specie) {
    	this.specie = specie;
  	}
  	get name() {
    	return this.name;
  	}

  	move(){
  		document.write("<p>Animal parent class. Move...</p>");
  	}

  	describe() {
    	console.log("This is an animal.");
  	}
}