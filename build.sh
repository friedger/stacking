rm -r public
mkdir -p public/when

cd packages/home
# generate data
npx tsx ../members/scripts/generate-user-data.ts
npx tsx ../members/scripts/generate-stats.ts
# build static site
hugo -D
cp public/members/index.html ../members/public
cd ../members
# build react site
pnpm install
pnpm run build
cd ../..
cp -r packages/home/public .
cp -r packages/members/dist/* public/members
cp -r packages/when/dist/* public/when
