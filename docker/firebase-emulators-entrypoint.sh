#!/bin/sh
set -eu

project_id="${FIREBASE_DEMO_PROJECT_ID:-demo-linda-writer}"
data_dir="${FIREBASE_EMULATOR_DATA_DIR:-/data/export}"
functions_dir="/workspace/functions"
modules_dir="${functions_dir}/node_modules"
lock_file="${functions_dir}/package-lock.json"
lock_marker="${modules_dir}/.package-lock.sha256"

mkdir -p "${data_dir}"

if [ -f "${lock_file}" ]; then
  current_lock_hash="$(sha256sum "${lock_file}" | awk '{print $1}')"
  installed_lock_hash=""
  if [ -f "${lock_marker}" ]; then
    installed_lock_hash="$(tr -d '\r\n' < "${lock_marker}")"
  fi

  if [ ! -d "${modules_dir}/firebase-functions" ] || [ "${current_lock_hash}" != "${installed_lock_hash}" ]; then
    echo "Installing Cloud Functions dependencies..."
    npm ci --prefix "${functions_dir}" --no-audit --no-fund
    printf '%s\n' "${current_lock_hash}" > "${lock_marker}"
  fi
fi

echo "Building Cloud Functions..."
npm run build --prefix "${functions_dir}"

# Keep TypeScript Functions compiled while the emulator is running. The
# Functions emulator reloads when the generated lib files change.
npm run build:watch --prefix "${functions_dir}" -- --preserveWatchOutput &

set -- \
  emulators:start \
  --only auth,firestore,functions,storage \
  --project "${project_id}"

if [ -f "${data_dir}/firebase-export-metadata.json" ]; then
  set -- "$@" --import="${data_dir}"
fi

echo "Starting Firebase Emulator Suite for ${project_id}..."
# Firebase creates a temporary export directory in its current working
# directory. Keep that staging area in the container filesystem; the completed
# export is then copied to the persisted bind mount without polluting the repo.
cd /tmp
exec firebase --config /workspace/firebase.json "$@"
