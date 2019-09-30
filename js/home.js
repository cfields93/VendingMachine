$(document).ready(function(){
    loadItems();

    var parent = document.querySelector('#left-content');
    parent.addEventListener('click', itemSelect, false);

    $('#make-purchase').on("click", function(){
        if($('#item-number').val() == null){
            $('#messages').val('Please make a selection.');
        }
        else{
            purchaseItem($('#money-in').val(), $('#item-number').val());
        }
    })

    $('#change-return').on("click", function(){
        $('#item-number').val('');
        $('#money-in').val('');
        $('#change').val('');
        $('#messages').val('');
        loadItems();
    })

    $('#add-dollar').on("click", function(){
        var money = $('#money-in').val();
        money = Number(money) + 1.00;
        $('#money-in').val(money);
    })

    $('#add-quarter').on("click", function(){
        var money = $('#money-in').val();
        money = Number(money) + 0.25;
        $('#money-in').val(money);    
    })

    $('#add-dime').on("click", function(){
        var money = $('#money-in').val();
        money = Number(money) + 0.10;
        $('#money-in').val(money);    
    })

    $('#add-nickel').on("click", function(){
        var money = $('#money-in').val();
        money = Number(money) + 0.05;
        $('#money-in').val(money);    
    })
})

function purchaseItem(amount, id){
    $.ajax({
        type: 'POST',
        url: 'http://tsg-vending.herokuapp.com/money/' + amount + '/item/' + id,
        success: function(response){
            var message = 'Thank You!!!';
            var change = response.quarters + ' Quarters, ';
            change += response.dimes + ' Dimes, ';
            change += response.nickels + ' Nickels, ';
            change += response.pennies + ' Pennies';
            $('#messages').val(message);
            $('#change').val(change);

            loadItems();
        },
        error: function(xhr, status, response){
            var error = jQuery.parseJSON(xhr.responseText);
            $('#messages').val(error.message);
        }
        
    })
}

function loadItems(){
    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function(itemArray){
            $('#left-content').empty();
            var textCode = '';
            $.each(itemArray, function(index, item){
                if(index == 0 || index % 3 == 0){
                    textCode = '<div class="row">';
                }
                textCode += '<div class="col"><div class="card text-white bg-dark mb-3" style="max-width: 18rem;"><div class="card-header">';
                textCode += item.id;
                textCode += '</div><div class="card-body"><h5 class="card-title text-center">';
                textCode += item.name;
                textCode += '</h5><p class="card-text text-center">$' + item.price + '</br></br></br>Quantity Left: ' + item.quantity + '</p>';
                textCode += '<a class="btn btn-outline-light" id="' + index + '">Select</a></div></div></div>';
                if(index == 2 || index % 3 == 2){
                    textCode += '</div>';
                    $('#left-content').append(textCode);

                }

            })
        }
    })
}

function itemSelect(e){
    var item = Number(e.target.id);
    $('#item-number').val(item);

    e.stopPropagation();    
}