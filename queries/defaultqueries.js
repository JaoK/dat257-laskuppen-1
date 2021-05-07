const { request, response } = require("express");
const fetch = require("node-fetch");

if (!process.env.DATABASE_URL) {
  require("dotenv").config();
}

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

const hasSession = (request, response) => {
  if (request.session.isLoggedIn && request.session.isLoggedIn == true) {
    return true;
  }
  else {
    console.log("NOT LOGGED IN")
    response.status(400).json(errorMsg("No session. Please log in."));
    return false;
  }
}

//Terminate session
const logout = (request, response) => {
  request.session.destroy();
  response.status(200).send(true);
}

//Login user by mail and password matching
const login = (request, response) => {

  const mail = request.body.mail;
  const password = request.body.password;

  client.query(
    "SELECT * FROM users where mail=$1 AND password=$2",
    [mail, password],
    (error, result) => {
      if (error) {
        response.status(500).send(errorMsg("Internal server error"));
      }
      else if (result.rows.length === 1) { // SUCCESS LOGIN

        request.session.isLoggedIn = true;
        request.session.userId = result.rows[0].id;
        request.session.role = result.rows[0].roleid;
        request.session.name = result.rows[0].firstname + " " + result.rows[0].lastname;
        console.log("SESSION SET")

        response.status(200).send(true);
      }
      else {
        console.log("SESSION DESTROY")
        request.session.destroy();
        response.status(400).send(errorMsg("Wrong credentials"));
      }
    }
  );
}

const getSession = (request, response) => {
  const session = {
    login: request.session.isLoggedIn === true,
    id: request.session.userId,
    role: request.session.role,
    name: request.session.name
  }
  response.status(200).send(session);
}

// gets the books id to identify book, params finds id in the key it is placed, makes so you don't need to specify key.
const getBook = (request, response) => {
  if (!hasSession(request, response)) {
    return;
  }

  let id = request.params.id

  client.query("select * from Book where id = $1", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    else {
      response.status(200).json(results.rows)
    }
  })
}

//Get all the existing users
const getUsers = (request, response) => {
  if (!hasSession(request, response)) {
    return;
  }

  client.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    } else {
      response.status(200).json(results.rows);
    }
  });
};

// each review from a user.
const getUserReviews = (request, response) => {
  let uid = request.session.userId
  client.query("SELECT review.id AS rid, bookid, thumbnail, accepted, published, worthReading, rating, summary, title, author, pages FROM Review LEFT JOIN Book ON bookid=Book.id LEFT JOIN Users ON Users.id = writtenby WHERE Users.id = $1", [uid], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    response.status(200).json(results.rows);
  });
};

// Query to get all the reviewed books in the database
//With the possibility to apply filters and searches for books
const reviewedBooks = (request, response) => {

  if (!hasSession(request, response)) {
    return;
  }
  //The accepted filters
  const filters = ["grade", "title", "pages", "author"]
  const orders = ["asc", "desc"];

  let filter = request.query.filter
  //String formatting
  let search = '%' + request.query.search + '%'
  search = search.toLowerCase()
  let order = orders[1]

  //Orders on asc for title and author as Z > A
  if (filter == "title" || filter == "author") {
    order = orders[0]
  }

  //checks that the filter is ok and not a bad input
  if (escape(filter, filters)) {
    client.query("SELECT * from booksRead where translate(lower(title),'?!_,','') like $1 OR lower(author) like $1 order by " + filter + " " + order, [search], (error, results) => {
      if (error) {
        response.status(500).send(errorMsg("Internal server error"));
      } else {
        response.status(200).json(results.rows);
      }
    });
  }
};

const getUserId = (request) => {
  return parseInt(request.session.userId);
}

// each published review of a specific book.
const getReview = (request, response) => {
  let id = request.params.id
  client.query("SELECT review.id AS rid, firstName || ' ' || lastName AS name, bookid, accepted, published, rating, summary, title, author, pages FROM Review LEFT JOIN Book ON bookid=Book.id LEFT JOIN Users ON Users.id = writtenby WHERE Book.id = $1 AND published=true", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    response.status(200).json(results.rows);
  });
};

// get points of specific user.
const getUserPoints = (request, response) => {
  if (!hasSession(request, response)) {
    return;
  }
  const id = getUserId(request);

  client.query("SELECT * FROM allStudPoints WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const deleteUser = (request, response) => {
  if (!hasSession(request, response)) {
    return;
  }
  const id = parseInt(request.params.id);

  client.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    } else {
      response.status(200).send(`User deleted with ID: ${id}`);
    }
  });
};

function escape(input, match) {

  if (match.includes(input.toLowerCase())) {
    return true;
  }
  return false;
}

function errorMsg(text) {
  return { error: text };
}

module.exports = {
  getUsers,
  getUserPoints,
  deleteUser,
  login,
  getSession,
  logout,
  reviewedBooks,
  getBook,
  getReview,
  getUserReviews
}
