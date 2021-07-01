rm -r public
cd packages/home
hugo -D
cp public/members/index.html ../members/public
cd ../members
SKIP_PREFLIGHT_CHECK=true yarn build
cd ../..
cp -r packages/home/public .
cp -r packages/members/build/static public
cp packages/members/build/* public/members
