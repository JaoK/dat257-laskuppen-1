const { request, response } = require("express");
const fetch = require("node-fetch");
const { client, errorMsg, isAdmin } = require("./utils")

//add bonus points to a review.
const bonusPoints = (request, response) => {
  if (!isAdmin(request, response)) {
    return;
  }

  const id = request.query.id
  const points = request.query.points

  client.query('WITH asd AS (select COALESCE(expoints, 0) as epoints from extrapoints where userid=$1) insert into extrapoints values($1, $2) on conflict (userId) do update set expoints = $2 + (SELECT epoints FROM asd);', [id, points], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    } else {
      response.status(200).json(results.rows)
    }
  })
}

// Accepts a review given an id
const acceptReview = (request, response) => {

  if (!isAdmin(request, response)) {
    return;
  }

  const id = parseInt(request.params.id)
  client.query("UPDATE Review SET status=3 WHERE id=$1", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    response.status(200).json(`Review updated with ID: ${id}`);
  });
};

// Rejects a review given a id
const rejectReview = (request, response) => {

  if (!isAdmin(request, response)) {
    return;
  }
  const id = parseInt(request.params.id)
  client.query("UPDATE Review SET status=1 WHERE id=$1", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    response.status(200).json(`Review updated with ID: ${id}`);
  });
};

//Publish review given an id
const publishReview = (request, response) => {

  if (!isAdmin(request, response)) {
    return;
  }
  const id = parseInt(request.params.id)
  client.query("UPDATE Review SET status=4 WHERE id=$1", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    response.status(200).json(`Review updated with ID: ${id}`);
  });
};

//Unpublish a review given an id
const unpublishReview = (request, response) => {

  if (!isAdmin(request, response)) {
    return;
  }
  const id = parseInt(request.params.id)
  client.query("UPDATE Review SET published=false WHERE id=$1", [id], (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    response.status(200).json(`Review updated with ID: ${id}`);
  });
};

// Get all reviews.
const getReviews = (request, response) => {
  if (!isAdmin(request, response)) {
    return;
  }

  client.query("SELECT * FROM getReviews ORDER BY status ASC", (error, results) => {
    if (error) {
      response.status(500).send(errorMsg("Internal server error"));
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  acceptReview,
  rejectReview,
  unpublishReview,
  publishReview,
  getReviews,
  bonusPoints
}
