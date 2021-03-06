#!/usr/bin/env sh
# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
git init
git add -A
git commit -m 'deploy-page'


# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:kikuchiken-waseda/mri-vuewer.ver2.git master:gh-pages
cd -
