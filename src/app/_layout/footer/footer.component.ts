import { Component, OnInit, Renderer2 } from '@angular/core';
import { ThemeSettingsService } from '../settings/theme-settings.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, NavigationEnd, NavigationStart, Event } from '@angular/router';
import { FullLayoutComponent } from '../full-layout/full-layout.component';
import { AppConstants } from 'src/app/_helpers/app.constants';
import { TranslateService } from '@ngx-translate/core';

//lang variables
let langCode;
let langId;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public showFooter: boolean;
  public fixedFooter: boolean;
  public darkFooter: boolean;
  public hideMadeWithLove: boolean;
  private _unsubscribeAll: Subject<any>;
  private _themeSettingsConfig: any;
  year;
  
  constructor(private renderer: Renderer2,
    private _renderer: Renderer2,
    private router: Router,
    private _themeSettingsService: ThemeSettingsService ,
    private translate: TranslateService 
    ) {

      this.year = new Date().getFullYear();
      this.translateMethod()

    this._unsubscribeAll = new Subject();
    this.router.events.subscribe((event: Event) => {
      const footerElement = document.getElementsByClassName('footer');
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        if (this.router.url === '/email' && footerElement.item(0)) {
          this._renderer.removeClass(footerElement.item(0), 'footer-static');
          this.renderer.addClass(footerElement.item(0), 'fixed-bottom');
        } else if (footerElement.item(0)) {
          this._renderer.removeClass(footerElement.item(0), 'fixed-bottom');
          this.renderer.addClass(footerElement.item(0), 'footer-static');
        }
      }
    });
  }
  arabic : boolean;

  translateMethod(){
    this.translate.setDefaultLang('en');
    this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    let y = localStorage.getItem("selected");
    console.log(y)
    if(y==null){
      localStorage.setItem("selected", JSON.stringify("en")); 
      this.translate.use('en');
      this.arabic = false;
    }else{
      langCode = lang.split('"').join('');
      this.translate.use(langCode);
      if (langCode == 'ar'){
        this.arabic = true;
  
      }else{
        this.arabic = false;
      }
    }
  
  
  }
  ngOnInit() {
    const isMobile = window.innerWidth < AppConstants.MOBILE_RESPONSIVE_WIDTH;
    if ((this.router.url.indexOf('WithNavbar') >= 0) || (this.router.url.indexOf('Advanced') >= 0) ||
      (this.router.url.indexOf('searchPage') >= 0)) {
      this.showFooter = false;
      this.darkFooter = true;
      this.fixedFooter = false;
    } else if (this.router.url.indexOf('email') >= 0) {
      this.showFooter = false;
      this.darkFooter = false;
      this.fixedFooter = true;
    } else if (FullLayoutComponent) {
      this.showFooter = true;
      this.darkFooter = false;
      this.fixedFooter = false;
    } else {
      this.showFooter = true;
      this.darkFooter = false;
      this.fixedFooter = false;
    }
    if (isMobile) {
      this.hideMadeWithLove = true;
    }
    // Subscribe to config changes
    this._themeSettingsService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this._themeSettingsConfig = config;
      });
  }
}
