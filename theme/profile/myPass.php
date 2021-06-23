
                <div class="col-sm-12 col-md-9" id='scroll-block'>
                    <div id="page_title">Сменить пароль</div>
                    <div id="blog_posts_container">
                        <div class="row">

                            <div class="form-group col-12 col-md-6">
                                <label for="userPass" class="text-white">Введите старый пароль</label>
                                <input type="text" class="form-control bg-dark user-form" id="userPass">
                                <small id="userPass" class="form-text text-muted">Буквы, цифры, 8+ знаков</small>
                            </div>

                            <div class="form-group col-12 col-md-6">
                                <label for="userPass" class="text-white">Введите желаемый пароль</label>
                                <input type="text" class="form-control bg-dark user-form" id="userNewPass" value="<?=randomPassword()?>">
                                <small id="userPass" class="form-text text-muted">Буквы, цифры, 8+ знаков</small>
                            </div>

                            <div class="col-12 col-md-12">
                                <button type="button" class="btn btn-dark" id="changePassword">Подтвердить</button>
                            </div>

                            <div id="infoBlock"></div>
                        </div>
                    </div>
                </div>