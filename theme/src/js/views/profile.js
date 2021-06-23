function pay(donate) {
	$.ajax({
		url: "/ajax/profile/donate",
		type: 'POST',
		data: {donate:donate},
		success: function(data){
			if (data == 'dont_have_money') {
				alert('У вас не достаточно SP на счету!');
			}
			if (data == 'success') {
				alert( 'Вы успешно активировали '+donate+' на 30 дней.');

				$.ajax({
					url: "/ajax/profile/donate",
					type: 'POST',
					data: {check_don:donate},
					success: function(data){
						$('#donate_'+donate+'_status').html('');
						$('#donate_'+donate+'_status').append("<span style='padding-left: 50px;'>"+data+"</span>");
					}
				});

      }
      if (data == 'kit_give') {alert( 'Набор выдан!');}
      
			if (data == 'coin_sack_10') {alert( 'Мешочек с золотом(10шт) выданы');}
			if (data == 'coin_sack') {alert( 'Мешочек с золотом выдана');}
			if (data == 'gold_coin') {alert( 'Золотая монета выдана');}
			if (data == 'silver_coin') {alert( 'Серебрянная монета выдана');}
			if (data == 'user_offline') {
				alert('Для активации '+donate+' ваш персонаж должен быть на сервере! Выдача происходит в онлайн режиме моментально!');
			}
			if (data == 'user_online') {
				alert('user_online '+donate);
			}
		}
	});
}

function calculateBonuses() {
  var coinPrice = parseFloat($('#unitpayForm #coinPrice').val());
  var coins = parseInt($('#unitpayForm #coins').val());
  if (isNaN(coins) || isNaN(coinPrice) || coins <= 0) {
    $('#unitpayForm #sum').val('');
    return;
  }
  var price = coins * coinPrice;
  if (price > 15000) {
    price = 15000;
  }
  $('#unitpayForm #sum').val(price);
}

$(function () {
  $('#unitpayForm input#coins').keyup(function () {
    calculateBonuses();
  });
  calculateBonuses();
  $('#unitpayForm').submit(function(){
    var sum = parseFloat($('#unitpayForm #sum').val());
    if (isNaN(sum) || sum <= 0 || sum > 15000) {
      alert('Неверная сумма платежа');
      return false;
    }
  });
});

function show3d(data){
  $('#skinViewer3D').html('<canvas id="canvas" style="display: none"></canvas> ');
  data = JSON.parse(data);
  var lk = new _lk();
  lk.skin3D = new skin3D(data.skin, document.getElementById('skinViewer3D')); 
  lk.skin3D.init(); 
  lk.skin3D.createBlock('.'); 
  lk.pathToSkins = data.skin; 
  lk.pathToCloaks = data.cloak; 
  lk.skin3D.createCloak(data.cloak); 
}

document.addEventListener('DOMContentLoaded', function(){

  document.getElementById('collaboration_section').scrollIntoView({ behavior: 'smooth'});

  if(document.getElementById('skinViewer3D')){
    $.ajax({url: '/ajax/profile/get3D/',success:function(data){show3d(data);}});
  }

  $(".skin-uploader, .cloak-uploader").on("change", function(e){
    e.preventDefault();
    $.ajax({
            url: "/ajax/profile/upload",
      type: "POST",
      data:  new FormData(this),
      contentType: false,
            cache: false,
      processData:false,
      success: function(data)
        {
          data = JSON.parse(data);
          if (data.status == 'success') {
            $.ajax({url: '/ajax/profile/get3D/',success:function(data){show3d(data);}});
            $('#userHeadLogin').html('<img src="/ajax/profile/getHead">');
            $('#infoBox').html(data.message);
          }
          if (data.status == 'error') {
            $('#infoBox').html(data.message);
          }
        },
        error: function(e) 
        {
          console.log(e);
        }          
      });
  });


    $('#changePassword').on("click", function(){
        $.ajax({
            type: 'POST',
            url: '/ajax/profile/changePass/',
            data: {userPass : $('#userPass').val(), userNewPass: $('#userNewPass').val()},
            success:function(data){

                data = JSON.parse(data);
                if (data.userPass == 'error') {
                    $('#userPass').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
                    $('#infoBlock').html(`
                        <p style="color: #cccccc;">Неверный пароль.</p>
                    `);
                }
                if (data.userNewPass == 'error') {
                    $('#userNewPass').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
                    $('#infoBlock').html(`
                        <p style="color: #cccccc;">Неверный формат пароля.</p>
                    `);
                }

                if (data.none == 'success') {
                    $('#infoBlock').html(`
                        <p style="color: #cccccc;">Пароль успешно изменен.</p>
                    `);
                }
                if (data.authError == 'error') {
                    window.location.href = '/main/';
                }

                setTimeout(() => { $('#infoBlock').html(``); }, 5000);
            }
        });
    })

})


particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 355,
      "density": {
        "enable": true,
        "value_area": 789.1476416322727
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.48927153781200905,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 0.2,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 2,
        "size_min": 0,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.8,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 0.2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 83.91608391608392,
        "size": 1,
        "duration": 3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

