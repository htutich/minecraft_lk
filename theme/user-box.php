                        <div class="mb-3 align-center" id='userHeadLogin'>
                            <img src="/ajax/profile/getHead">
                        </div>
                        <div class='mb-3 text-white'>
                            <p style="text-align: center;">
                                Привет, <?=$_SESSION['login']?>!<br> Личный кабинет в стадии разработки.
                            </p>
                        </div>
                        <div class="btn-toolbar" role="toolbar">
                            <div class="btn-group mb-3 col-12 text-white" role="group">
                                <span class="badge badge-secondary" style="width: 100%;font-size: 15px;padding-top: 10px;padding-bottom: 10px;"><b>На счету:</b>&nbsp;<?=model_main::getRealMoney($_SESSION['login'])?>&nbsp;SP</span>
                            </div>
                            <div class="btn-group mb-3 col-12" role="group">
                                <button type="button" class="btn btn-dark login-form-btn" id='mySettings' >Личный кабинет</button>
                            </div>
                            <div class="btn-group mb-3 col-12" role="group">
                                <button type="button" class="btn btn-dark login-form-btn" id='userLogout' >Выход</button>
                            </div>
                        </div>