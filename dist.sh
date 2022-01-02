
echo "› Building..."
tsc

echo "› What did you change in this update?"
read commitMessage

if [ "$(git status --porcelain | wc -l)" -eq "0" ]; then
  echo "› 🟢 Git repo is clean."
else
  echo "› Repo is dirty, committing changes"
fi

echo "› Incrementing version"
npm version patch --no-git-tag-version

git add .
git commit -m ":package: $commitMessage"
git push origin next

echo "› Committed and pushed changes"

npm publish --access=public

echo "› Published changes to npm"

