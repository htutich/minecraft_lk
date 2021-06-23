                
                <div class="col-sm-12 col-md-9" id='scroll-block'>
                    <div id="page_title">Монеты</div>
                    <p style="color: #7f7b82 !important;">Эквивалент монет<br>
                        1 золотая = 8 серебряных = 64 медных <br>
                        Мешочек с золотом = 9 золотых монет</p>
                    <div id="blog_posts_container">
                        <div class="card_content row">
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Мешочек с золотом(10шт)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/coins/coin_sack.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность получить 81 золотую монету</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">499 SP</td>
                                        <td id="donate">
                                            <button onclick="pay('coin_sack_10')" class="card_btn">Приобрести</button>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Мешочек с золотом
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/coins/coin_sack.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность получить 9 золотых монет</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">149 SP</td>
                                        <td id="donate">
                                            <button onclick="pay('coin_sack')" class="card_btn">Приобрести</button>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                        </div>
                        <div class="card_content row">
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Золотая монета
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/coins/gold_coin.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность получить 1 золотую монету</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">39 SP</td>
                                        <td id="donate">
                                            <button onclick="pay('gold_coin')" class="card_btn">Приобрести</button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Серебрянная монета
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/coins/silver_coin.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность получить 1 серебрянную монету</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">9 SP</td>
                                        <td id="donate">
                                            <button onclick="pay('silver_coin')" class="card_btn">Приобрести</button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <br>
                        <div id="page_title">Привилегии</div>
                        <div class="card_content row">
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Возможность полета
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/cards/FlyI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность к<br>команде /fly на 30 дней</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">79 SP</td>
                                        <td id="donate_fly_status">
                                            <?php if(!model_main::chechPerm('fly')){ ?>
                                                <button onclick="pay('fly')" class="card_btn">Приобрести</button>
                                            <?php } else { echo "<span style='padding-left: 50px;'>".model_main::chechPerm('fly')."</span>"; } ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Возможность вылечится
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/cards/HealI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность к<br>команде /heal на 30 дней</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">79 SP</td>
                                        <td id="donate_heal_status">
                                            <?php if(!model_main::chechPerm('heal')){ ?>
                                                <button onclick="pay('heal')" class="card_btn">Приобрести</button>
                                            <?php } else { echo "<span style='padding-left: 50px;'>".model_main::chechPerm('heal')."</span>"; } ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="card_content row">
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Сохранение инвентаря
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/cards/InsaveI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность<br>сохранять инвентарь <br>после смерти на 30 дней</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">99 SP</td>
                                        <td id="donate_keepondeath_status">
                                            <?php if(!model_main::chechPerm('keepondeath')){ ?>
                                                <button onclick="pay('keepondeath')" class="card_btn">Приобрести</button>
                                            <?php } else { echo "<span style='padding-left: 50px;'>".model_main::chechPerm('keepondeath')."</span>"; } ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <!--<div class="col-6">
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Сохранение опыта
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/ExSaveI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность<br>сохранять опыт <br>после смерти на 30 дней<br></td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">60 SP</td>
                                        <td><button  class="card_btn">Приобрести</button></td>
                                    </tr>
                                </table>
                            </div>-->
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            ТП на точку смерти
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/cards/BackI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность к<br>команде /back на 30 дней</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">49 SP</td>
                                        <td id="donate_back_status">
                                            <?php if(!model_main::chechPerm('back')){ ?>
                                                <button onclick="pay('back')" class="card_btn">Приобрести</button>
                                            <?php } else { echo "<span style='padding-left: 50px;'>".model_main::chechPerm('back')."</span>"; } ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="card_content row">
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Бессмертие
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/cards/GodI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность к<br>команде /god на 30 дней</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">299 SP</td>
                                        <td id="donate_god_status">
                                            <?php if(!model_main::chechPerm('god')){ ?>
                                                <button onclick="pay('god')" class="card_btn">Приобрести</button>
                                            <?php } else { echo "<span style='padding-left: 50px;'>".model_main::chechPerm('god')."</span>"; } ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Эндерсундук
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/cards/EnchestI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность к<br>команде /enderchest <br>на 30 дней<br></td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">49 SP</td>
                                        <td id="donate_enderchest_status">
                                            <?php if(!model_main::chechPerm('enderchest')){ ?>
                                                <button onclick="pay('enderchest')" class="card_btn">Приобрести</button>
                                            <?php } else { echo "<span style='padding-left: 50px;'>".model_main::chechPerm('enderchest')."</span>"; } ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="card_content row">
                            <div class="col-md-6 col-sm-12" align='center'>
                                <table class="card_table">
                                    <tr>
                                        <td class="card_name" colspan="2">
                                            Починка предметов
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="card_icon"><img src="/media/img/donate/cards/RepairI.png" style="height: 80px; padding: 10px;"></td>
                                        <td  class="card_disc">Дает возможность к<br>команде /repair на 30 дней</td>
                                    </tr>
                                    <tr>
                                        <td class="card_coast">49 SP</td>
                                        <td id="donate_repair_status">
                                            <?php if(!model_main::chechPerm('repair')){ ?>
                                                <button onclick="pay('repair')" class="card_btn">Приобрести</button>
                                            <?php } else { echo "<span style='padding-left: 50px;'>".model_main::chechPerm('repair')."</span>"; } ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <br><!--
                        <div id="page_title">Наборы предметов</div>
                        <div class="card_content row">
                            <div class="col-md-6 col-sm-12" align='center' style="min-height: 250px;">
                                <h3 style="color: #8d8e8d;">Начальный</h3>
                                <img src="/media/img/donate/kits/nachalniy.png" class="mb-3">
                                <button onclick="pay('nachalniy')" class="btn btn-dark">Приобрести за <span style="color: #05d405;">99SP</span> <s style="color: #ff4f4f;">199SP</s></button>
                            </div>
                            <div class="col-md-6 col-sm-12" align='center' style="min-height: 250px;">
                                <h3 style="color: #8d8e8d;">Продвинутый</h3>
                                <img src="/media/img/donate/kits/prodvinutiy.png" class="mb-3">
                                <button onclick="pay('prodvinutiy')" class="btn btn-dark">Приобрести за <span style="color: #05d405;">199SP</span> <s style="color: #ff4f4f;">299SP</s></button>
                            </div>
                            <div class="col-md-6 col-sm-12" align='center' style="min-height: 250px;">
                                <h3 style="color: #8d8e8d;">Продвинутый+</h3>
                                <img src="/media/img/donate/kits/prodvinutiyplus.png" class="mb-3">
                                <button onclick="pay('prodvinutiyplus')" class="btn btn-dark">Приобрести за <span style="color: #05d405;">299SP</span> <s style="color: #ff4f4f;">399SP</s></button>
                            </div>
                            <div class="col-md-6 col-sm-12" align='center' style="min-height: 250px;">
                                <h3 style="color: #8d8e8d;">Яйца призыва</h3>
                                <img src="/media/img/donate/kits/eggspriziv.png" class="mb-3">
                                <button onclick="pay('eggspriziv')" class="btn btn-dark">Приобрести за <span style="color: #05d405;">99SP</span> <s style="color: #ff4f4f;">199SP</s></button>
                            </div>
                        </div>-->
                    </div>
                </div>