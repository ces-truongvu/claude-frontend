# Setup Guidelines

- Find a boilerplate for your project
- For frontend find and download a static template from Aura.build or Google Stitch or Figma
- Init to create CLAUDE.md
- Plan mode to generate tasks
- Create a landing page from template @templates/index.html, breaking down to multiple phases
- export to @dev/active/PLAN.md or create a GitHub issues including the checking-off tasks.
- use command to track progress and update the plan.
- Grab built-in agents and skills to bootstrap your own agents or skills or hooks, etc.
- use agent and skill-creator to create your own skills. Sample prompt: "@agent-frontend-developer researching patterns and best practices for the current project, then use skill-creator to create a frontend-dev skills. Remember breaking down best practices and patterns into multiple resources for references."
- Skills will be used for cost-optimization model for enhance quality of output.

---

# Implementation

- Use ` /gh-issue-task` to implement tasks
- Use another terminal to review the first Claude's work until the feedback is allowed to merge. If not satisfield, export to `@dev/code-revew/REVIEW-${github-issue-id}-${(task-id|phase-id)}.md` for further review.
  _NOTE: suggest to use strongest model for code review_
- Show git worktree if having time

# Challenges for backend

- Use Claude or Any LLM for explorer ideas
- Find out architecture diagram and ERD diagram
- Building agents, skills, hooks, commands
- Expectation:
  - Clear documentation (PRD, ERD, API doc)
  - Build backend with database connection
  - Build API endpoints
  - Documentation for API endpoints
  - Testing for API endpoints
  - Integration with frontend (if applicable)
  - Deployment to cloud platform (nice to have)

## Submit survey

- Pre-training survey: https://forms.gle/1sJVqdjEoY1igPCQ9
- Post-training survey: https://forms.gle/AeEmBnDx3rsXbEDQ7
