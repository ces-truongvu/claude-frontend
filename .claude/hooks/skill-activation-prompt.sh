#!/bin/bash
set -e

# Debug mode (set to 1 for debug output)
DEBUG=${DEBUG:-1}

# Debug echo function
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
LOG_FILE="${SCRIPT_DIR}/hook.log"

debug_echo() {
  if [[ "$DEBUG" -eq 1 ]]; then
    # truncate -s 0 "$LOG_FILE" # Clear log file on each run
    # echo "DEBUG: $*" >&2
    echo "DEBUG: $*" >>"$LOG_FILE"
  fi
}

# Extract a field from JSON using basic string manipulation
# Usage: extract_json_field "$json_string" "field_name"
extract_json_field() {
  local json="$1"
  local field="$2"

  # Handle string field
  if echo "$json" | grep -q "\"$field\"[[:space:]]*:[[:space:]]*\""; then
    echo "$json" | sed -n 's/.*"'$field'"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1
  fi
}

# Load skill rules from JSON file
# Usage: load_skill_rules "path/to/skill-rules.json"
load_skill_rules() {
  local rules_file="$1"
  local rules_content=""

  if [[ ! -f "$rules_file" ]]; then
    echo "ERROR: Skill rules file not found: $rules_file" >&2
    return 1
  fi

  rules_content=$(cat "$rules_file")
  echo "$rules_content"
}

# Extract skills section from rules JSON
# Usage: extract_skills_section "$rules_json"
extract_skills_section() {
  local rules="$1"
  # Extract the skills object content (simplified extraction)
  echo "$rules" | sed -n '/{/,/}/p' | grep -A 1000 '"skills"' | tail -n +2
}

# Extract individual skill configurations
# Usage: extract_skill_configs "$skills_json"
extract_skill_configs() {
  local skills_json="$1"
  # This is a simplified extraction - in practice you'd need more sophisticated parsing
  echo "$skills_json"
}

# Check if keyword matches in prompt (case-insensitive)
# Usage: match_keyword "$prompt" "$keyword"
match_keyword() {
  local prompt="$1"
  local keyword="$2"
  local prompt_lower="${prompt,,}"
  local keyword_lower="${keyword,,}"
  [[ "$prompt_lower" == *"$keyword_lower"* ]]
}

# Test regex pattern match (case-insensitive)
# Usage: match_intent_pattern "$prompt" "$pattern"
match_intent_pattern() {
  local prompt="$1"
  local pattern="$2"

  # Handle case-insensitive flag
  local case_insensitive=false
  if [[ "$pattern" =~ [iI]$ ]]; then
    case_insensitive=true
    pattern="${pattern%[iI]}"
  fi

  if [[ "$case_insensitive" == true ]]; then
    shopt -s nocasematch
    [[ "$prompt" =~ $pattern ]]
    local result=$?
    shopt -u nocasematch
    return $result
  else
    [[ "$prompt" =~ $pattern ]]
  fi
}

# Parse skill configuration and check for matches
# Usage: check_skill_match "$prompt" "$skill_name" "$skill_config_json"
check_skill_match() {
  local prompt="$1"
  local skill_name="$2"
  local skill_config="$3"

  local priority=""
  local matched=false
  local match_type=""

  # Get priority from predefined skill priorities
  case "$skill_name" in
  "skill-developer")
    priority="critical"
    ;;
  "backend-dev-guidelines")
    priority="high"
    ;;
  "frontend-dev-guidelines")
    priority="high"
    ;;
  "error-tracking")
    priority="medium"
    ;;
  "documentation-architect")
    priority="low"
    ;;
  *)
    priority="medium"
    ;;
  esac

  # Check keyword matches using predefined keyword arrays
  case "$skill_name" in
  "skill-developer")
    local keywords=("skill" "claude" "hook" "skill-rules" ".claude" "skill system" "create skill" "add skill" "skill triggers")
    ;;
  "backend-dev-guidelines")
    local keywords=("nestjs" "controller" "service" "repository" "api" "backend" "typeorm" "jwt" "auth" "fastify" "feature module" "dto" "entity" "migration" "guard" "interceptor" "middleware" "validation" "throttling" "pino" "logging")
    ;;
  "frontend-dev-guidelines")
    local keywords=("nextjs" "react" "component" "frontend" "ui" "shadcn" "tailwind" "app router" "server component" "client component" "safeFetch" "zod" "nextauth" "typescript" "page" "layout" "loading" "error" "not-found")
    ;;
  "error-tracking")
    local keywords=("error" "exception" "catch" "try" "sentry" "logging" "captureException" "monitoring" "performance" "tracking")
    ;;
  "documentation-architect")
    local keywords=("documentation" "readme" "docs" "guide" "manual" "api docs" "changelog")
    ;;
  *)
    local keywords=()
    ;;
  esac

  # Check each keyword for a match
  for keyword in "${keywords[@]}"; do
    if match_keyword "$prompt" "$keyword"; then
      matched=true
      match_type="keyword"
      debug_echo "Keyword match found: $skill_name (keyword: $keyword)"
      break
    fi
  done

  # If no keyword match, check intent patterns using predefined patterns
  if [[ "$matched" == false ]]; then
    local patterns=()
    case "$skill_name" in
    "skill-developer")
      patterns=("(create|add|modify|build).*?skill" "skill.*?(work|trigger|activate|system)" "(how do|how does|explain).*?skill" "update.*skill.*rules")
      ;;
    "backend-dev-guidelines")
      patterns=("(create|add|implement|build).*?(controller|service|repository|entity|dto)" "(setup|configure).*?(auth|jwt|typeorm|fastify)" "(add|implement).*?(guard|interceptor|middleware|validation)" "(create|add).*?(feature|module)" "(fix|handle|debug).*?(nestjs|backend|api)")
      ;;
    "frontend-dev-guidelines")
      patterns=("(create|add|make|build|update).*?(component|page|layout)" "(implement|add).*?(server|client).*?component" "(setup|configure).*?(nextauth|safeFetch|shadcn)" "(create|build).*?(frontend|ui|react)" "(fix|debug).*?(nextjs|react|component)")
      ;;
    "error-tracking")
      patterns=("(add|create|implement|setup).*?(error|sentry|tracking)" "(fix|handle|catch).*?(error|exception)" "monitor.*?(performance|errors)" "track.*?(errors|performance)")
      ;;
    "documentation-architect")
      patterns=("(create|write|update).*?(documentation|readme|guide)" "(document|explain).*?(api|feature|code)" "add.*?(docs|documentation)")
      ;;
    esac

    for pattern in "${patterns[@]}"; do
      if match_intent_pattern "$prompt" "$pattern"; then
        matched=true
        match_type="intent"
        debug_echo "Intent pattern match found: $skill_name (pattern: $pattern)"
        break
      fi
    done
  fi

  if [[ "$matched" == true ]]; then
    echo "$skill_name:$match_type:$priority"
    return 0
  fi

  return 1
}

# Format the output based on matched skills
# Usage: format_output "$matched_skills"
format_output() {
  local matched_skills="$1"

  if [[ -z "$matched_skills" ]]; then
    return 0
  fi

  local output="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
  output+="🎯 SKILL ACTIVATION CHECK\n"
  output+="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"

  # Group skills by priority
  local critical=""
  local high=""
  local medium=""
  local low=""

  while IFS= read -r skill_line; do
    if [[ -n "$skill_line" ]]; then
      local skill_name=$(echo "$skill_line" | cut -d: -f1)
      local priority=$(echo "$skill_line" | cut -d: -f3)

      case "$priority" in
      "critical")
        critical+="$skill_name\n"
        ;;
      "high")
        high+="$skill_name\n"
        ;;
      "medium")
        medium+="$skill_name\n"
        ;;
      "low")
        low+="$skill_name\n"
        ;;
      esac
    fi
  done <<<"$matched_skills"

  # Add sections based on priority
  if [[ -n "$critical" ]]; then
    output+="⚠️ CRITICAL SKILLS (REQUIRED):\n"
    # Process each skill in critical without using a subshell
    while IFS= read -r skill; do
      if [[ -n "$skill" ]]; then
        output+="  → $skill\n"
      fi
    done <<<"$critical"
    output+="\n"
  fi

  if [[ -n "$high" ]]; then
    output+="📚 RECOMMENDED SKILLS:\n"
    while IFS= read -r skill; do
      if [[ -n "$skill" ]]; then
        output+="  → $skill\n"
      fi
    done <<<"$high"
    output+="\n"
  fi

  if [[ -n "$medium" ]]; then
    output+="💡 SUGGESTED SKILLS:\n"
    while IFS= read -r skill; do
      if [[ -n "$skill" ]]; then
        output+="  → $skill\n"
      fi
    done <<<"$medium"
    output+="\n"
  fi

  if [[ -n "$low" ]]; then
    output+="📌 OPTIONAL SKILLS:\n"
    while IFS= read -r skill; do
      if [[ -n "$skill" ]]; then
        output+="  → $skill\n"
      fi
    done <<<"$low"
    output+="\n"
  fi

  output+="ACTION: Use Skill tool BEFORE responding\n"
  output+="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

  echo -e "$output"
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

  # Determine project directory
  local project_dir=""
  if [[ -n "$CLAUDE_PROJECT_DIR" ]]; then
    project_dir="$CLAUDE_PROJECT_DIR"
  else
    project_dir="$(pwd)"
  fi

  local rules_file="$project_dir/.claude/skills/skill-rules.json"
  debug_echo "Loading rules from: $rules_file"

  # Load skill rules
  local rules=""
  if ! rules=$(load_skill_rules "$rules_file"); then
    debug_echo "Failed to load skill rules"
    exit 1
  fi

  debug_echo "Rules loaded successfully"

  # Extract skills section (simplified approach)
  # For a production version, you'd want more robust JSON parsing
  local matched_skills=""

  # Known skills from the configuration (hardcoded for reliability)
  local known_skills=(
    "skill-developer"
    "backend-dev-guidelines"
    "frontend-dev-guidelines"
    "error-tracking"
    "documentation-architect"
  )

  # Predefined skill configurations based on the known skill-rules.json
  declare -A skill_configs
  skill_configs["skill-developer"]='{"priority":"critical","keywords":["skill","claude","hook","skill-rules",".claude","skill system","create skill","add skill","skill triggers"],"intentPatterns":["(create|add|modify|build).*?skill","skill.*?(work|trigger|activate|system)","(how do|how does|explain).*?skill","update.*skill.*rules"]}'
  skill_configs["backend-dev-guidelines"]='{"priority":"high","keywords":["nestjs","controller","service","repository","api","backend","typeorm","jwt","auth","fastify","feature module","dto","entity","migration","guard","interceptor","middleware","validation","throttling","pino","logging"],"intentPatterns":["(create|add|implement|build).*?(controller|service|repository|entity|dto)","(setup|configure).*?(auth|jwt|typeorm|fastify)","(add|implement).*?(guard|interceptor|middleware|validation)","(create|add).*?(feature|module)","(fix|handle|debug).*?(nestjs|backend|api)"]}'
  skill_configs["frontend-dev-guidelines"]='{"priority":"high","keywords":["nextjs","react","component","frontend","ui","shadcn","tailwind","app router","server component","client component","safeFetch","zod","nextauth","typescript","page","layout","loading","error","not-found"],"intentPatterns":["(create|add|make|build|update).*?(component|page|layout)","(implement|add).*?(server|client).*?component","(setup|configure).*?(nextauth|safeFetch|shadcn)","(create|build).*?(frontend|ui|react)","(fix|debug).*?(nextjs|react|component)"]}'
  skill_configs["error-tracking"]='{"priority":"medium","keywords":["error","exception","catch","try","sentry","logging","captureException","monitoring","performance","tracking"],"intentPatterns":["(add|create|implement|setup).*?(error|sentry|tracking)","(fix|handle|catch).*?(error|exception)","monitor.*?(performance|errors)","track.*?(errors|performance)"]}'
  skill_configs["documentation-architect"]='{"priority":"low","keywords":["documentation","readme","docs","guide","manual","api docs","changelog"],"intentPatterns":["(create|write|update).*?(documentation|readme|guide)","(document|explain).*?(api|feature|code)","add.*?(docs|documentation)"]}'

  # Check each skill for matches
  for skill_name in "${known_skills[@]}"; do
    local skill_config="${skill_configs[$skill_name]}"
    if [[ -n "$skill_config" ]]; then
      if match_result=$(check_skill_match "$prompt" "$skill_name" "$skill_config"); then
        matched_skills+="$match_result"
        matched_skills+=$'\n'
        debug_echo "Skill matched: $match_result"
      fi
    fi
  done

  debug_echo "All matched skills: [$matched_skills]"

  # Format and output results
  format_output "$matched_skills"

  exit 0
}

# Run main function
main "$@"
