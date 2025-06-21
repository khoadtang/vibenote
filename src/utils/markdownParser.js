export function parseProjects(markdown) {
  const lines = markdown.split(/\n/);
  const projects = {};
  let currentProject = 'General';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect project headings. Allow "#proj" or "# Project" with optional
    // spaces. We treat it as a heading only when the following line is a task
    // item ("- [ ]"), otherwise it's interpreted as a prefix-style task.
    const headingMatch = line.trim().match(/^#([^\s].*)$/);
    if (headingMatch) {
      const nextLine = (lines[i + 1] || '').trim();
      if (nextLine.startsWith('- [ ]')) {
        currentProject = headingMatch[1].trim();
        projects[currentProject] = projects[currentProject] || [];
        continue;
      }
    }

    // Allow Todoist-style project prefix, e.g. "#proj Do something"
    const prefixTag = line.trim().match(/^#([\w-]+)\s+(.+)/);
    if (prefixTag) {
      const project = prefixTag[1];
      let text = prefixTag[2].trim();
      text = text.replace(/\(0\)/g, '').trim();

      if (!projects[project]) projects[project] = [];
      projects[project].push(text);
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
