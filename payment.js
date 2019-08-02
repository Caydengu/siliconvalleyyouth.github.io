var classArray = classArray;
//var stripe = Stripe("pk_test_txUHW0roiaw7rDEneBF5IgCB");
var stripe = Stripe('pk_live_IiyzcOmj7fIv5anZ0W1Ukyie');
var elements = stripe.elements();
document.addEventListener("DOMContentLoaded", function (event) {
    createElements();
    formHandler();
    var id = getParam("id")
    getData(id)
});
function getParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}
// Custom styling can be passed to options when creating an Element.
var style = {
    base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: "#32325d",
    }
};
function getData(id) {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url : "http://localhost:3000/class2019?id="+id,
        dataType: "json",
        success: function(res) {
            console.log("success")
            createForm(res);
        }
    })
}
function createForm(res) {
    var data = res["data"].teachers[0];
    var className = data["classname"]
    var numClasses = data["classnumber"]
    $("#priceVar").attr('value', numClasses*15)
    $("#className").text("Payment for "+ className + " at " + data["location"] + " on " + data["time"])

}
var card = elements.create('card', { style: style });
card.addEventListener('change', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

function formHandler() {
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        stripe.createToken(card).then(function (result) {
            if (result.error) {
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                stripeTokenHandler(result.token);
            }
        });
    });
}

function stripeTokenHandler(token) {
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    $.ajax({
        url: $('#payment-form').attr('action'),
        type: 'POST',
        data: $('#payment-form').serialize(),
        success: function (response) {
            if (response == "Success") {
                writeThankYou()
            }
            if (response == "Failed") {
                alert("Payment failed, please check your credit card credentials or try again later.")
            }
        }
    });
    return false;
}
function createElements() {
    card.mount('#card-element');
}
function writeThankYou() {
    var classname = $("#ClassSelect").val().split(",")[0];
    $("#thankyoubody").fadeIn();
    $("#paymentbody").hide();
    $("#classname2").html(classname);
}


