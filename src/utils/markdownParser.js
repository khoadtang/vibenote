export function parseProjects(markdown) {
  const lines = markdown.split(/\n/);
  const projects = {};
  let currentProject = 'General';

  for (const line of lines) {
    // Lines that begin with "#" denote a project heading. Allow names like
    // "#proj" or "#proj name-with-hyphen" but ignore lines that look like task
    // prefixes such as "#proj do something".
    const headingMatch = line.match(/^#([\w-]+(?:\s+[\w-]+)?)$/);
    if (headingMatch) {
      currentProject = headingMatch[1].trim();
      projects[currentProject] = projects[currentProject] || [];
      continue;
    }

    // Allow Todoist-style project prefix, e.g. "#proj Do something"
    const prefixTag = line.match(/^#([\w-]+)\s+(.+)/);
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
