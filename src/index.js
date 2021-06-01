//Initial Render
getAllDishes()

//Fetch Data
function getAllDishes(){
    fetch('http://localhost:3000/reviews')
    .then(res => res.json())
    .then(reviews => {
        fetch('http://localhost:3000/dishes')
        .then(res => res.json())
        .then(dishes => dishes.forEach(dish => renderOneDish(dish, reviews)))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
}

function updateLikes(likes, id){
    let likeData = {likes:likes}
    let configObj = {
        method: 'PATCH', 
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(likeData),
    }
    fetch(`http://localhost:3000/dishes/${id}`, configObj)
    .then(response => response.json())
    .then(dish => {
        let likes = document.querySelector(`.dish_likes-${dish.id}`)
        likes.textContent = dish.likes
        console.log(dish)
    })
    .catch(error => console.error('ERROR:', error))
}

function postReview(body, dishId){
    let configObj = {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "body": body, "dishId": dishId }),
    }
    fetch('http://localhost:3000/reviews', configObj)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('ERROR:', error))
}

//Dom Manipulation
function renderOneDish(dish, reviews){
    const card = document.createElement('li')
    card.id = dish.id
    card.innerHTML = `
        <h2>${dish.name}</h2>
        <img src="${dish.image}" width="240" height="240">
        <div class="likes-section">
            <span class="dish_likes-${dish.id}">${dish.likes}</span>
            <button id="like-button-${dish.id}">♥ Likes</button>
        </div>
        <br />
        <form id="create-review-form-${dish.id}" action="#" method="post">
            <label for="newReview">Input:</label>
            <input type="text" id="new-review-${dish.id}" name="newReview" placeholder="Leave review here...">
            <input type="submit" value="Post">
        </form>
  
        <div id="list-${dish.id}">
            <h3>Reviews</h3>
            <ul id="reviews-${dish.id}">
            </ul>
        </div>
    `;
    
    document.querySelector("#dish-list").append(card)

    let reviewsContainer = document.querySelector(`#reviews-${dish.id}`)
    reviews.forEach( review => {
        if (review.dishId === dish.id) {
            let list = document.createElement('li');
        list.textContent = review.body;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "X";
    
        list.appendChild(deleteBtn);
  
        deleteBtn.addEventListener('click', () => list.remove());
        reviewsContainer.appendChild(list);
        }
    })

    let btn = document.querySelector(`#like-button-${dish.id}`)
    btn.addEventListener('click', (e) => increaseLikes(e, dish))

    let reviewForm = document.querySelector(`#create-review-form-${dish.id}`)
    reviewForm.addEventListener('submit', (e) => handleSubmit(e, dish))
}

//Handlers
function increaseLikes(e, dish) {
    let currentLikes = parseInt(e.target.previousElementSibling.textContent)+1
    updateLikes(currentLikes, dish.id)
}


function handleSubmit(e, dish){
    e.preventDefault();
    console.log(e.target[`new-review-${dish.id}`].value);

    let list = document.createElement('li');
    let body = e.target[`new-review-${dish.id}`].value;
    list.textContent = body;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "X";
  
    let toDoList = document.querySelector(`#list-${dish.id}`);
    list.appendChild(deleteBtn);
    toDoList.appendChild(list);
  
  deleteBtn.addEventListener('click', () => list.remove());
  e.target[`new-review-${dish.id}`].value="";

  postReview(body, dish.id);
  }