ts: 
	tsc --out index.js ts/index.ts --target ES5
	tsc --out data/content-script.js data/content-script.ts --target ES5

xpi: 
	jpm xpi

clean:
	rm index.js

.PHONY: ts
