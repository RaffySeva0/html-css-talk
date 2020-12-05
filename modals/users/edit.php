<div class="modal fade" id="editUser" tabindex="-1" aria-labelledby="editUser" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header bg-warning text-white">
        <h4 class="modal-title" id="exampleModalLabel">Edit User Information</h4>
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
                  <label for="editUsername">Username</label>
                  <input type="text" class="form-control" id="editUsername" placeholder="" value="" required/>
                </div>
              </div>
              <div class="row" id="editPasswordDiv">
                <div class="col-md-12 mb-3">
                  <label for="editPassword">Password</label>
                  <input type="password" class="form-control" id="editPassword" placeholder="" value="" required/>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="editRole">Role</label>
                  <select class="form-control" id="editRole">
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
        <button type="button" class="btn btn-success" id="btnUpdateUser">Save Changes</button>
      </div>
    </div>
  </div>
</div>