sed 's#\"dist/#\"#g' package.json > ./dist/package.json
cp README.md ./dist/README.md
cd ./dist
npm publish
rm ./package.json
rm ./README.md
cd ..