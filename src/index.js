let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getAndRender();
  addEventListenerToForm();
  addClickListenerToToyCollectionDiv();
});

function getAndRender(){
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toys => renderToys(toys))
}

function renderToys(toysCollection){
  const toysBin = document.getElementById('toy-collection');
  for(let toy of toysCollection){
    //console.dir(toy);
    toysBin.appendChild(createToyElement(toy));
  }
}

function createToyElement(toyObject){
  //console.log("the toy Id from datyabase", toyObject.id);
  const card = document.createElement('div');
  card.classList.add("card");
  card.innerHTML = `<h2>${toyObject.name}</h2>
    <img src=${toyObject.image} class="toy-avatar"/>
    <p>${toyObject.likes} Likes</p>
    <button class="like-btn" data-toy-id=${toyObject.id}>Like &hearts;</button>`;
  return card;
}

function addEventListenerToForm(){
    const toyForm = document.querySelector('.add-toy-form')
    console.log(toyForm);
    toyForm.addEventListener('submit', function(e){
        //alert("Before preventing default");
        e.preventDefault()
        //alert("After preventing default");
        let name = toyForm.name.value
        let image = toyForm.image.value
        addToyToDb(name, image)
    })
}

function addToyToDb(name, image){
    fetch('http://localhost:3000/toys', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "image": image,
            "likes": 0})
          })
      .then(response => refresh())

 }

 function refresh(){
   const bin =  document.getElementById('toy-collection');
   bin.innerHTML="";
   getAndRender();
 }

function addClickListenerToToyCollectionDiv(){
  document.getElementById('toy-collection').addEventListener('click', function(e){
    if(e.target.matches('button.like-btn')){
      //debugger;
      console.dir(e.target.dataset.toyId);
      updateLikes(e.target.parentElement.querySelector('p'), e.target.dataset.toyId);
    }
  })
}

function updateLikes(likesP, toyID){
  let likes = parseInt(likesP.innerText.replace(' Likes',''));
  likesP.innerText = `${++likes} Likes`;
  updateToyLikesDb(likes, toyID);
}

function updateToyLikesDb(likes, toyID){
  //alert(toyID);
  fetch(`http://localhost:3000/toys/${toyID}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "likes": likes})
          })
      .then(response => console.log(response, "Updated it!!!!!!"))
}