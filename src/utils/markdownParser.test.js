import { describe, it, expect } from 'vitest';
import { parseProjects } from './markdownParser.js';

describe('parseProjects', () => {
  it('groups tasks by project hashtags', () => {
    const input = `#proj\n- [ ] task 1\n- [ ] task 2\n#other\n- [ ] task 3`;
    const result = parseProjects(input);
    expect(result).toEqual({
      proj: ['task 1', 'task 2'],
      other: ['task 3'],
    });
  });

  it('defaults to General when no project specified', () => {
    const input = `- [ ] general task`;
    const result = parseProjects(input);
    expect(result).toEqual({ General: ['general task'] });
  });

  it('handles hyphenated and spaced project names', () => {
    const input = `#test project-api\n- [ ] task`;
    const result = parseProjects(input);
    expect(result).toEqual({ 'test project-api': ['task'] });
  });

  it('parses inline project tags like todoist', () => {
    const input = `- [ ] a task #proj\n- [ ] another #other`;
    const result = parseProjects(input);
    expect(result).toEqual({ proj: ['a task'], other: ['another'] });
  });

  it('parses tasks prefixed with a project tag', () => {
    const input = `#proj do this\n#other finish that`;
    const result = parseProjects(input);
    expect(result).toEqual({ proj: ['do this'], other: ['finish that'] });
  });
});
