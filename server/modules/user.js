const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: {
    type: String,
    minlength: 1,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  }
});


module.exprots = { User };
