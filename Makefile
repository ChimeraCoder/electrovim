ts: 
	tsc --out index.js ts/index.ts
	tsc --out data/content-script.js data/content-script.ts

xpi: 
	jpm xpi

clean:
	rm index.js

.PHONY: ts
