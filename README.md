# ssb-get-thread

An SSB plugin that exposes a get method for fetching a message and all
replies known to the server for a particular message id. This is
similar in spirit to [ssb-ooo](https://github.com/ssbc/ssb-ooo) except
there is no protocol involved to fetch messages from other nodes.

I created this plugin for the [ssb browser
demo](https://github.com/arj03/ssb-browser-demo) project as a way to
download messages outside the initial replication boundry as an
experiment.
