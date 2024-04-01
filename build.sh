rm -r public
cd packages/home
npx tsx ../members/scripts/generate-user-data.ts
hugo -D
cp public/members/index.html ../members/public
cd ../members
npx yarn
SKIP_PREFLIGHT_CHECK=true npx yarn build
cd ../..
cp -r packages/home/public .
cp -r packages/members/build/static public
cp packages/members/build/* public/members
