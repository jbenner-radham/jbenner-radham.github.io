# vim: set noexpandtab:

default: clean css html tidy

clean:
	@rm -f index.css index.css.map index.html

css:
	@npx lessc --source-map src/style/index.less ./index.css

html:
	@stachio src/template/ .

tidy:
	@tidy -config .tidyrc -modify index.html

.PHONY: default \
		clean \
		css \
		html \
		tidy
