document.getElementById('scroll-block').scrollIntoView({block: "start", behavior: 'smooth'});
document.addEventListener('DOMContentLoaded', function(){
  $('#registerUser').on("click", function(){
    grecaptcha.ready(function() {
      grecaptcha.execute('6LcQB34UAAAAAGYI7SQZ_ANfSyK6sDKwib69Cu0N', {action: 'register'}).then(function(token) {
        $.ajax({
          type: 'POST',
          url: '/ajax/register/checkuser/',
          data: {userLogin : $('#userLogin').val(), userPass: $('#userPass').val(), userEmail: $('#userEmail').val(), userKey: token},
          success:function(data){
            data = JSON.parse(data);
            if (data.userLogin == 'error') {
              $('#userLogin').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
              $('#infoBlock').html(`
              <p style="color: #cccccc;">Неверный Login.</p>
            `);
            }
            if (data.userPass == 'error') {
              $('#userPass').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
              $('#infoBlock').html(`
                <p style="color: #cccccc;">Неправильный пароль.</p>
              `);
            }
            if (data.userEmail == 'error') {
              $('#userEmail').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
              $('#infoBlock').html(`
                <p style="color: #cccccc;">Неверный Email.</p>
              `);
            }
            if (data.userBot == 'error') {
              $('#infoBlock').html(`
                <div class="alert alert-danger" role="alert">
                  <h4 class="alert-heading">Внимание!</h4>
                  <p>Возможно вы бот! Да, да. Не удивляйтесь.<br>Если вы реальный человек, то подождите пару минут и попробуйте снова.<br>Если ошибка повторится, то обратитесь к разработчику сайта.</p>
                </div>
              `);
            }

            if (data.none == 'success') {
              $('#infoBlock').html(`<p style="color: #cccccc;">Благодарим за регистрацию!</p>`);
              /*$('#infoBlock').html(`
                  <p style="color: #cccccc;">Благодарим за регистрацию!<br>Вам отправленно письмо с подтверждением регистрации.</p>
              `);*/
            }
            setTimeout(() => { $('#infoBlock').html(``); }, 5000);

           }
        });
      });
    });
  })

  $('#userLogin').on("input", function(){ $('#userLogin').css({boxShadow: '', backgroundColor: ''}); })
  $('#userPass').on("input", function(){ $('#userPass').css({boxShadow: '', backgroundColor: ''}); })
  $('#userEmail').on("input", function(){ $('#userEmail').css({boxShadow: '', backgroundColor: ''}); })

  $('#repeatCode').on("click", function(){
    grecaptcha.ready(function() {
      grecaptcha.execute('6LcQB34UAAAAAGYI7SQZ_ANfSyK6sDKwib69Cu0N', {action: 'repeatCode'}).then(function(token) {
        $.ajax({
          type: 'POST',
          url: '/ajax/register/repeatCodeCheck/',
          data: {userEmail: $('#userEmail').val(), userKey: token},
          success:function(data){
            console.log(data);
            data = JSON.parse(data);
            if (data.userEmail == 'error') {
              $('#infoBlock').html(`
                  <p style="color: #cccccc;">Неверный Email.</p>
              `);
              $('#userEmail').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
            }
            if (data.userBot == 'error') {
              $('#infoBlock').html(`
                <div class="alert alert-danger" role="alert">
                  <h4 class="alert-heading">Внимание!</h4>
                  <p>Возможно вы бот! Да, да. Не удивляйтесь.<br>Если вы реальный человек, то подождите пару минут и попробуйте снова.<br>Если ошибка повторится, то обратитесь к разработчику сайта.</p>
                </div>
              `);
            }

            if (data.none == 'success') {
              $('#infoBlock').html(`
                  <p style="color: #cccccc;">Отправленно повторное письмо.</p>
              `);
            }
            if (data.BadEmail == 'error') {
              $('#infoBlock').html(`
                <p style="color: #cccccc;">Неверный Email или аккаунт уже активирован!</p>
              `);
            }
           }
        });
      });
    });
  })

  $('#resetPass').on("click", function(){
    grecaptcha.ready(function() {
      grecaptcha.execute('6LcQB34UAAAAAGYI7SQZ_ANfSyK6sDKwib69Cu0N', {action: 'resetPass'}).then(function(token) {
        $.ajax({
          type: 'POST',
          url: '/ajax/register/resetPass_/',
          data: {userEmail: $('#userEmail').val(), userKey: token},
          success:function(data){
            console.log(data);
            data = JSON.parse(data);
            if (data.userEmail == 'error') {
              $('#infoBlock').html(`
                  <p style="color: #cccccc;">Неверный Email.</p>
              `);
              $('#userEmail').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
            }
            if (data.userBot == 'error') {
              $('#infoBlock').html(`
                <div class="alert alert-danger" role="alert">
                  <h4 class="alert-heading">Внимание!</h4>
                  <p>Возможно вы бот! Да, да. Не удивляйтесь.<br>Если вы реальный человек, то подождите пару минут и попробуйте снова.<br>Если ошибка повторится, то обратитесь к разработчику сайта.</p>
                </div>
              `);
            }
            if (data.Email == 'error') {
              $('#infoBlock').html(`
                <p style="color: #ef2525;">Неверный email.</p>
              `);
            }
            if (data.none == 'success') {
              $('#infoBlock').html(`
                  <p style="color: #cccccc;">Новый пароль отправлен на почту.</p>
              `);
            }
            
           }
        });
      });
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