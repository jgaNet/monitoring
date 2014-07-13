if (document.addEventListener) { // > ie 9 
    var transports = ['websocket', 'polling'];
} else {
    var transports = ['polling', 'websocket'];
}

var socket = io.connect('http://' + window.location.host, {
    transports: transports
});

function User(socket) {
    this.socket = socket;
    this.events();
}

User.prototype.events = function() {
    this.socket.on('exec stdout', function(data) {
        $("#" + data.stdout._id + " span").html(data.stdout.value);
    });

    this.socket.on('exec stderr', function(data) {
        $(".errors").append(data.stderr);
    });

    /*this.socket.on('exec close', function (data){
        $(".results").append(data.close);
    });*/
};

var user = new User(socket);


$(document).ready(function() {
    $(".submit-values").on("click", function(e) {
        e.preventDefault();
        var value = $(this).parent().find(".cmd").val();

        //if (/^\d+$/.test(value)) {
        user.socket.emit("exec", {
            id: $(this).parent().find(".id").val(),
            name: $(this).parent().find("label").html(),
            value: $(this).parent().find(".cmd").val()
        });
        /*} else {
            $(".errors").html("value must be a number type");
        }*/
    });
});