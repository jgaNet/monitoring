var Exec = require("../libs/exec");

var assert = require("assert");
describe('Exec', function() {
    var exec = new Exec("a", "b", "c", "d");

    describe('init', function() {
        it('exec command initialisation', function() {
            assert.equal(exec.cmd, "a");
        });

        it('exec user initialisation', function() {
            assert.equal(exec.user, "b");
        });

        it('exec variable initialisation', function() {
            assert.equal(exec.variable, "c");
        });

        it('exec value initialisation', function() {
            assert.equal(exec.value, "d");
        });
    });
});