const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);

module.exports = app;
