const express = require("express");

const PORT = 3000;

let projects = [];

const server = express();
server.use(express.json());
server.use((req, res, next) => {
  console.count(`Total de requisições`);
  return next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ message: "Project does not exist" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  projects = projects.filter(project => project.id !== id);

  return res.send();
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
