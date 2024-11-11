const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String,
}));

// Endpoint to save login details
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).send('User saved');
  } catch (error) {
    res.status(500).send('Error saving user');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
