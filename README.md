# PSR.js
=====

PSR.js visualizes the statistics in the PSR database through the PSR API (http://popdata.unhcr.org/wiki/index.php/API_Documentation).

### Develop

To setup for development, clone the repo:

```
g clone https://github.com/unhcr/psr.js.git
```

Edit the files in the `src` directory. You can run `grunt watch` and the files in `src` will be compiled to javascript and concatenated into one file.

To view the examples, run any http server:

```
python -m SimpleHTTPServer 8080
```

_Note: You must be in the root directory_

Then navigate to an example:

```
http://localhost:8080/examples/persons_of_concern.html
```
