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
        $("#" + data.stdout.id + " span").html(data.stdout.value);
    });

    this.socket.on('exec stderr', function(data) {
        $(".errors").html(data.stderr);
    });

    /*this.socket.on('exec close', function (data){
        $(".results").append(data.close);
    });*/
};

var user = new User(socket);


$(document).ready(function() {
    $(".submit-values").on("click", function(e) {
        e.preventDefault();

        $.post($(this).parent().attr("action"), {
            id: $(this).parent().find(".id").val(),
            name: $(this).parent().find("label").html(),
            value: $(this).parent().find(".cmd").val()
        }, function(responce) {
            if (responce.error) {
                $(".errors").html(responce.error);
            }
            if (responce.message) {
                $(".message").html(responce.message);
            }
        });

    });
});