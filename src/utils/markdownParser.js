export function parseProjects(markdown) {
  const lines = markdown.split(/\n/);
  const projects = {};
  let currentProject = 'General';
  for (const line of lines) {
    const projectTag = line.match(/^#\s*(.+)$/);
    if (projectTag) {
      currentProject = projectTag[1].trim();
      projects[currentProject] = projects[currentProject] || [];
      continue;
    }

    const taskMatch = line.match(/- \[ \] (.+)/);
    if (taskMatch) {
      let text = taskMatch[1].trim();
      let project = currentProject;

      // Support inline Todoist-style project tags e.g. "task #proj"
      const inlineTag = text.match(/#([\w-]+)/);
      if (inlineTag) {
        project = inlineTag[1];
        text = text.replace(`#${inlineTag[1]}`, '').trim();
      }

      if (!projects[project]) projects[project] = [];
      projects[project].push(text);
    }
  }
  return projects;
}
