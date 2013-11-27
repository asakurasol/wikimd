debug_output = main.js
release_output = main.min.js

entry = src/index.js
browserify = node ../node_modules/browserify/bin/cmd.js
uglify = node ../node_modules/uglify-js/bin/uglifyjs

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
