var fs = require('fs');
var path = require('path');

(function() {

    this.index = function(req, res) {
        res.render('index', {});
    };

    this.ls = function(req, res) {
        fs.stat(req.path, function(err, stats) {
            if (err) {
                res.send(500, {
                    error : err,
                });
            } else if (stats.isDirectory()) {
                fs.readdir(req.path, function(err, files) {
                    if (err) {
                        res.send(500, {
                            error : err,
                        });
                    } else {
                        var lines = [];

                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            var abspath = path.join(req.path, file);
                            var fstats = fs.statSync(abspath);

                            if (fstats.isDirectory()) {
                                lines.push(['d', abspath].join('\t'));
                            } else if (fstats.isFile()) {
                                lines.push(['f', abspath].join('\t'));
                            } else if (fstats.isBlockDevice()) {
                                lines.push(['b', abspath].join('\t'));
                            } else if (fstats.isCharacterDevice()) {
                                lines.push(['c', abspath].join('\t'));
                            } else if (fstats.isSymbolicLink()) {
                                lines.push(['l', abspath].join('\t'));
                            } else {
                                lines.push(['?', abspath].join('\t'));
                            }
                        }

                        res.type('text/plain');
                        res.send(lines.join('\n'));
                    }
                });
            } else if (stats.isFile()) {
                fs.readFile(req.path, { flag : 'r' }, function(err, data) {
                    if (err) {
                        res.send(500, {
                            error : err,
                        });
                    } else {
                        res.send(data);
                    }
                });
            } else {
                res.send(500, {
                    error : 'Unsupported file type',
                });
            }
        });
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
                            var stat = fs.statSync(path.join(req.path, file));
                            var type = '?';

                            if (stat.isDirectory()) {
                                type = 'd';
                            } else if (stat.isFile()) {
                                type = 'f';
                            } else if (stat.isSymbolicLink()) {
                                type = 'l';
                            } else {
                                type = '?';
                            }

                            data.push({
                                name : file,
                                type : type,
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
                res.type('text/plain');
                res.sendfile(req.path, {
                    maxAge : 3600000,
                    root : '/',
                }, function(err) {
                    res.render('error', {
                        message : err,
                    });
                });
            } else {
                res.render('error', {
                    message : 'Unsupported file type',
                });
            }
        });
    };

}).call(module.exports);
