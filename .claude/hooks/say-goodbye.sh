#!/bin/bash
set -e

# Debug mode (set to 1 for debug output)
DEBUG=${DEBUG:-1}

# Debug echo function
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
LOG_FILE="${SCRIPT_DIR}/goodbye.log"

debug_echo() {
  if [[ "$DEBUG" -eq 1 ]]; then
    # echo "DEBUG: $*" >&2
    echo "DEBUG: $*" >>"$LOG_FILE"
  fi
}

extract_json_field() {
  local json="$1"
  local field="$2"

  # Handle string field
  if echo "$json" | grep -q "\"$field\"[[:space:]]*:[[:space:]]*\""; then
    echo "$json" | sed -n 's/.*"'$field'"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1
  fi
}

# Main function
main() {
  # Read input from stdin
  local input=""
  input=$(cat)

  debug_echo "Input received: $input"

  # Extract prompt from input
  local prompt=""
  prompt=$(extract_json_field "$input" "prompt")

  if [[ -z "$prompt" ]]; then
    debug_echo "No prompt found in input"
    exit 0
  fi

  debug_echo "Extracted prompt: $prompt"

  exit 0
}

# Run main function
main "$@"
