import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { About } from 'src/app/models/About';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserServiceService } from 'src/app/_services/user-service.service';

let photo;
let langCode;
let langId;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class WebsiteInfoComponent implements OnInit, OnDestroy {
  // @BlockUI('postForm') blockUIProjectInfo: NgBlockUI;
  breadcrumb: any;
  breadcrumbAr: any;
  Info: FormGroup;

  loader: boolean = true;
  info: About;
  loaderBtn = true;
  submitted = false;
  loading: boolean = false;

  photo

  arabic: boolean = false;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit: boolean;

  constructor(private formBuilder: FormBuilder, private user: UserServiceService,
    private translate: TranslateService, private service: Constant, private location: Location,
    private toastr: ToastrService, private router: Router) {
    this.getAbout();
    this.translateMethod();
    //  permission update
    if (this.permissionList != null) {
      this.permissionList.some((x) => x === "update_about")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showEdit = true;
    }
  }


  getAbout() {
    this.service.getAbout().then((data: About) => {
      this.loader = false;
      console.log(data)
      this.info = data
      this.photo = this.info.image;
      var urlRegEx = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

      this.Info = this.formBuilder.group({
        text_ar: [this.info.text_ar, [Validators.required, Validators.maxLength(200), Validators.pattern('[\u0600-\u06FF ]*')]],
        text_en: [this.info.text_en, [Validators.required, Validators.maxLength(200), Validators.pattern('[a-zA-Z ]*')]],
        address: [this.info.address, Validators.required],
        photo: [this.info.image],
        google: [this.info.google, [Validators.required]],
        apple: [this.info.apple, [Validators.required]],
        facebook: [this.info.facebook, [Validators.required]],
        twitter: [this.info.twitter, [Validators.required]],
        instagram: [this.info.instagram, [Validators.required]],
        phone: [this.info.phone, Validators.required],
        email: [this.info.email, [Validators.email, Validators.required]],
        website_link: [this.info.website_link, [Validators.required]],
        privacy_policy_ar: [this.info.privacy_policy_ar],
        privacy_policy_en: [this.info.privacy_policy_en],
        terms_and_conditions_ar: [this.info.terms_and_conditions_ar],
        terms_and_conditions_en: [this.info.terms_and_conditions_en]
      });
      console.log(this.info.website_link)
    })

  }
  ngOnDestroy() {
    photo = null;
  }
  ngOnInit() {
    photo = null;
    // this.translate.stream(this.breadcrumb.mainlabel).subscribe(value=> this.breadcrumb.mainlabel = 'msg.editAbout')
    this.breadcrumb = {
      'mainlabel': 'Setting',
    };

    this.breadcrumbAr = {
      'mainlabel': 'الاعدادات',
    };

  }
  get f() {
    return this.Info.controls;
  }

  cancel() {
    this.location.back();
  }


  onSubmit() {
    this.loaderBtn = false;

    var text_ar = this.f.text_ar.value;
    var text_en = this.f.text_en.value;
    var phone = this.f.phone.value;
    var address = this.f.address.value;
    var email = this.f.email.value;
    var facebook = this.f.facebook.value;
    var instagram = this.f.instagram.value;
    var twitter = this.f.twitter.value;
    var website_link = this.f.website_link.value;
    var apple = this.f.apple.value;
    var google = this.f.google.value;

    var privacy_policy_ar = this.f.privacy_policy_ar.value;
    var privacy_policy_en = this.f.privacy_policy_en.value;
    var terms_and_conditions_ar = this.f.terms_and_conditions_ar.value;
    var terms_and_conditions_en = this.f.terms_and_conditions_en.value;

    const newItem = {
      "text_ar": "",
      "text_en": "",
      "phone": "",
      "address": "",
      "email": "",
      "image": "",
      "facebook": "",
      "instagram": "",
      "twitter": "",
      "apple": "",
      "google": "",
      "website_link": "",
      "privacy_policy_ar": "",
      "privacy_policy_en": "",
      "terms_and_conditions_ar": "",
      "terms_and_conditions_en": ""
    }
    newItem.text_ar = text_ar
    newItem.text_en = text_en
    newItem.phone = phone
    newItem.address = address
    newItem.email = email
    // newItem.image = photo
    newItem.facebook = facebook
    newItem.instagram = instagram
    newItem.twitter = twitter
    newItem.apple = apple
    newItem.google = google
    newItem.website_link = website_link
    newItem.privacy_policy_ar = privacy_policy_ar;
    newItem.privacy_policy_en = privacy_policy_en;
    newItem.terms_and_conditions_ar = terms_and_conditions_ar;
    newItem.terms_and_conditions_en = terms_and_conditions_en;
    if (privacy_policy_ar == null || privacy_policy_en == null || terms_and_conditions_ar == null 
      || terms_and_conditions_en == null) {
        this.toastr.warning(this.translate.instant('msg.extraPages'))
        this.loaderBtn = true;
        return;
      }
      if (photo != null)
        newItem.image = photo
      // else
      //   newItem.image = this.photo

      this.submitted = true;
      if (this.Info.invalid) {
        this.loaderBtn = true;
        return;
      }

      console.log(newItem)
      this.service.updateAbout(newItem).then(
        res => {
          console.log(res);
          photo = null;
          this.loaderBtn = true;
          this.toastr.success(this.translate.instant('msg.editAbout'))
          this.getAbout()
        }, err => {
          this.toastr.error(err);
          this.loaderBtn = true;
        })
    }
    previewUrl: any = null;
    fileData: File = null;
    reader = new FileReader();

    upload(files: File[]){
      // Array.from(files).forEach(f => {
      //   formData.append('image',f)}) ;  
      //   this.preview()
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

        // (<HTMLInputElement>document.getElementById("imageReview")).style.display = "block";
        (<HTMLInputElement>document.getElementById("imageReview")).src = this.previewUrl;
      }
    }

    translateMethod(){
      // this.translate.setDefaultLang('en');
      // this.translate.addLangs(['en', 'ar']);     
      let lang = localStorage.getItem("selected");
      langCode = lang.split('"').join('');
      this.translate.use(langCode);
      console.log(langCode)
      let lang_id = localStorage.getItem("langId");
      langId = lang_id.split('"').join('');
      if (Number(langId) == 1) {
        this.arabic = true;

      } else {
        this.arabic = false;
      }
      //  this.getTitle()


    }
    getTitle(){
      this.breadcrumb = {
        'mainlabel':
          // this.translate
          // .stream('msg.editAbout')
          // .subscribe(v => console.log(this.breadcrumb.mainlabel = v))
          this.translate.stream('msg.editAbout').subscribe(value => this.breadcrumb.mainlabel = value)
      };
    }
  }
