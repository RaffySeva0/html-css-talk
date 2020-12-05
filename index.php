<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Demo</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" type="text/css"  href="assets/css/bootstrap.min.css" />
    <!-- Top and Side Nav CSS -->
    <link rel="stylesheet" type="text/css" href="assets/css/dashboard.css" />
    <!-- Bootstraptable -->
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/bootstrap-table@1.17.1/dist/bootstrap-table.min.css" />
</head>
<body>
  <!-- Nav -->
  <?php include 'templates/cms_nav.php';?>
  <!-- Modals -->
  <?php include 'modals/users/add.php';?>
  <?php include 'modals/users/edit.php';?>
  <?php include 'modals/users/delete.php';?>
  <?php include 'modals/users/reset_pass.php';?>

  <!-- MAIN AREA START -->
  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 mt-3 px-4">
    <div id="testDiv" class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
      <h1>Users Management</h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button class="btn btn-success float-right" data-target="#addUser" data-toggle="modal">
          <i class="fas fa-plus"></i>
          Add New User
        </button>
      </div>
    </div>

    <div class="mt-3">
      <table
        class="table table-condensed table-hover"
        id="tblUsers"
        data-id-field="user_id"
        data-minimum-count-columns="2"
        data-page-list="[5, 10, 25, 50, 100, ALL]"
        data-pagination="true"
        data-search="true"
        data-show-footer="false"
        data-toolbar="#toolbar">
        <thead>
          <tr>
            <th data-field="username">Username</th>
            <th data-field="role">User Role</th>
            <th data-events="operateEvents" data-field="action" data-formatter="actionFormatter">
              Actions
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </main>
  <!-- MAIN AREA END -->

  <!-- JQuery JS -->
  <script type="text/javascript" src="assets/js/jquery-3.5.1.min.js"></script>
  <!-- Bootstrap JS -->
  <script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
  <!-- Fontawesome -->
  <script src="https://kit.fontawesome.com/ae5d508555.js" crossorigin="anonymous"></script>
  <!-- Bootstraptable -->
  <script type="text/javascript" src="https://unpkg.com/bootstrap-table@1.17.1/dist/bootstrap-table.min.js"></script>
  <!-- Users JS -->
  <script type="text/javascript" src="assets/js/users.js"></script>
</body>
</html>