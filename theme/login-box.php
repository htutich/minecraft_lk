                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-dark text-white user-form"><i class="fa fa-user" aria-hidden="true"></i></span>
                            </div>
                            <input type="text" class="form-control bg-dark text-white user-form" placeholder="Логин" aria-describedby="login" id="userLoginAuth">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-dark text-white user-form"><i class="fa fa-key" aria-hidden="true"></i></span>
                            </div>
                            <input type="password" class="form-control bg-dark text-white user-form" placeholder="Пароль" aria-describedby="pass" id="userPassAuth">
                        </div>
                        <div class="btn-toolbar" role="toolbar">
                            <div class="btn-group mb-3 col-12" role="group">
                                <button type="button" class="btn btn-dark login-form-btn" id='loginUserAuth'>Вход</button>
                            </div>
                            <div class="btn-group mb-3 col-12" role="group">
                                <button type="button" class="btn btn-dark login-form-btn" id="userReg">Регистрация</button>
                            </div>
                            <div class="btn-group mb-3 col-12" role="group">
                                <a href='/register/repeatCode' class="repeat-email-reg">Повторная отправка подтверждения</a>
                            </div>
                            <div class="btn-group col-12" role="group">
                                <a href='/register/resetPass' class="repeat-email-reg">Восстановить пароль</a>
                            </div>
                        </div>
                        <div id="infoBlockAuth"></div>