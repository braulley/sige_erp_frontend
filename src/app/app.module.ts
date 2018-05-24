import { Data } from './data/data';
import { RefreshTokenInterceptor } from './interceptor/refresh-token.interceptor';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { LoginModule } from './login/login.module';
import { TokenInterceptor } from './interceptor/token.interceptor';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LoginModule,
        HttpModule,
        NgbModule.forRoot(),
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule
    ],
    declarations: [AppComponent],
    providers: [
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true }
    ],
    exports:[],
    bootstrap: [AppComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
