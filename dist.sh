
echo "› Building..."
yarn build:dist

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

cp package.json dist/package.json

echo "› Copied package.json & ecli to /dist"

cd dist || exit

npm publish --access=public

echo "› Published changes to npm"

