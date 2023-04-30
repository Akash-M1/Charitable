async function createOrder(){
    let amount={"amount":800};
    $.ajax({
        type: "Post",
        url: "/payment/create-order",
        data: JSON.stringify(amount),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (response) {
            openRazor(response,amount);
        },
        error:function(err){
            console.log("Error",err);
        }
    });    
}


function openRazor(order,amount){
    var options = {
        "key": order.key_id,
        "amount": order.amount, 
        "currency": order.currency,
        "name": "Charitable",
        "description": "Donate for a cause",
        "order_id": order.id, 
        "handler":async function(response){
            $.ajax({
                type: "Post",
                url: "/payment/save-order",
                data: JSON.stringify({"response":response,"amount":(amount.amount)/100,"transactionDone":true}),
                contentType: "application/json; charset=utf-8",
                traditional: true,
                success: function (response1) {
                    console.log(response1);
                    window.location.replace("/thank-you");
                },
                error:function(err){
                    console.log(err.responseText);
                }
            });
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp1 = new Razorpay(options);
    document.getElementById('rzp-button1').onclick = function(e){
        rzp1.open();
        e.preventDefault();
    }
}

createOrder();