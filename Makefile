ts: 
	tsc --out index.js ts/index.ts

xpi: 
	jpm xpi

clean:
	rm index.js

.PHONY: ts
