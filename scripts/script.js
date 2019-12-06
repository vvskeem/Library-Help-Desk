//  const API = "https://library-sa.herokuapp.com"
const API = "http://localhost:3000"

$("body").on("click", "#dbBtn", function (event) {
    // get the user input value
    event.preventDefault()
    let user_search = $("#user_text").val()

    // clear the search bar
    $("#user_text").val("")

    // search for the user input value
    // localhost:3000/search?term=user_search
    // whatever we get, console log
    let searchUrl = API + "/search?term=" + user_search;
    $.get(searchUrl, function (response) {
        createBookCards(response.books)
    })
})

// Make a request to our GET /authors route and console.log the results
let authorUrl = API + "/authors"
$.get(authorUrl, function (response) {
    console.log(response)
    let data = response.result

    // Build cards for each other in the response
    // Each card will have the following
    // an image for the avatar
    // the author full name
    // the bio

    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let name = element.firstName + " " + element.lastName
        let bio = element.bio
        let avatar = element.avatar

        let card = $("<div>").attr({
            authorId: element.id,
            class: "card custom_card author_card"
        })

        if (avatar === null) {
            let rand = Math.floor(Math.random() * 10);
            avatar = `https://avatars.dicebear.com/v2/human/${rand}.svg`
        }

        let avatarContainer = $("<div>")
        let avatarImg = $("<img>").attr({
            authorId: element.id,
            class: "avatar",
            src: avatar
        })
        avatarContainer.append(avatarImg)

        let authorInfo = $("<div>").addClass("author_info_container")

        let authorName = $("<p>").attr({
            authorId: element.id,
        }).addClass("author_name").html(name);

        let authorBio = $("<p>").attr({
            authorId: element.id,
        }).addClass("author_bio").html(bio);

        let btnAddBook = $("<button>").html("Add Book").addClass("btn btn-info add_book_btn").attr({
            author_id: element.id
        })

        let btnDeleteAuthor = $("<button>").html("Remove Author").addClass("btn delete-authors-btn btn-danger").attr({
            author_id: element.id
        })

        authorInfo.append([authorName, authorBio]);

        card.append([avatarContainer, authorInfo, btnAddBook, btnDeleteAuthor])

        $("#card__contain").append(card)
    }
})

// create search ussing ?term= 
$("body").on("submit", "#add_book_form", (event) => {
    event.preventDefault()
    //get the values from the input feilds
    let title = $("#title").val()

    let isbn = $("#isbn").val()
    let author_id = $("#submit_btn").attr("author_id")

    //send this off to the database
    $.post(API + "/books", {
        title,
        isbn,
        author_id
    }, function (response) {


        createAlert("#add_book_form");
        if (response.success) {
            $("#isbn").val("")
            $("#title").val("")

            $("#alert").addClass("alert-success")
            $("#alertmsg").text(response.success)

        } else {
            $("#alert").addClass("alert-danger")
            $("#alertmsg").text(response.error)
        }


        console.log(response)
    })
})
// 
$("body").on("submit", "#searchForm", (event) => {

    let bookUrl = API + "/search"
    $.search(bookUrl, function (response) {
        event.preventDefault()
        let data = response.results

        let search = $("#searchForm").val()

        createBookCards(search)
    })

})

// When an author card is clicked, go get the books written by that author and console log them
$("body").on("click", "#card__contain", function (event) {

    let target = $(event.target)
    let authorId = target.attr("authorId")

    let authorBooksUrl = API + `/books/${authorId}`

    $.get(authorBooksUrl, function (response) {
        let data = response.result
        createBookCards(data)
    })
})

// delete a book when this button is clicked
// $.ajax({
//     url,
//     type: 'DELETE'/"PUT",
//     success: (result) => {
//         console.log(result)
//     }
// });
$("body").on("click", ".delete-book-btn", (event) => {
    let bookId = $(event.target).attr("bookId")
    let url = API + `/books/${bookId}`
    $.ajax({
        url,
        type: 'DELETE',
        success: (results) => {
            console.log(results)
            if (results.success) {
                $(event.target).parent().hide()
            }
        }
    });
})

function createBookCards(books) {
    // Clear the books first
    $('#books').empty();
    if (books === undefined) {
        return
    }

    // loop over the books array
    // Create a book card for each of them
    for (let index = 0; index < books.length; index++) {
        const element = books[index];
        let {
            id,
            title,
            isbn,
            author_id
        } = element

        let deleteBtn = $("<button>").attr({
            bookId: id,
            class: "btn btn-danger delete-btn delete-book-btn"
        }).html("Delete")
        let card = $("<div>").addClass("card custom_card book_card");
        title = $('<p>').html(title)
        $(card).append([title, deleteBtn])
        $('#books').append(card)
    }
}

// GOAL - when button is clicked create new form
// create a on click event for when the user clicks addBookBtn
$("body").on("click", ".add_book_btn", function (event) {
    let authorid = $(event.target).attr("author_id")

    let formTemplate = $(`<form id="add_book_form" style="width:100%">
    <div class="form-group">
      <label for="title">Book Title</label>
      <input type="text" class="form-control" id="title" minlength="1" maxlength="100" placeholder="Enter title" required="false">
    </div>
    <div class="form-group">
      <label for="isbn">Book ISBN Number</label>
      <input type="text" class="form-control" id="isbn" placeholder="Enter ISBN" minlength="13" maxlength="13" required>
    </div>
    <div class="form-group">
    <input type="submit" author_id=${authorid} class="form-control" id="submit_btn" placeholder="Enter ISBN" minlength="13" maxlength="13">
  </div>
  </form>`)


    // append it to the author card
    let authorCard = $(event.target).parent()

    authorCard.append(formTemplate)
})

// create a book when the user clicks the Add Book btn
$("body").on("submit", "#add_book_form", (event) => {
    event.preventDefault()
    //get the values from the input feilds
    let title = $("#title").val()

    let isbn = $("#isbn").val()
    let author_id = $("#submit_btn").attr("author_id")

    //send this off to the database
    $.post(API + "/books", {
        title,
        isbn,
        author_id
    }, function (response) {


        createAlert("#add_book_form");
        if (response.success) {
            $("#isbn").val("")
            $("#title").val("")

            $("#alert").addClass("alert-success")
            $("#alertmsg").text(response.success)

        } else {
            $("#alert").addClass("alert-danger")
            $("#alertmsg").text(response.error)
        }


        console.log(response)
    })
})

function createAlert(alertContainer) {
    let alert = $(`<div id="alert" class="alert alert-dismissible fade show" role="alert">
    <p id="alertmsg"></p>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`)

    $(alertContainer).prepend(alert)
}

// GOAL - create new author form
// create a on click event for when the user clicks author-btn
$("body").on("click", ".author-btn", function (event) {

    let formTemplate = $(`<form id="add_author_form">
    <div class="form-group">
      <label for="Author first Name">First name</label>
      <input type="text" class="form-control" id="firstName" minlength="1" maxlength="100" placeholder="Enter first name" required>
    </div>
    <div class="form-group">
      <label for="Author Last Name">Last name</label>
      <input type="text" class="form-control" id="lastName" minlength="1" maxlength="100" placeholder="Enter last name" required>
    </div>
    <div class="form-group">
      <label for="bio">Bio</label>
      <input type="text" class="form-control" id="bio" placeholder="Short Bio" minlength="1" maxlength="250" required>
    </div>
    <div class="form-group">
      <label for="avatar">Bio</label>
      <input type="text" class="form-control" id="avatar" placeholder="Enter image url" minlength="1" maxlength="50" required>
    </div>
    <div class="form-group">
    <input type="submit" class="form-control" id="submit_btn" placeholder="Submit" minlength="1" maxlength="">
  </div>
  </form>`)


    // append it to the author card
    let addAuthorbutton = $(event.target).parent()

    addAuthorbutton.append(formTemplate)


})

// create a author when the user clicks the Add Author btn
$("body").on("submit", "#add_author_form", (event) => {

    event.preventDefault()
    //get the values from the input feilds
    let firstName = $("#firstName").val()
    let lastName = $("#lastName").val()
    let bio = $("#bio").val()
    let avatar = $("#avatar").val()

    //send this off to the database
    $.post(API + "/authors", {
        firstName,
        lastName,
        bio,
        avatar
    }, function (response) {

        createAlert("#add_author_form");
        if (response.success) {
            $("#firstName").val("")
            $("#lastName").val("")
            $("#bio").val("")
            $("#avatar").val("")

            $("#alert").addClass("alert-success")
            $("#alertmsg").text(response.success)

        } else {
            $("#alert").addClass("alert-danger")
            $("#alertmsg").text(response.error)
        }

    })
})

// delete a author when the user clicks the delete Author btn
$("body").on("click", ".delete-authors-btn", (event) => {
    let authorId = $(event.target).attr("author_id")
    let url = API + `/authors/${authorId}`
    $.ajax({
        url,
        type: 'DELETE',
        success: (result) => {
            console.log(result)
            if (result.success) {
                $(event.target).parent().hide()
            }
        }
    });
})