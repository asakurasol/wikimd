debug_output = wikimd.js
release_output = wikimd.min.js

entry = src/index.js
browserify = node ../node_modules/.bin/browserify
uglify = node ../node_modules/.bin/uglifyjs

all: debug release

debug: $(debug_output)
$(debug_output):
	$(browserify) $(entry) --debug --outfile=$(debug_output)

release: $(release_output)
$(release_output):
	$(browserify) $(entry) | $(uglify) - -mc --output=$(release_output)

clean: clean-debug clean-release

clean-debug:
	rm -f $(debug_output)

clean-release:
	rm -f $(release_output)

.PHONY: all debug release clean clean-debug clean-release
