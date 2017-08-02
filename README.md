How to replicate bug:
1. npm install
2. node fuse
3. node runthis
4. Open http://localhost:3333/ in browser
5. Right click, inspect: you should see: Uncaught Package not found auth

How to make sure it's with aliases:

1. Go to src/App.jsx
2. Comment out line 12
3. Uncomment line 14
4. node fuse
5. node runthis
6. Open http://localhost:3333/ in browser
7. Inspect; there should be no error
