const express = require('express')
var session = require('express-session')

const app = express()
const db = require('./queries/defaultqueries')
const toplistdb = require('./queries/toplist-queries')
const reviewdb = require('./queries/review-queries')
const atdb = require('./queries/adminteacher-queries')
const faqdb = require('./queries/faq-queries')
const port = process.env.PORT || 5000

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60*60*1000 }}) // Inloggad max 1 timme?
  )

  //Toplist Queries
  app.get('/api/recommendation', toplistdb.getRandomRecommendation)
  app.get('/api/toplist', toplistdb.toplist)
  app.get('/api/classpoints', toplistdb.getClassPoints)
  app.get('/api/users/:id', toplistdb.getUserById)
  app.get('/api/userpoints', toplistdb.getUserPoints)
  app.get('/api/mostreadbook', toplistdb.mostReadBook)
  app.get('/api/userreadmost', toplistdb.userReadMost)

  //Review Queries
  app.get('/api/booksearch/:bookname', reviewdb.searchBookDb)
  app.get('/api/latestreviews', reviewdb.latestReview)
  app.get('/api/books/:bookname', reviewdb.bookssearch)
  app.post('/api/submitreview',reviewdb.submitreview)

  //Admin and Teacher Queries
  app.get('/api/accrev/:id', atdb.acceptReview)
  app.get('/api/rejrev/:id', atdb.rejectReview)
  app.get('/api/unpubrev/:id', atdb.unpublishReview)
  app.get('/api/pubrev/:id', atdb.publishReview)
  app.get('/api/reviews', atdb.getReviews)
  app.get('/api/bonus', atdb.bonusPoints)


  //FAQ Queries
  app.get('/api/faq',faqdb.faqGet)
  app.delete('/api/faq/:id',faqdb.faqDel)
  app.put('/api/faq',faqdb.faqPut)
  app.post('/api/faq',faqdb.faqAdd)

  //Book Queries
  app.get('/api/reviews/:id', db.getReview)
  app.get('/api/reviewedbooks', db.reviewedBooks)

  // Other
  app.post('/api/login', db.login)
  app.post('/api/register', db.register)
  app.get('/api/users', db.getUsers)
  app.get('/api/session', db.getSession)
  app.get('/api/logout', db.logout)
  app.delete('/api/users/:id', db.deleteUser)
  app.get('/api/getbook/:id', db.getBook)
  app.get('/api/user/reviews', db.getUserReviews)

  // Load react frontend
  app.use(express.static('client/build'));

// 404 Not found -> redirects to home page
app.get('/*', (request, response) => {
  response.redirect('/');
})

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
