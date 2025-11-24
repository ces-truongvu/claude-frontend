---
description: Implement task from local @dev/active file
argument-hint: [task-number]
---

#!/bin/bash

# Parse arguments

ARGS="$ARGUMENTS"

# Parse optional task number

read -r TASK_NUMBER <<< "$ARGS"

# Define common post-action instructions

POST_ACTIONS="
IMPORTANT: After implementation is complete, you MUST:

1. Use the @agent-test-monitor sub-agent to make sure all tests passed.
2. Step 1 MUST be done before moving to this step, update the task status as completed in the @dev/active file.
3. Finally, commit all changes using git with a semantic commit message following this format:

Format: \`<type>(<scope>): <subject>\`

- <scope> is optional
- <subject> must be in present tense

Types:

- feat: new feature for the user
- fix: bug fix for the user
- docs: changes to documentation
- style: formatting, missing semi colons, etc; no production code change
- refactor: refactoring production code, eg. renaming a variable
- test: adding missing tests, refactoring tests; no production code change
- chore: updating grunt tasks etc; no production code change

Example: \`feat(folders): add folder CRUD operations\`

Analyze the implemented changes and create an appropriate semantic commit message that accurately describes what was done."

# Generate appropriate prompt based on whether task number is provided

if [ -n "$TASK_NUMBER" ]; then
echo "Read the @dev/active/**/\*.md files as the single source of truth and implement Task $TASK_NUMBER. Pick the relevant skill before implementing.
$POST_ACTIONS"
else
echo "Read the @dev/active/**/\*.md files as the single source of truth and determine the next unchecked task. Confirm with the user the specific task to implement. After confirmation, pick the relevant skill before implementing.
$POST_ACTIONS"
fi
