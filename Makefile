# vim: set noexpandtab:

default: clean css html

clean:
	@rm -f index.css index.css.map index.html

css:
	@npx lessc --source-map src/style/index.less ./index.css

html:
	@stachio src/template/ .

.PHONY: default \
		clean \
		css \
		html
