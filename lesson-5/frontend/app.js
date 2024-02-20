const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.FRONTEND_PORT || 80;

app.get('/', (req, res) => {
  res.redirect('/memberships');
});

app.get('/memberships', (req, res) => {
  res.render('memberships', { title: 'Memberships', activePage: 'memberships' });
});

app.get('/new-membership', (req, res) => {
  res.render('new-membership', { title: 'New Membership', activePage: 'new_membership' });
});

app.get('/users', (req, res) => {
  res.render('users', { title: 'Users', activePage: 'users' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
