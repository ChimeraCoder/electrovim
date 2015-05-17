ts: 
	tsc --out index.js ts/index.ts --target ES5
	tsc --out data/frame-script.js data/frame-script.ts

xpi: 
	jpm xpi

clean:
	rm index.js

.PHONY: ts
