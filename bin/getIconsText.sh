GTROOT=$(git rev-parse --show-toplevel)
SRC="$GTROOT/src"
grep -rE "mdi-[a-z]+" "$SRC" | grep -oP "mdi-[a-z|-]+" | sort | uniq
