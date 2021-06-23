                <div class="col-sm-12 col-md-3">
                    <div class="rg-block">
                        <?php isset($_SESSION['user_id'])?display('user-box'):display('login-box'); ?>
                    </div>
                    <div id="server_status">Статус сервера <i class="fas fa-sync-alt" title='Обновить' id="refreshServerStatus"></i>
                        <br>
                        <div id="ServerStatus">СИНХРОНИЗАЦИЯ</div>
                    </div>
                    <div id="follow_mc_links">Проголосуйте<span style="color: #126e00;">(+5SP)</span>
                        <br>
                        <a href="https://topcraft.ru/servers/6845/" target="_blank">
                            <img src="/media/img/tc-logo.png" class="tc_logo">
                        </a>
                    </div>
                    <div id="follow_mc_links">Подпишитесь
                        <br>
                        <a href="https://vk.com/solmics" target="_blank">
                            <img src="/media/img/vk_grey.png" class="follow_logos">
                        </a>
                        <a href="https://discord.gg/J7bCfBF" target="_blank">
                            <img src="/media/img/dk_grey.png" class="follow_logos">
                        </a>
                    </div>
                </div>