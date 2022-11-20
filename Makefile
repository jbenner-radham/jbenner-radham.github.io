# vim: set noexpandtab:

default: clean cname css html tidy

clean:
	@rm -rf dist

cname:
	@mkdir -p dist && cp CNAME dist/

css:
	@npx lessc --compress --source-map src/style/index.less ./dist/index.css

html:
	@npx stachio src/template/

tidy:
	@tidy -config .tidyrc -modify dist/index.html

.PHONY: default \
		clean \
		cname \
		css \
		html \
		tidy
