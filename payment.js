var classArray = classArray;
//var stripe = Stripe("pk_test_txUHW0roiaw7rDEneBF5IgCB");
var stripe = Stripe('pk_live_IiyzcOmj7fIv5anZ0W1Ukyie');
var elements = stripe.elements();
document.addEventListener("DOMContentLoaded", function (event) {
    createElements();
    formHandler();
    initSelector();
});
// Custom styling can be passed to options when creating an Element.
var style = {
    base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: "#32325d",
    }
};
function calcPrice() {
    console.log("get price");
    var priceDisplay = document.getElementById("costDisplay");
    var select = document.getElementById("ClassSelect");
    var index = select.selectedIndex;
    var noDisabled = [];
    console.log(select.childNodes);
    for (var i = 0; i < select.childNodes.length; i++) {
        if (typeof select.childNodes[i].attributes != 'undefined') {
            noDisabled.push(select.childNodes[i]);
        } else {
            console.log("disabled option");
        }
    }
    var sessions = noDisabled[index].attributes[0].nodeValue;
    console.log(sessions);
    priceDisplay.innerHTML = "Cost: " + parseInt(sessions, 10) * 15 + "$";
    document.getElementById("priceVar").value = parseInt(sessions, 10) * 15;
    console.log(noDisabled[index].attributes[1].nodeValue);
    document.getElementById("selector").value = noDisabled[index].attributes[1].nodeValue;
}
function initSelector() {
    console.log("initializing Selector")
    var selector = document.getElementById("ClassSelect");
    var location = classArray[0].locationstr;
    //Location marker
    var blank = document.createElement('option');
    selector.appendChild(blank);
    var disabledLocation = document.createElement('option');
    disabledLocation.setAttribute('disabled', "");
    disabledLocation.innerHTML = location;
    selector.appendChild(disabledLocation);
    for (var i = 0; i < classArray.length; i++) {
        if (classArray[i].locationstr == location) {

        } else {
            location = classArray[i].locationstr;
            var disabledLocation = document.createElement('option');
            disabledLocation.setAttribute('disabled', "");
            disabledLocation.innerHTML = location;
            selector.appendChild(disabledLocation);
        }
        var option = document.createElement('option');
        var inner = classArray[i].classname + ", " + classArray[i].locationstr + ", " + classArray[i].datestr + ", " + classArray[i].classNumber + " sessions";
        option.setAttribute("data-class-number", classArray[i].classNumber);
        option.setAttribute("data-selector-str", classArray[i].selector);
        console.log("set classno")
        if(classArray[i].full) {
            console.log(option)
            option.setAttribute('disabled', "")
            inner += ", FULL"
        }
        option.innerHTML = inner;
        selector.appendChild(option);
    }
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


