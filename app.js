/* eslint-disable no-console */
/*
 * The Social Hacker main server
 */

 require('dotenv').config();
 const cookieParser = require('cookie-parser');
 const express = require('express');
 const compression = require('compression');
 const path = require('path');
 const Sequelize = require('sequelize');
 const saniter = require('sanitize');
 const expressSanitizer = require('express-sanitizer');
 const { Client } = require('pg'); 

 /** Imported Routes */
const { verifyAuthentication } = require('./util/middleware');

 /** Instantiating main server */
const app = express();
const PORT = process.env.PORT || 3000;

/** Set up statict public directory */
app.use(express.static(path.join(__dirname, '...', 'public')));

/** Middleware */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ esxtended: true }));
app.use(sanitizer.middleware);
app.use(expressSanitizer());

/** Database Connection */
const sequelize = new Sequelize(`postgres://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  /** Early exit */
  .catch((err) => {
    console.error('Unable to connect to the database:', err.message);
  });

/** Setup routes */


/** Protected routes */
app.use(verifyAuthentication);

/** Any remaining request with an extension (.js, .css, etc...) send 404 */
app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    }
  
    next();
  });
  
  app.listen(PORT, () => {
    console.log('The Social Hacker listening on port', PORT);
  });
  