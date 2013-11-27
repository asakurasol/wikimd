debug_output = wikimd.css
release_output = wikimd.min.css

entry = src/index.less
less = node ../node_modules/less/bin/lessc

all: debug release

debug: $(debug_output)
$(debug_output):
	$(less) $(entry) $(debug_output)

release: $(release_output)
$(release_output):
	$(less) --clean-css $(entry) $(release_output)

clean: clean-debug clean-release

clean-debug:
	rm -f $(debug_output)

clean-release:
	rm -f $(release_output)

.PHONY: all debug release clean clean-debug clean-release
