<app-admin-header></app-admin-header>
<app-sidebar />

<div class="app-content content">
  <div class="content-wrapper">
    <div class="content-wrapper-before"></div>
    <div class="row">jnnvv</div>
    <br />
    <div class="content-header row">
      <div class="content-header-left col-md-4 col-12 mb-2">
        <h3 class="content-header-title">classes</h3>
      </div>
      <div class="content-header-right col-md-8 col-12">
        <div class="breadcrumbs-top float-md-right">
          <div class="breadcrumb-wrapper mr-1">
            <a href="ajout-classe" class="btn btn-primary">
              + ajouter une classe</a
            ><br />
          </div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="row match-height">
        <div class="col-xl-3 col-md-6 courses" *ngFor="let classe of response.classes">
          <div class="card" style="">
            <div class="card-header" id="heading-links">
              <h4 class="card-title">{{ classe.label }}</h4>
              <div class="heading-elements">
                <div class="dropdown dropdown-actions">
                  <a
                    class="dropdown-toggle btn btn-secondary btn-sm"
                    href="#"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="ft-more-vertical"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a
                    (click)="updateClasse(classe.id)"
                       class="dropdown-item action-edit btn-min-width float-md-right"
                      ><i class="ft-edit-2"></i> Modifier</a
                    >
                    <a
                    (click)="deleteClasse(classe.id)"
                      class="dropdown-item action-edit btn-min-width float-md-right text-danger"
                      data-toggle="modal"
                      data-target="#modal_delete-8"
                    >
                      <i class="ft-trash-2"></i> Supprimer
                    </a>
                    <a
                      href="#"
                      class="dropdown-item action-edit btn-min-width float-md-right text-success"
                      data-toggle="modal"
                      data-target="#modal_invitation"
                      data-class_id="8"
                    >
                      <i class="ft-user-plus"></i>Inviter des étudiants
                    </a>
                    <a
                      href="/fr/espace-prive/exporter-etudiants/8"
                      class="dropdown-item action-edit btn-min-width float-md-right text-info"
                    >
                      <i class="ft-download-cloud"></i>Exporter la liste
                      d'étudiants
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="card-text">
                <span>Etablissement : </span> <b>{{ classe.school }}</b
                ><br />
                <span>Ville : </span> <b>{{ classe.city }}</b
                ><br />
                <span>Etudiants : </span> <b>0</b><br />
              </div>
            </div>
            <div
              class="card-footer border-top-blue-grey border-top-lighten-5 text-muted"
            >
              <span class="float-left"> 30/01/2024 11:12 </span>
              <span class="float-right">
                <a href="acceder-classe" class="card-link"
                  >Accéder
                  <i class="la la-angle-right"></i>
                </a>
              </span>
            </div>
          </div>

        </div>


      </div>
      <div id="pagination-container" class="light-theme simple-pagination">
        <ul>
          <li class="disabled"><span class="current prev">«</span></li>
          <li class="active"><span class="current">1</span></li>
          <li class="disabled"><span class="current next">»</span></li>
        </ul>
      </div>

      <!--Invitation Modal-->
      <div class="modal fade text-left" id="modal_invitation">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="myModalLabel34">
                <i class="ft-user-plus">Ajouter des étudiants</i>
              </h3>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form
              method="post"
              action="/fr/espace-prive/inviter-des-etudiants"
              enctype="multipart/form-data"
            >
              <div class="modal-body">
                <div>
                  <label>
                    <input type="checkbox" id="load_csv" /> Add students with
                    .csv file</label
                  >
                </div>
                <div
                  class="form-group"
                  id="load_bulk_students"
                  style="display: none"
                >
                  <input type="file" name="csv_file" class="form-control" />
                </div>
                <div id="add_inputs" style="display: block">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Full Name"
                          id="student_name"
                        />
                      </div>
                    </div>
                    <div class="col-md-5">
                      <div class="form-group">
                        <input
                          type="email"
                          class="form-control"
                          placeholder="email"
                          id="student_email"
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div>
                        <button
                          type="button"
                          class="btn btn-primary"
                          id="add_student"
                        >
                          <i class="ft-plus-circle"></i> Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="hidden"
                  name="invitation_class_id"
                  id="invitation_class_id"
                  value=""
                />
                <div
                  class="table-responsive"
                  style="display: none"
                  id="table_students"
                >
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th style="width: 60%; text-align: left">Etudiants</th>
                        <th style="width: 30%; text-align: center"></th>
                        <th style="width: 10%; text-align: right"></th>
                      </tr>
                    </thead>
                    <tbody id="data_invitation"></tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <input
                  type="reset"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  value="Annuler"
                />
                <input
                  type="submit"
                  class="btn btn-warning"
                  value="Confirmer"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<app-admin-footer></app-admin-footer>
