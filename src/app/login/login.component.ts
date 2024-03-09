import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Constant } from '../constant'
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/User'
import { SystemParam } from '../models/SystemParam'
import { MessagingService } from '../shared/messaging.service';

let noQuotes;

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted: boolean = false;
  returnUrl: string;
  isPageLoaded = false;
  permissionList: String[] = [];
  systemParam : SystemParam ;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messagingService: MessagingService ,
    private renderer: Renderer2,
    private translate: TranslateService,
    public service: Constant,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
    this.translateMethod();
    // localStorage.removeItem("adminTalabat")
  }
  lang: boolean = false;

  translateMethod() {
    this.translate.setDefaultLang('en');
    this.translate.addLangs(['en', 'ar']);

    // localStorage.removeItem("selected");
    // localStorage.removeItem("langId");

    let y = localStorage.getItem("selected");
    console.log(y)

    if (y == null) {
      localStorage.setItem("selected", JSON.stringify("en"));
      this.lang = false;
      this.translate.use('en');
    } else {
      noQuotes = y.split('"').join('');
      this.translate.use(noQuotes);
      if (noQuotes == 'ar') {
        this.lang = true;
      } else {
        this.lang = false;
      }
      document.documentElement.setAttribute('lang', 'ar')
    }
    let lang_id = localStorage.getItem("langId");
    console.log(lang_id)
    if (lang_id == null) {
      localStorage.setItem("langId", JSON.stringify("2"));
    }
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: false
    });
    this.service.getSystemParam().then( res=>{
      console.log(res)
       this.systemParam = res as any; } )
    // this.isPageLoaded = true;
    // Remember Me
    console.log(localStorage.getItem('remember'))
    // localStorage.removeItem("currentUser")
    if (localStorage.getItem('remember')) {
      this.renderer.removeClass(document.body, 'bg-full-screen-image');
      localStorage.removeItem('currentLayoutStyle');
      this.router.navigate(['/setting/home']);
    }
    else if (localStorage.getItem('adminTalabat')) {
      // Force logout on login if not remember me
      this.isPageLoaded = true;
      // this.service.logout();

    } else {
      this.isPageLoaded = true;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  loader: boolean = false
  tryLogin() {
    this.submitted = true;
    this.loader = true
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.loader = false;
      return;
    }
    const value = {
      email: "",
      phone: this.f.phone.value,
      password: this.f.password.value
    };
    console.log(value)
    this.service.loginMethod(value).then(
      (res: User) => {
        this.submitted = false;
       
        console.log(res)
        console.log(this.loginForm.controls['rememberMe'].value)
        if (this.loginForm.controls['rememberMe'].value == true) {
          localStorage.setItem('remember', 'true');
        } else {
          localStorage.removeItem('remember');
        }
        this.setUserInStorage(res);
        localStorage.removeItem('currentLayoutStyle');
        if (res.super_admin == false) {
          res.roles.forEach((element) => {
            element.permissions.forEach((per) => {
              this.permissionList.push(per.type);
            });
          });
          console.log(this.permissionList)
          localStorage.setItem('permission-talabate', JSON.stringify(this.permissionList));
          let returnUrl = '/setting/home';
          if (this.returnUrl) {
            returnUrl = this.returnUrl;
          }
          this.router.navigate([returnUrl])
            .then(() => {
              window.location.reload();
            });
        } else {
          let returnUrl = '/dashboard/charts';
          if (this.returnUrl) {
            returnUrl = this.returnUrl;
          }
          this.loader = false;
          setTimeout(() => 
          {
            this.router.navigate([returnUrl])
            .then(() => {
              window.location.reload();
            });
          },
          1000);
         
        }
        
      },
      err => {
        this.submitted = false;
        this.loader = false
        this.toastr.error(err);
        console.log(this.submitted)
      }
    );
  }
  hide: boolean = true;

  myFunction() {
    this.hide = !this.hide;
  }
  test() {
    let returnUrl = '/users/list';
    if (this.returnUrl) {
      returnUrl = this.returnUrl;
    }
    this.router.navigate([returnUrl]);
  }
  addCheckbox(event) {
    const toggle = document.getElementById('icheckbox');
    if (event.currentTarget.className === 'icheckbox_square-blue') {
      this.loginForm.patchValue({ rememberMe: true })
      this.renderer.addClass(toggle, 'checked');
    } else if (event.currentTarget.className === 'icheckbox_square-blue checked') {
      this.loginForm.patchValue({ rememberMe: false })
      this.renderer.removeClass(toggle, 'checked');
    }
  }
  setUserInStorage(res) {

    this.service.saveUser(res);
  }
  changeLang() {
    if (noQuotes == 'ar') {
      localStorage.setItem("selected", JSON.stringify('en'));
      localStorage.setItem("langId", JSON.stringify("2"));
    } else {
      localStorage.setItem("selected", JSON.stringify('ar'));
      localStorage.setItem("langId", JSON.stringify("1"));
    }

    window.location.reload();

  }
}
