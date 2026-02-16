#!/usr/bin/env bash
# Compare stacker addresses between members-<prev>.json and members-<cycle>.json
# Usage: compare-cycle-members.sh <cycle-number> [-d DIR] [-o OUTDIR]
set -euo pipefail

prog="$(basename "$0")"

usage() {
  cat <<EOF
Usage: $prog <cycle-number> [options]

Compare stacker addresses between members-<cycle-1>.json and members-<cycle>.json.

Options:
  -d, --dir DIR    cycles directory (default: packages/home/data/cycles)
  -o, --out DIR    write output files to DIR (optional)
  -h, --help       show this help

Example:
  $prog 129            # compare members-128.json -> members-129.json
  $prog 129 -o outdir   # also write missing/new lists and CSV into outdir
EOF
}

if [[ ${#@} -lt 1 ]]; then
  usage
  exit 1
fi

cycle="$1"
shift || true

dir="packages/home/data/cycles"
outdir=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--dir) dir="$2"; shift 2 ;;
    -o|--out) outdir="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

if ! [[ "$cycle" =~ ^[0-9]+$ ]]; then
  echo "Error: <cycle-number> must be a positive integer" >&2
  exit 1
fi

prev=$((cycle - 1))
prev_file="$dir/members-${prev}.json"
cur_file="$dir/members-${cycle}.json"

if [[ ! -f "$prev_file" ]]; then
  echo "Error: previous file not found: $prev_file" >&2
  exit 1
fi
if [[ ! -f "$cur_file" ]]; then
  echo "Error: current file not found: $cur_file" >&2
  exit 1
fi

command -v jq >/dev/null 2>&1 || { echo "Error: jq is required" >&2; exit 1; }

tmp_prev=$(mktemp)
tmp_cur=$(mktemp)
tmp_removed=$(mktemp)
tmp_added=$(mktemp)
trap 'rm -f "$tmp_prev" "$tmp_cur" "$tmp_removed" "$tmp_added"' EXIT

jq -r '.members[].stacker' "$prev_file" | sort -u > "$tmp_prev"
jq -r '.members[].stacker' "$cur_file" | sort -u > "$tmp_cur"

# removed = in prev but not in cur
comm -23 "$tmp_prev" "$tmp_cur" > "$tmp_removed"
# added = in cur but not in prev
comm -13 "$tmp_prev" "$tmp_cur" > "$tmp_added"

removed_count=$(wc -l < "$tmp_removed" | tr -d '[:space:]')
added_count=$(wc -l < "$tmp_added" | tr -d '[:space:]')

printf "Cycle %s — removed (in %s but not in %s): %d\n" "$cycle" "$prev" "$cycle" "$removed_count"
printf "Cycle %s — added (in %s but not in %s): %d\n" "$cycle" "$cycle" "$prev" "$added_count"

echo
if [[ $removed_count -gt 0 ]]; then
  echo "Removed addresses (present in members-${prev}.json but not in members-${cycle}.json):"
  cat "$tmp_removed"
  echo
fi
if [[ $added_count -gt 0 ]]; then
  echo "New addresses (present in members-${cycle}.json but not in members-${prev}.json):"
  cat "$tmp_added"
  echo
fi

if [[ -n "$outdir" ]]; then
  mkdir -p "$outdir"
  cp "$tmp_removed" "$outdir/missing-in-${cycle}.txt"
  cp "$tmp_added" "$outdir/new-in-${cycle}.txt"
  csvfile="$outdir/changes-${cycle}.csv"
  printf "status,stacker\n" > "$csvfile"
  awk '{print "removed,"$0}' "$tmp_removed" >> "$csvfile"
  awk '{print "added,"$0}' "$tmp_added" >> "$csvfile"
  echo "Wrote: $outdir/missing-in-${cycle}.txt, $outdir/new-in-${cycle}.txt, $csvfile"
fi

exit 0
