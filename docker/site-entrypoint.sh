#!/bin/sh
set -eu

modules_dir="/workspace/node_modules"
lock_file="/workspace/package-lock.json"
lock_marker="${modules_dir}/.root-package-lock.sha256"

if [ ! -f "${lock_file}" ]; then
  echo "Missing package-lock.json; refusing a non-reproducible install." >&2
  exit 1
fi

current_lock_hash="$(sha256sum "${lock_file}" | awk '{print $1}')"
installed_lock_hash=""
if [ -f "${lock_marker}" ]; then
  installed_lock_hash="$(tr -d '\r\n' < "${lock_marker}")"
fi

if [ ! -d "${modules_dir}/vite" ] || [ "${current_lock_hash}" != "${installed_lock_hash}" ]; then
  echo "Installing site dependencies..."
  npm ci --no-audit --no-fund
  printf '%s\n' "${current_lock_hash}" > "${lock_marker}"
fi

exec npm run dev:docker
