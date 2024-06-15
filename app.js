import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (user) {
            axios.get('/tasks').then(res => setTasks(res.data));
        }
    }, [user]);

    const handleLogin = (username, password) => {
        axios.post('/login', { username, password }).then(res => setUser(res.data.user));
    };

    const handleAddTask = (title, description, assignedTo) => {
        axios.post('/tasks', { title, description, assignedTo }).then(() => {
            axios.get('/tasks').then(res => setTasks(res.data));
        });
    };

    const handleAddComment = (taskId, comment) => {
        axios.post('/comments', { taskId, comment, createdBy: user.username }).then(() => {
            axios.get(`/comments/${taskId}`).then(res => setComments(res.data));
        });
    };

    return (
        <div>
            {!user ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Dashboard
                    user={user}
                    tasks={tasks}
                    comments={comments}
                    onAddTask={handleAddTask}
                    onAddComment={handleAddComment}
                />
            )}
        </div>
    );
};

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
        </form>
    );
};

const Dashboard = ({ user, tasks, comments, onAddTask, onAddComment }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [newComment, setNewComment] = useState('');

    const handleAddTask = () => {
        onAddTask(title, description, assignedTo);
    };

    const handleAddComment = (taskId) => {
        onAddComment(taskId, newComment);
    };

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.title} - {task.description} ({task.status})
                        <ul>
                            {comments
                                .filter(comment => comment.taskId === task._id)
                                .map(comment => (
                                    <li key={comment._id}>{comment.comment}</li>
                                ))}
                        </ul>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button onClick={() => handleAddComment(task._id)}>Add Comment</button>
                    </li>
                ))}
            </ul>
            <h2>Add Task</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Assigned to"
            />
            <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
};

export default App;
