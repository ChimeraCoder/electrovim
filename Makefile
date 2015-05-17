ts: 
	tsc --out index.js ts/index.ts --target ES6
	tsc --out data/content-script.js data/content-script.ts

xpi: 
	jpm xpi

clean:
	rm index.js

.PHONY: ts
