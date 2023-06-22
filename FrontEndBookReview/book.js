const url = new URL(location.href);
const bookId = url.searchParams.get("id");
const bookTitle = url.searchParams.get("title");

const API_URL = "https://backendbookreview.langningmtsw.repl.co/api/v1/reviews/";

const main = document.getElementById('section');
const titleElement = document.getElementById('title');

titleElement.innerText = `Book Title: ${bookTitle ? bookTitle : 'N/A'}`;

const div_new = document.createElement('div');
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="card">
        <h2><strong>New Review</strong></h2>
        <p><strong>Review: </strong>
        <input type="text" id="new_review" value="">
        </p>
        <p><strong>User: </strong>
        <input type="text" id="new_user" value="">
        </p>
        <p><a href="#" onclick="saveReview('new_review','new_user')">💾</a></p>
      </div>
    </div>
  </div>`;
main.appendChild(div_new);

returnReviews(API_URL, bookId);

function returnReviews(url, bookId) {
  fetch(url + "book/" + bookId)
    .then(res => res.json())
    .then(function (data) {
      console.log(data);
      data.forEach(review => {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card" id="${review._id}">
                <p><strong>Review: </strong>${review.review}</p>
                <p><strong>User: </strong>${review.user}</p>
                <p>
                  <a href="#" onclick="editReview('${review._id}','${review.review}','${review.user}')">✏️</a>
                  <a href="#" onclick="deleteReview('${review._id}')">🗑️</a>
                </p>
              </div>
            </div>
          </div>`;
        main.appendChild(div_card);
      });
    });
}

function editReview(id, review, user) {
  const element = document.getElementById(id);
  const reviewInputId = "review" + id;
  const userInputId = "user" + id;

  element.innerHTML = `
    <p><strong>Review:</strong>
    <input type="text" id="${reviewInputId}" value="${review}">
    </p>
    <p><strong>User:</strong>
    <input type="text" id="${userInputId}" value="${user}">
    </p>
    <p><a href="#" onclick="saveReview('${reviewInputId}','${userInputId}','${id}')">💾</a></p>`;
}

function saveReview(reviewInputId, userInputId, id = "") {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  if (id) {
    fetch(API_URL + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json,text/plain,*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        location.reload();
      });
  } else {
    fetch(API_URL + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json,text/plain,*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review, "bookId": bookId })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        location.reload();
      });
  }
}

function deleteReview(id) {
  fetch(API_URL + id, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      location.reload();
    });
}

function filterReviews() {
  const keyword = document.getElementById("filter_keyword").value.toLowerCase();
  const cards = document.getElementsByClassName("card");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const reviewText = card.getElementsByTagName("p")[0].innerText.toLowerCase();

    if (reviewText.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
}

function sortReviews() {
  const cards = Array.from(document.getElementsByClassName("card"));

  cards.sort((a, b) => {
    const reviewA = a.getElementsByTagName("p")[0].innerText.toLowerCase();
    const reviewB = b.getElementsByTagName("p")[0].innerText.toLowerCase();

    if (reviewA < reviewB) {
      return -1;
    }
    if (reviewA > reviewB) {
      return 1;
    }
    return 0;
  });

  const main = document.getElementById('section');
  main.innerHTML = "";

  cards.forEach(card => {
    main.appendChild(card);
  });
}
