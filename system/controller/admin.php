<?php
class controller_admin {
  function __construct(){
    if(!model_main::is_admin()) die("<script>document.location.href = '".CP."/admin/movies/';</script>");
  }

}