const { request, response } = require("express");
const fetch = require("node-fetch");
const { client, hasSession, errorMsg, escape, getUserId } = require("./utils")


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

        response.status(200).send(true);
      }
      else {
        request.session.destroy();
        response.status(400).send(errorMsg("Wrong credentials"));
      }
    }
  );
}


//Login user by mail and password matching
const register = (request, response) => {

  const mail = request.body.mail;
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const className = request.body.className;
  const password = request.body.password;
  const password2 = request.body.password2;
  var role = 1;
  var classid = 0;

  
  if(password != password2){
    response.status(400).send(errorMsg("Missmatch password"));
    return;
  }

  if(mail.includes("elev.ga.ntig.se")){
    role = 1;
  }
  else if(mail.includes("ntig.se")){
    role = 2;
    classid = 1;
  }
  else{
    response.status(400).send(errorMsg("Wrong mail"));
    return;
  }

  classes = ['IT21A','IT20A','IT19A',
  'MA21B','MA20B','MA19B', 
  'TE21C','TE21D','TE20C','TE20D','TE19C','TE19D', 
  'NA21E','NA20E','NA19E', 
  'EK21F','EK21G','EK20F','EK20G','EK19F'];

  if(!classes.includes(className.toUpperCase()) && classid == 0){
    response.status(400).send(errorMsg("Wrong class"));
    return;
  }else{
    classid = classes.indexOf(className.toUpperCase())+2;
  }


  client.query(
    "INSERT INTO users (mail, firstname, lastname,classid,roleid,password) VALUES ($1,$2,$3,$4,$5,$6)",
    [mail,firstName,lastName,classid,role,password],
    (error, result) => {
      if (error) {
        response.status(500).send("Backend error (probably duplicate mail)");
      }
      else  { // SUCCESS REGISTER
        response.status(200).send(true);
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
  client.query("SELECT * FROM usersReviews WHERE uid = $1", [uid], (error, results) => {
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

  let filter = request.query.filter ? request.query.filter : "title"
  let sorting = request.query.sorting ? request.query.sorting : "asc"

  //String formatting
  let search = request.query.search ? '%' + request.query.search + '%' : '%%'
  search = search.toLowerCase()

  //checks that the filter is ok and not a bad input
  if (escape(filter, filters)) {
    client.query("SELECT * from booksRead where translate(lower(title),'?!_,','') like $1 OR lower(author) like $1 order by " + filter + " " + sorting, [search], (error, results) => {
      if (error) {
        response.status(500).send(errorMsg("Internal server error"));
      } else {
        response.status(200).json(results.rows);
      }
    });
  }
};



// each published review of a specific book.
const getReview = (request, response) => {
  if (!hasSession(request, response)) {
    return;
  }
  let id = request.params.id
  client.query("SELECT * FROM getReviews WHERE bookid = $1 AND status=4", [id], (error, results) => {
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



module.exports = {
  getUsers,
  getUserPoints,
  deleteUser,
  login,
  register,
  getSession,
  logout,
  reviewedBooks,
  getBook,
  getReview,
  getUserReviews
}
