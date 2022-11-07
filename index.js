
let data = []
let count = 0;
let int;
function startFetching() {
  fetch("https://api.datacratie.cc/annotation/random")
    .then( r => r.json()) 
    .then((d) => {
      console.log(d)
      data = d;
      count = 0;
      renderItem(0)
      clearInterval(int);
      int = setInterval(() => {
        if(count >= data.length -1) {
          startFetching();
        }
        renderItem()
      }, 2000)
    })

}

function renderItem() {
  const el = data[count]
  let colorItems = ""
  if(el.colordata && el.colordata.colors) {
    el.colordata.colors.forEach((color) => {
      colorItems += `<div class="color" style="background: rgba(${color[0]}, ${color[1]}, ${color[2]}, 1);"></div>`
    })
  }   
  const htmlString =  `
  <div class="itemFromCollection">
    <div class="imageHolder">
      <img src="https://api.collectie.gent/iiif/imageiiif/3/${el.gentImageURI}/full/^1000,/0/default.jpg" />
    </div>  
    <div class="colors">
      ${colorItems}
    </div>
    <h1>AI: ${el.annotation}</h1>
    <p>${el.originalAnnotation}</p>
    
  </div> `
  count+=1;
  document.getElementById("renderTarget").innerHTML = htmlString;
}


startFetching();