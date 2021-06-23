                <div class="col-sm-12 col-md-9" id='scroll-block'>
                    <div id="page_title">Пополнить счет</div>
                    <div id="blog_posts_container">
                        <div class="row">
                        	<div class="col-12">
								<p class="desctop text-white">
									Как и все мы нуждаемся в материальной помощи. Нам необходимо арендовать оборудование для игровых серверов, совершенствовать старое и разрабатывать совершенно новое и необычное! Именно по этим причинам мы и ввели систему пожертвований на нашем проекте.
									<br><br>
									Бонус к каждому пополнению +10% от суммы пополнения.

								</p>
                        	</div>
                            <div class="form-group col-12">
								<form action="https://unitpay.ru/pay/73561-a5805">
									<div class="input-group">
									<input type="hidden" name="account" value="<?=$_SESSION['login']?>">
									<input type="text" name="sum" class="form-control bg-dark user-form" value="100">
									<input type="hidden" name="desc"  value="Пополнение личного счета <?=$_SESSION['login']?>">
									<div class="input-group-append">
										<span class="input-group-text bg-dark" style="border: unset;">RUB</span>
									</div>
										<div class="input-group-append">
											<button class="love-donate btn btn-dark" type="submit"><span class="ic-loveb"></span> Пополнить</button>
										</div>
									</div>
								</form>
                            </div>
                        </div>
                    </div>
                </div>
