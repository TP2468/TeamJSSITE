const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Datenbankverbindung
mongoose.connect('mongodb://localhost:27017/team-dashboard', { useNewUrlParser: true, useUnifiedTopology: true });

// Benutzer-Schema und -Modell
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String // 'developer' oder 'content'
});

const User = mongoose.model('User', UserSchema);

// Aufgabe-Schema und -Modell
const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: String,
    status: String // 'open', 'in progress', 'completed'
});

const Task = mongoose.model('Task', TaskSchema);

// Kommentar-Schema und -Modell
const CommentSchema = new mongoose.Schema({
    taskId: mongoose.Schema.Types.ObjectId,
    comment: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', CommentSchema);

// Benutzerregistrierung
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.send('User registered');
});

// Benutzeranmeldung
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Aufgaben abrufen
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Aufgabe hinzufügen
app.post('/tasks', async (req, res) => {
    const { title, description, assignedTo } = req.body;
    const task = new Task({ title, description, assignedTo, status: 'open' });
    await task.save();
    res.send('Task created');
});

// Kommentar hinzufügen
app.post('/comments', async (req, res) => {
    const { taskId, comment, createdBy } = req.body;
    const newComment = new Comment({ taskId, comment, createdBy });
    await newComment.save();
    res.send('Comment added');
});

// Kommentare für eine Aufgabe abrufen
app.get('/comments/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const comments = await Comment.find({ taskId });
    res.json(comments);
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});

