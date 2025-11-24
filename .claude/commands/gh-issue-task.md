---
description: Implement task from GitHub issue
argument-hint: <issue-number> [task-number]
---

#!/bin/bash

# Parse arguments

ARGS="$ARGUMENTS"

# Check if no arguments provided

if [ -z "$ARGS" ]; then
echo "Error: Issue number required."
echo "Usage: /gh-issue-task <issue-number> [task-number]"
echo "Examples:"
echo " /gh-issue-task 123 # Implement next task from issue #123"
echo " /gh-issue-task 123 5 # Implement specific task #5 from issue #123"
exit 1
fi

# Parse issue number and optional task number

read -r ISSUE_NUMBER TASK_NUMBER <<< "$ARGS"

# Validate issue number is provided

if [ -z "$ISSUE_NUMBER" ]; then
echo "Error: Issue number required."
echo "Usage: /gh-issue-task <issue-number> [task-number]"
exit 1
fi

# Define common post-action instructions

POST_ACTIONS="
IMPORTANT: After implementation is complete, you MUST:

1. Use the @agent-test-monitor sub-agent to make sure all tests passed.
2. Step 1 MUST be done before moving to this step, update the task status as completed in BOTH the GitHub issue and the @dev/active tasks file to keep them in sync.
3. Finally, commit all changes using git with a semantic commit message following this format:

Format: \\\`<type>(<scope>): <subject>\\\`

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

Example: \\\`feat(folders): add folder CRUD operations\\\`

Analyze the implemented changes and create an appropriate semantic commit message that accurately describes what was done."

# Generate appropriate prompt based on whether task number is provided

if [ -n "$TASK_NUMBER" ]; then
echo "Fetch Github Issue #$ISSUE_NUMBER from GitHub as single source of truth and implement Task or Phase $TASK_NUMBER. Check the @dev/active files for relevant information. Before implementing, you MUST confirm with the user the specific task to implement. After confirmation, pick the relevant skill before implementing.
$POST_ACTIONS"
else
echo "Fetch Github Issue #$ISSUE_NUMBER from GitHub as single source of truth and determine the next unchecked task. Check the @dev/active files for relevant information. If the next unchecked task from the GitHub issue doesn't match the unchecked tasks in @dev/active, ask the user to make them identical before proceeding. Once they match, confirm with the user the specific task to implement. After confirmation, pick the relevant skill before implementing.
$POST_ACTIONS"
fi
