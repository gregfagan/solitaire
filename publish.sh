npm run build
cd build
git init
git remote add origin https://github.com/gregfagan/solitaire.git
git checkout --orphan gh-pages
git add --all
git commit -m "Publishing"
git push origin --delete gh-pages
git push origin gh-pages