export function parseProjects(markdown) {
  const lines = markdown.split(/\n/);
  const projects = {};
  let currentProject = 'General';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const next = lines[i + 1] || '';
    // Lines that denote a project heading
    let headingMatch = line.match(/^#([\w-]+)$/);
    if (!headingMatch && next.trim().startsWith('- [ ]')) {
      headingMatch = line.match(/^#(.+)$/);
    }
    if (!headingMatch) {
      const spaced = line.match(/^#+\s+(.+)$/);
      if (spaced) headingMatch = spaced;
    }
    if (headingMatch) {
      currentProject = headingMatch[1].trim();
      projects[currentProject] = projects[currentProject] || [];
      continue;
    }

    // Allow Todoist-style project prefix, e.g. "#proj Do something"
    let prefixTag = line.match(/^#([\w-]+)\s+(.+)/);
    if (prefixTag && !prefixTag[2].includes(' ')) {
      prefixTag = null;
    }
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
