
function getServerStatus(){
      $.ajax({url: '/ajax/main/getServerStatus',success:function(data){
        data = JSON.parse(data);
        if(data.status == 'onlain'){
          $('#ServerStatus').html('Игроков: '+data.players);
        }
        if(data.status == 'offlain'){
          $('#ServerStatus').html(data.msg);
        }
        if(data.status == 'sync'){
          $('#ServerStatus').html(data.msg);
        }
      }});

}

getServerStatus();
document.addEventListener('DOMContentLoaded', function(){
    $('#loginUserAuth').on("click", function(){
      grecaptcha.ready(function() {
        grecaptcha.execute('6LcQB34UAAAAAGYI7SQZ_ANfSyK6sDKwib69Cu0N', {action: 'login'}).then(function(token) {
          $.ajax({
            type: 'POST',
            url: '/ajax/auth/login/',
            data: {userLogin : $('#userLoginAuth').val(), userPass: $('#userPassAuth').val(), userKey: token},
            success:function(data){
              data = JSON.parse(data);
              if (data.userLogin == 'error') {
                $('#userLoginAuth').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
              }
              if (data.userPass == 'error') {
                $('#userPassAuth').css({boxShadow: '0 0 0 0.2rem #ff0000a8', backgroundColor: '#ff0000a8'});
              }
  
              if (data.userBot == 'error') {
                $('#infoBlockAuth').html(`
                  <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Внимание!</h4>
                    <p>Возможно вы бот! Да, да. Не удивляйтесь.<br>Если вы реальный человек, то подождите пару минут и попробуйте снова.<br>Если ошибка повторится, то обратитесь к разработчику сайта.<br>
                    Системный код: <b>`+data.score+`</b></p>
                  </div>
                `);
              }
  
              if (data.none == 'success') {
                window.location.href = '/main/';
              }
              if (data.authError == 'error') {
                $('#infoBlockAuth').html(`
                    <p style="color: #cccccc;">Неверный логин или пароль.</p>
                `);
              }
              setTimeout(() => { $('#infoBlockAuth').html(``); }, 5000);

            }
          });
        });
      });
    })

    $('#userLoginAuth').on("input", function(){ $('#userLoginAuth').css({boxShadow: '', backgroundColor: ''}); })
    $('#userPassAuth').on("input", function(){ $('#userPassAuth').css({boxShadow: '', backgroundColor: ''}); })

    $('#userReg').on("click", function(){ location.href='/register'; })
    $('#userLogout').on("click", function(){ $.ajax({url: '/ajax/auth/logout/',success:function(data){window.location.href = '/main/';}}); })

    $('#myCash').on("click", function(){ window.location.href = '/profile/myCash/'; })
    $('#mySkin').on("click", function(){ window.location.href = '/profile/mySkin/'; })
    $('#myPass').on("click", function(){ window.location.href = '/profile/myPass/'; })
    $('#myPerms').on("click", function(){ window.location.href = '/profile/myPerms/'; })
    $('#myRefer').on("click", function(){ window.location.href = '/profile/myRefer/'; })
    $('#myRewards').on("click", function(){ window.location.href = '/profile/myRewards/'; })
    $('#mySettings').on("click", function(){ window.location.href = '/profile/'; })
    $('#refreshServerStatus').on("click", function(){  $('#ServerStatus').html('Получение данных'); getServerStatus(); })

    setInterval(function() {getServerStatus();}, 600000);
  })
  