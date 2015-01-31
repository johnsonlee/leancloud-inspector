var fs = require('fs');
var path = require('path');

(function() {

    this.index = function(req, res) {
        res.render('index', {});
    };

    this.tree = function(req, res) {
        fs.stat(req.path, function(err, stats) {
            if (err) {
                res.render('error', {
                    message : err,
                });
            } else if (stats.isDirectory()) {
                fs.readdir(req.path, function(err, files) {
                    if (err) {
                        res.render('error', {
                            message : err,
                        });
                    } else {
                        if (!/^\/$/.test(req.path)) {
                            files.unshift('..');
                        }

                        var data = [];
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];

                            data.push({
                                name : file,
                                path : path.join(req.path, file),
                            });
                        }

                        res.render('tree', {
                            data : data,
                            path : req.path,
                        });
                    }
                });
            } else if (stats.isFile()) {
                fs.readFile(req.path, { flag : 'r' }, function(err, data) {
                    if (err) {
                        res.render('error', {
                            message : err,
                        });
                    } else {
                        res.render('raw', {
                            data : data,
                            path : req.path,
                        });
                    }
                });
            } else {
                res.render('error', {
                    message : 'Unsupported file type',
                });
            }
        });
    };

}).call(module.exports);
