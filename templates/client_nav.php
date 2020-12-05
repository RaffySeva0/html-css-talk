<!-- CLIENT NAVBAR START -->
<nav class="client-nav navbar navbar-expand-lg navbar-light bg-light py-4 px-5">
  <a class="navbar-brand" href="/Home">
    <img src="/assets/images/gms-logo.png" style="width: 100px; height: 100px;"/>
  </a>
  <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler" data-target="#navbarSupportedContent" data-toggle="collapse" type="button">
    <span class="navbar-toggler-icon">
    </span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">

    <ul class="nav font-weight-bold mx-auto">
      <li class="nav-item active">
        <a class="nav-link" href="/Home">
          HOME
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/PastEvents">
          PAST EVENTS
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/ContactUs">
          CONTACT US
        </a>
      </li>
      <li class="nav-item">
        <button class="btn btn-outline-info" data-target="#loginModal" data-toggle="modal" type="button" id="loginEventNav">
          LOGIN TO LIVE EVENT
        </button>
      </li>
    </ul>

    <ul class="nav font-weight-bold">
      <li class="nav-item">
        <a class="nav-link fb-logo" href="https://www.facebook.com/greatmindsseminarsllc">
          <i class="fa fa-facebook">
          </i>
        </a>
      </li>
    </ul>
  </div>
</nav>
<!-- CLIENT NAVBAR END -->
<!-- LOGIN MODAL -->
<?=view('client/modals/login_modal');?>
