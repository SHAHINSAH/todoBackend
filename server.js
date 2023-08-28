const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = require('./User');

app.post('/signup', async (req, res) => {
    try {
        const { email, mobile, password } = req.body;
        // Checking if email or mobile already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or mobile already in use' });
        }
        const newUser = new User({ email, mobile, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
