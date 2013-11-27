all: debug release

debug:
	$(MAKE) -C css debug
	$(MAKE) -C js debug

release:
	$(MAKE) -C css release
	$(MAKE) -C js release

clean: clean-debug clean-release

clean-debug:
	$(MAKE) -C css clean-debug
	$(MAKE) -C js clean-debug

clean-release:
	$(MAKE) -C css clean-release
	$(MAKE) -C js clean-release

.PHONY: all debug release clean clean-debug clean-release
