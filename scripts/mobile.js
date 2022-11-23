import Vis from "./Viz.js";
import { 
  generateUUID,
  imageURIGenerator,
} from "./helpers.js";


let data = []
let int;
let worker = null;

const visualisation = new Vis();


function init() { 
  // console.log(getCookie("worker"))
  // if(getCookie("worker").length  <5) {
  //   const uuid = generateUUID()
  //   setCookie("worker", generateUUID())
  // }
  // else {
  //   worker = getCookie("worker")
  // }

  worker = generateUUID()
}
function startFetching() {
  fetch("https://api.datacratie.cc/annotation/random")
    .then( r => r.json()) 
    .then((d) => {
      console.log(d)
      d.forEach((item, key) => {
        data.push(item);
      })
      renderItem();
    })
}

async function renderLoop() {
  data.shift()
  if(data.length < 5) {
    await startFetching()
  } else {
    renderItem();
  }
}

function vote(approved) {
  fetch("https://api.datacratie.cc/approvals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        originID: data[0].originID,
        annotationUUID: data[0].id,
        workerID: worker,
        collection: data[0].collection,
        approved: approved
      })
    })
    .then(r => r.json())
    .then((data) => {
      visualisation.getReviewedItems();
      renderLoop();
    })
    .catch((error) => {
      console.error(error);
      renderLoop();
    })
}
function addEventListeners() {
  document.getElementById("dap").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("disapproved")
    vote(false);
  })
  document.getElementById("ap").addEventListener("click", (e) => {
    e.preventDefault();
    vote(true);

  })
}

function renderItem() {
  const el = data[0]
  let colorItems = ""
  if(el.colordata && el.colordata.colors) {
    el.colordata.colors.forEach((color) => {
      colorItems += `<div class="color" style="background: rgba(${color[0]}, ${color[1]}, ${color[2]}, 1);"></div>`
    })
  }   
  const htmlString =  `
  <div class="itemFromCollection">
    <div class="imageHolder">
      <img class="u-max-full-width" id="currentImage" src="${imageURIGenerator(el.gentImageURI, true)}" />
    </div>  
    <div class="colors">
      ${colorItems}
    </div>
    <h1 class="marking"><mark>${el.annotation}</mark></h1>

    
  </div> `
  document.getElementById("renderTarget").innerHTML = htmlString;

  setTimeout(() => {
    document.getElementById("currentImage").src = imageURIGenerator(el.gentImageURI, false, true)
  }, 1000)
}

init();
renderLoop()
addEventListeners();