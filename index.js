const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Set view engine
app.set("view engine", "ejs");

// Temporary data storage
let posts = [];



// home route to include path
app.get("/", (req, res) => {
    res.render("home", { posts: posts, path: '/' });
});

app.get("/about", (req, res) => {
    res.render("about", { path: '/about' });
});

app.get("/contact", (req, res) => {
    res.render("contact", { path: '/contact' });
});

// Get edit form
app.get("/posts/:id/edit", (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
        return res.redirect('/');
    }
    res.render("edit", { post, path: '' });
});

app.post("/posts", (req, res) => {
    const { title, content } = req.body;
    const newPost = {
        id: uuidv4(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString()
    };
    posts.unshift(newPost); // Add new post at the beginning
    res.redirect("/");
});

// Update post
app.put("/posts/:id", (req, res) => {
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        posts[index] = {
            ...posts[index],
            title: req.body.title,
            content: req.body.content
        };
    }
    res.redirect('/');
});

// Delete post
app.delete("/posts/:id", (req, res) => {
    posts = posts.filter(post => post.id !== req.params.id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});