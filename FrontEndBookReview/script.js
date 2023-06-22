
const URL = 'https://www.googleapis.com/books/v1/volumes?q=search+terms';
const main = document.getElementById("section");

returnBooks(URL);

function returnBooks(url) {
  var placeHolder = '<img src="https://via.placeholder.com/150">';
   
  fetch(url)
    .then(res => res.json())
    .then(function (data) {
      console.log(data.items);
      data.items.forEach(element => {
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');
        const div_column = document.createElement('div');
        div_column.setAttribute('class', 'column');
        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.setAttribute('id', 'image');
        const title = document.createElement('h3');
        title.setAttribute('id', 'title');
        const center = document.createElement('center');
        
        title.innerHTML = `${element.volumeInfo.title}<br>
<a href="book.html?id=${element.volumeInfo.id}&title=${element.volumeInfo.title}">Reviews</a><br>
<a target="_blank" href="${element.volumeInfo.previewLink}" class="btn btn-secondary">Read</a>`;

        image.src = element.volumeInfo.imageLinks ? element.volumeInfo.imageLinks.thumbnail : placeHolder;

        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        main.appendChild(div_row);
      });
    });
}

$(document).ready(function () {
  var item, title, author, publisher, bookLink, bookImg;
  var outputList = document.getElementById("list-output");
  var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
  var placeHolder = '<img src="https://via.placeholder.com/150">';
  var searchData;

  $("#search").click(function () {
    outputList.innerHTML = "";
    document.body.style.backgroundImage = "url('')";
    searchData = $("#search-box").val();
    if (searchData === "" || searchData === null) {
      displayError();
    } else {
      $.ajax({
        url: bookUrl + searchData,
        dataType: "json",
        success: function (response) {
          console.log(response);
          if (response.totalItems === 0) {
            alert("No results! Please try again.");
          } else {
            $("#title").animate({ 'margin-top': '5px' }, 1000);
            $(".book-list").css("visibility", "visible");
            displayResults(response);
          }
        },
        error: function () {
          alert("Something went wrong... Please try again.");
        }
      });
    }
    $("#search-box").val("");
  });

  function displayResults(response) {
    var items = response.items;
    var html = "";
    for (var i = 0; i < items.length; i += 2) {
      var item1 = items[i];
      var item2 = items[i + 1];

      var book1 = getBookDetails(item1);
      var book2 = getBookDetails(item2);

      html += `<div class="row mt-4">
        <div class="col-lg-6">${book1}</div>
        <div class="col-lg-6">${book2}</div>
      </div>`;
    }

    outputList.innerHTML = html;
  }

  function getBookDetails(item) {
    if (!item) {
      return "";
    }

    var title = item.volumeInfo.title || "N/A";
    var authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "N/A";
    var publisher = item.volumeInfo.publisher || "N/A";
    var bookLink = item.volumeInfo.previewLink || "#";
    var bookImg = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : placeHolder;
    var Id=item.volumeInfo.id

    var html = `<div class="card mb-3">
      <div class="row no-gutters">
        <div class="col-md-4">
          <img src="${bookImg}" class="card-img" alt="Book Cover">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">Author: ${authors}</p>
            <p class="card-text">Publisher: ${publisher}</p>
            <a target="_blank" href="${bookLink}" class="btn btn-secondary">Read</a>
            <a target="_blank" href="book.html?id=${Id}&title=${title}" class="btn btn-secondary">Reviews</a>
          </div>
        </div>
      </div>
    </div>`;

    return html;
  }
});
