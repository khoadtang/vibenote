export function parseProjects(markdown) {
  const lines = markdown.split(/\n/);
  const projects = {};
  let currentProject = 'General';
  for (const line of lines) {
    const projectTag = line.match(/#(\w+)/);
    if (projectTag) {
      currentProject = projectTag[1];
      projects[currentProject] = projects[currentProject] || [];
    }
    const taskMatch = line.match(/- \[ \] (.+)/);
    if (taskMatch) {
      if (!projects[currentProject]) projects[currentProject] = [];
      projects[currentProject].push(taskMatch[1]);
    }
  }
  return projects;
}
