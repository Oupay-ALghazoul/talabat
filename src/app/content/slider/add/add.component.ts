import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { Slide } from 'src/app/models/Slide';

let langId;
let photo;
let langCode;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public breadcrumb: any;
  public breadcrumbAr: any;
  submitted = false;

  addForm: FormGroup;
  loader = false;

  categories : any[] = []

  isEditMode: boolean = false;
  slideId: number;
  slideData: Slide;

  constructor(private formBuilder: FormBuilder, private service: Constant,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService, private toastr: ToastrService,
    private location: Location) {

    this.translateMethod();
    this.getCategories();

    this.slideId = this.route.snapshot.params["id"];
    this.isEditMode = !!this.slideId;

    if(this.isEditMode) {
      this.getSlide();
    }

    this.initForm();

  }

  initForm() {
    this.addForm = this.formBuilder.group({
      description: [this.slideData?.description ?? '', Validators.required],
      category_id: [this.slideData?.category_id ?? '', Validators.required],
      sort: [this.slideData?.sort ?? '', Validators.required],
    });
  }

  get f() {
    return this.addForm.controls;
  }


  getCategories() {
    this.service.getCategories("1", "", "", "").then((data : any) =>{
       this.categories = data; } 
    )
  }

  hide: boolean = true;

  myFunction() {
    this.hide = !this.hide;
  }

  getSlide() {
    this.service.showSlide(this.slideId).subscribe(
      (res) => {
        this.slideData = res;
        this.initForm();
        (<HTMLInputElement>document.getElementById("imageReview")).style.display = "block";
        (<HTMLInputElement>document.getElementById("imageReview")).src = res.image;
      }, (err) => {
      }
    );
  }

  submit() {
    this.loader = true;
    let slideType =  this.route.snapshot.params["type"];

    let fd = new FormData();
    fd.append("description", this.f.description.value);
    fd.append("category_id", this.f.category_id.value);
    fd.append("sort", this.f.sort.value);
    fd.append("type", slideType);
    fd.append("image", this.fileData ?? this.slideData?.image);

    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
    if (photo == null && !this.isEditMode) {
      this.toastr.warning(this.translate.instant('msg.uploadPhoto'))
      this.loader = false;
      return;
    }

    if(!this.isEditMode) {
    this.service.addSlide(fd).subscribe(
      res => {
        this.loader = false;
        this.toastr.success(this.translate.instant('Slide Added Successfully'));
        setTimeout(() => {
          this.router.navigate(['/slider/list/' + slideType]);
        },
          1000);
      }, err => {
        this.loader = false;
        this.toastr.error(err)
      })
    }

    if(this.isEditMode) {
      this.service.updateSlide(this.slideId, fd, {_method: "PUT"}).subscribe(
        res => {
          this.loader = false;
          this.toastr.success(this.translate.instant('Slide Edited Successfully'));
          setTimeout(() => {
            this.router.navigate(['/slider/list/' + slideType]);
          },
            1000);
        }, err => {
          this.loader = false;
          this.toastr.error(err)
        })
      }

  }

  previewUrl: any = null;
  fileData: File = null;
  reader = new FileReader();

  upload(files: File[]) {
    this.fileData = files[0];
    this.reader.readAsDataURL(this.fileData);
    this.reader.onload = function () {
      photo = this.result;
    };
    this.preview()
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;

      (<HTMLInputElement>document.getElementById("imageReview")).style.display = "block";
      (<HTMLInputElement>document.getElementById("imageReview")).src = this.previewUrl;
    }
  }
 

  ngOnInit() {
    photo = null;
    this.breadcrumb = {
      'mainlabel': this.isEditMode ? 'Edit Slide' : 'Add Slide',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/slide/list/' + this.route.snapshot.params["type"]
        },

      ]
    };
    this.breadcrumbAr = {
      'mainlabel': this.isEditMode ? 'تعديل سلايد' : 'اضافة سلايد',
      'links': [
        {
          'name': 'القائمة السابقة',
          'isLink': true,
          'link': '/slide/list/' + this.route.snapshot.params["type"]
        },

      ]
    };
  }
  arabic: boolean;

  translateMethod() {
    let lang = localStorage.getItem("selected");
    langCode = lang.split('"').join('');
    this.translate.use(langCode);
    let lang_id = localStorage.getItem("langId");
    langId = lang_id.split('"').join('');
    if (Number(langId) == 1) {
      this.arabic = true;

    } else {
      this.arabic = false;
    }
  }

  cancel() {
    this.location.back();
  }

}
