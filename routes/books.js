const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Book = require('../models/Book');

// @route     GET api/books
// @desc      Get a user's collection
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const collection = await Book.find({ user: req.user.id });
    res.json(collection);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/books
// @desc      Add new book to personal collection
// @access    Private
router.post('/', [auth, [check('title', 'Title is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, author, averageRating, publishYear, dateAdded, photo } = req.body;
  try {
    const newBook = new Book({
      title,
      author,
      averageRating,
      publishYear,
      photo,
      dateAdded,
      user: req.user.id,
    });

    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     PUT api/books/:id
// @desc      Update book from personal collection
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  const newStatus = status;

  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    // Check if user is the owner of the book
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    book = await Book.findByIdAndUpdate(req.params.id, { status: newStatus }, { new: true });
    res.json({ book });
  } catch (err) {
    console.log(err);
  }
});

// @route     DELETE api/books/:id
// @desc      Delete book from personal collection
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    // Check if user is the owner of the book
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Book.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
