#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="${SKILLS_SOURCE_DIR:-$HOME/skills/skills}"
TARGET_DIR="${SKILLS_TARGET_DIR:-$REPO_ROOT/.agents/skills}"

usage() {
    echo "Usage:"
    echo "  $0 list"
    echo "  $0 install <skill-number>"
}

SORTED_SKILLS=()

load_sorted_skills() {
    if [[ ! -d "$SOURCE_DIR" ]]; then
        echo "Error: Skills source directory not found: $SOURCE_DIR" >&2
        exit 1
    fi

    mapfile -t SORTED_SKILLS < <(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | LC_ALL=C sort)
}

list_skills() {
    local i

    load_sorted_skills

    for i in "${!SORTED_SKILLS[@]}"; do
        printf "%d. %s\n" "$((i + 1))" "${SORTED_SKILLS[$i]}"
    done
}

install_skill() {
    local skill_number="${1:-}"
    local skill_index
    local skill_name
    local source_path

    if [[ -z "$skill_number" ]]; then
        echo "Error: Missing skill number for install" >&2
        usage
        exit 1
    fi

    if [[ ! "$skill_number" =~ ^[0-9]+$ ]] || (( 10#$skill_number < 1 )); then
        echo "Error: Skill number must be a positive integer" >&2
        exit 1
    fi

    load_sorted_skills
    skill_index=$((10#$skill_number - 1))

    if (( skill_index >= ${#SORTED_SKILLS[@]} )); then
        echo "Error: Skill number '$skill_number' is out of range" >&2
        exit 1
    fi

    skill_name="${SORTED_SKILLS[$skill_index]}"
    source_path="$SOURCE_DIR/$skill_name"

    link_skill_to_target "$skill_name" "$source_path" "$TARGET_DIR"
}

link_skill_to_target() {
    local skill_name="$1"
    local source_path="$2"
    local base_target_dir="$3"
    local target_path="$base_target_dir/$skill_name"
    local source_realpath
    local target_realpath

    mkdir -p "$base_target_dir"
    source_realpath="$(readlink -f "$source_path")"

    if [[ -L "$target_path" ]]; then
        target_realpath="$(readlink -f "$target_path" || true)"

        if [[ "$target_realpath" == "$source_realpath" ]]; then
            echo "Already linked: $target_path"
            return
        fi

        rm "$target_path"
    elif [[ -e "$target_path" ]]; then
        echo "Error: Target already exists and is not a symlink: $target_path" >&2
        exit 1
    fi

    ln -s "$source_path" "$target_path"
    echo "Linked: $target_path -> $source_path"
}

command="${1:-list}"

case "$command" in
    list)
        list_skills
        ;;
    install)
        install_skill "${2:-}"
        ;;
    *)
        echo "Error: Unknown command '$command'" >&2
        usage
        exit 1
        ;;
esac
