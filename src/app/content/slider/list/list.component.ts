import { Slide } from "../../../models/Slide";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { TableApiService } from "src/app/_services/table-api.service";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Constant } from "src/app/constant";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserServiceService } from "src/app/_services/user-service.service";
import { Observable } from "rxjs";

//lang variables
let langCode;
let langId;

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  public breadcrumb: any;
  public breadcrumbAr: any;

  arabic: boolean;
  loader: boolean = true;
  // for pagenation
  total: number = 0;
  collectionSize: number = 0;
  page = 1;
  result: Slide[] = [];

  addModal = null;
  search: FormGroup;

  sliderType = "";

  public basicCollapse1 = false;
  public basicCollapse2 = false;

  loaderBtn: boolean = false;
  state = "";
  role = "";
  word = "";
  phone = "";
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showDelete: boolean;
  showAdd: boolean;
  showEdit: boolean;
  showOrder: boolean;

  constructor(
    private router: Router,
    private tableApiservice: TableApiService,
    private sanitizer: DomSanitizer,
    private modal: NgbModal,
    private user: UserServiceService,
    private formBuilder: FormBuilder,
    public service: Constant,
    private toastr: ToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.translateMethod();

    this.search = this.formBuilder.group({
      word_filter: [""],
      phone_filter: [""],
      activated: [""],
      role_filter: [""],
    });

    route.params.subscribe((params) => {
      this.sliderType = params["type"];
      this.getSlider();
      this.setBreadcrumb();
    });

    // permission add
    //   if( this.permissionList != null){
    //     this.permissionList.some((x) => x === "create_user")
    //       ? (this.showAdd = true)
    //       : (this.showAdd = false);
    //   }
    //  //  permission update
    //  if( this.permissionList != null){
    //   this.permissionList.some((x) => x === "update_user")
    //     ? (this.showEdit = true)
    //     : (this.showEdit = false);
    //   }
    //   //  permission update
    //   if( this.permissionList != null){
    //     this.permissionList.some((x) => x === "delete_user")
    //       ? (this.showDelete = true)
    //       : (this.showDelete = false);
    //   }
    //   // showOrder
    //   if( this.permissionList != null){
    //     this.permissionList.some((x) => x === "view_order")
    //       ? (this.showOrder = true)
    //       : (this.showOrder = false);
    //   }
    //   if (
    //     this.user.getUser() &&
    //     this.user.getUser().super_admin === true
    //   ) {
    //     this.showDelete = true;
    //     this.showAdd = true ;
    //     this.showEdit = true ;
    //     this.showOrder = true ;
    //   }
    this.showDelete = true;
    this.showAdd = true;
    this.showEdit = true;
    this.showOrder = true;
    // this.getUsers();
  }
  get f() {
    return this.search.controls;
  }

  searchBtn() {
    this.loaderBtn = true;

    this.word = this.f.word_filter.value;
    this.phone = this.f.phone_filter.value;
    this.state = this.f.activated.value;
    this.role = this.f.role_filter.value;

    this.page = 1;
    this.loader = true;
    this.isItems = false;
    this.getSlider();
  }

  getSlider() {
    this.loader = true;
    let observable: Observable<Slide[]> = null;
    if (this.sliderType == "main") {
      observable = this.service.getMainSlider();
    }
    if (this.sliderType == "secondary") {
      observable = this.service.getSecSlider();
    }

    observable.subscribe((res: Slide[]) => {
      this.result = res;
      this.loader = false;
    }, (err) => {
      this.loader = false;
    });
  }

  onPageChange(page) {
    this.loader = true;
    this.page = page;
    this.getSlider();
  }

  loaderExport: boolean = false;
  exportToExcel() {
    this.loaderExport = true;
    this.service
      .exportUsers(this.state, this.role, this.word)
      .then((data: any) => {
        this.loaderExport = false;
        this.downloadFile(data.file);
      });
  }
  //exportCities
  downloadFile(data: string) {
    window.open(data);
  }
  reset() {
    this.search = this.formBuilder.group({
      word_filter: [""],
      phone_filter: [""],
      activated: [""],
      role_filter: [""],
    });
  }
  translateMethod() {
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);
    let lang = localStorage.getItem("selected");
    langCode = lang.split('"').join("");
    this.translate.use(langCode);
    console.log(langCode);
    let lang_id = localStorage.getItem("langId");
    langId = lang_id.split('"').join("");
    if (Number(langId) == 1) {
      this.arabic = true;
    } else {
      this.arabic = false;
    }
  }
  edit(id) {
    this.router.navigate(["/slider/edit/" + this.sliderType + "/" + id]);
  }
  photoURL(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  ngOnInit() {
    this.loader = true;

    this.setBreadcrumb();
  }

  setBreadcrumb() {
    this.breadcrumb = {
      mainlabel: this.translate.instant(this.sliderType) + " Slider",
    };
    this.breadcrumbAr = {
      mainlabel: "السلايد " + this.translate.instant(this.sliderType),
    };
  }

  isItems = false;
  id_deleted_Item;

  ConfirmDataModal(confirmDataModalContent, id) {
    this.id_deleted_Item = id;
    this.addModal = this.modal.open(confirmDataModalContent, {
      windowClass: "animated fadeInDown",
    });
  }
  deleteLoader: boolean = false;

  delete(confirmForm) {
    this.deleteLoader = true;
    this.service.deleteSlide(this.id_deleted_Item).subscribe(
      (res) => {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.getSlider();
      },
      (err) => {
        this.toastr.error(err);
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
      }
    );
  }
  close(confirmForm) {
    this.addModal.close(confirmForm.resetForm);
  }
}
