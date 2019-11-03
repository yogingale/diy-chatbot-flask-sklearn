var data=[];
var left_li_no = 0;
function addBr(text){
    return text.replace(/\n/g, "<br />");

}
var Message;
Message = function (arg) {
    this.text = arg.text, this.message_side = arg.message_side;
    this.draw = function (_this) {
        return function () {
            var $message;
            $message = $($('.message_template').clone().html());
            $message.addClass(_this.message_side).find('.text').html(addBr(_this.text));
            $message.addClass(arg.message_side+'_msg_'+ left_li_no);
            $('.messages').append($message);
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
};

function showBotMessage(msg,question){
        message = new Message({
             text: msg,
             message_side: 'left'
        });
         message.draw();
        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        if (!msg.includes("I can't find relatable Question")){
            $('.messages li:last').append('<li class="confirmation_buttons"><input type ="hidden" id = "que_'+left_li_no+'" value = "'+question+'" disabled><input type ="hidden" id = "ans_'+left_li_no+'" value = "'+msg+'" disabled><button type="button" id = "cr_'+left_li_no+'" class="correct btn btn-success"><span class="glyphicon glyphicon-ok"></span> Correct</button><button type="button" id = "wr_'+left_li_no+'"  class="wrong btn btn-danger"><span class="glyphicon glyphicon-remove"></span> Wrong</button></li>');
                left_li_no++;
        }
}
function showUserMessage(msg){
        $messages = $('.messages');
        message = new Message({
            text: msg,
            message_side: 'right'
        });
        message.draw();
        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        $('#msg_input').val('');
}
function sayToBot(text){
    document.getElementById("msg_input").placeholder = "Type your messages here..."
    $.post("/chat",
            {
                //csrfmiddlewaretoken:csrf,
                text:text,
            },
            function(jsondata, status){
                if(jsondata["status"]=="success"){
                    response=jsondata["response"];
                    console.log(jsondata);
                    if(response){showBotMessage(response, text);}
                }
            });

}

getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };

$("#say").keypress(function(e) {
    if(e.which == 13) {
        $("#saybtn").click();
    }
});

$('.send_message').click(function (e) {
        msg = getMessageText();
        if(msg){
        showUserMessage(msg);
        sayToBot(msg);
    $('.message_input').val('');}
});

$('.message_input').keyup(function (e) {
    if (e.which === 13) {
        msg = getMessageText();
        if(msg){
        showUserMessage(msg);
        sayToBot(msg);
    $('.message_input').val('') ;}
    }
});

function confirmation(feedback_type, id, type){      
    var question = $('#que_'+id).val();
    var answer = $('#ans_'+id).val();
    // $( ".confirmation_buttons" ).remove();
    // $('.left_msg_'+id).find('.avatar').html('<span class="status glyphicon glyphicon-'+type+'"></span>');
    $.post("/confirmation",
            {
                //csrfmiddlewaretoken:csrf,
                question:question,
                answer:answer,
                feedback_type:feedback_type,
            },
            function(jsondata, status){
                if(jsondata["status"]=="success"){
                    $( ".confirmation_buttons" ).remove();
                    $('.left_msg_'+id).find('.avatar').html('<span class="status glyphicon glyphicon-'+type+'"></span>');
                }
            });

}

$(document).on("click",".correct",function() {
        var id = $(this).attr('id');;
         id = id.replace('cr_', '');
        confirmation('positive', id, 'ok');
});
$(document).on("click",".wrong",function() {
        var id = $(this).attr('id');
         id = id.replace('wr_', '');
        confirmation('negative', id, 'remove');
});