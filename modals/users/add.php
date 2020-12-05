<div class="modal fade" id="addUser" tabindex="-1" aria-labelledby="addUser" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h4 class="modal-title" id="exampleModalLabel">Create New User</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="username">Username</label>
                  <input type="text" class="form-control" id="username" placeholder="" value="" required/>
                </div>
              </div>
              <div class="row" id="passwordDiv">
                <div class="col-md-12 mb-3">
                  <label for="password">Password</label>
                  <input type="password" class="form-control" id="password" placeholder="" value="" required/>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="password">Role</label>
                  <select class="form-control" id="role">
                    <option>Administrator</option>
                    <option>Clerk</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" id="btnAddUser">Save Changes</button>
      </div>
    </div>
  </div>
</div>