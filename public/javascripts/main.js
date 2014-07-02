var socket = io.connect('http://localhost');

function User(socket) {
    this.socket = socket;
    this.events();
}

User.prototype.events = function() {
    this.socket.on('exec stdout', function (data){
        $("#"+data.stdout._id+" span").html(data.stdout.value);
    });

    this.socket.on('exec stderr', function (data){
        $(".errors").append(data.stderr);
    });

    /*this.socket.on('exec close', function (data){
        $(".results").append(data.close);
    });*/
};

var user = new User(socket);


$(document).ready(function(){
    $(".submit-values").on("click", function(e){
        e.preventDefault();
        user.socket.emit("exec", {
            id : $(this).parent().find(".id").val(),
            name : $(this).parent().find("label").html(),
            value : $(this).parent().find(".cmd").val()
        })
    });
});