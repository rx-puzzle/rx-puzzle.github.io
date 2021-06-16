import { NgModule, Provider } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HomepageModule } from './homepage/homepage.module';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarModule } from './navbar/navbar.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { SandboxComponent } from './sandbox/sandbox.component';
import { AppComponent } from './app.component';

// prettier-ignore
const routes: Routes = [
  { path: 'stages/:sandbox-data'  , ...propsSandboxRoute('play'   , true ) },
  { path: 'stages'                , loadChildren: () => import(
                                    './stage-list/stage-list.module'
                                  ).then(m => m.StageListModule)           },
  { path: 'sandbox/:sandbox-data' , ...propsSandboxRoute('edit'   , false) },
  { path: 'sandbox'               , ...propsSandboxRoute('edit'   , false) },
  { path: 'pictures/:sandbox-data', ...propsSandboxRoute('picture', true ) },
  { path: 'guide'                 , loadChildren: () => import(
                                      './guide/guide.module'
                                    ).then(m => m.GuideModule)             },
  { path: ''                      , component: HomepageComponent           },
  { path: '**'                    , redirectTo: ''                         },
];

// prettier-ignore
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HomepageModule,
    NavbarModule,
    SandboxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    provideParamResolver('sandbox-data'),
    provideQueryParamResolver('hint'),
    provideQueryParamResolver('theme'),
    provideQueryParamResolver('title')
  ]
})
export class AppModule {}

function propsSandboxRoute(
  mode: 'edit' | 'play' | 'picture',
  navbarDisabled: boolean
) {
  return {
    component: SandboxComponent,
    resolve: {
      src: 'sandbox-data-resolver',
      hint: 'hint-resolver',
      theme: 'theme-resolver',
      title: 'title-resolver',
    },
    data: { mode, navbarDisabled },
  };
}

function provideParamResolver(name: string): Provider {
  return {
    provide: name + '-resolver',
    useValue: (route: ActivatedRouteSnapshot) => {
      return route.params[name] as string;
    },
  } as Provider;
}

function provideQueryParamResolver(name: string): Provider {
  return {
    provide: name + '-resolver',
    useValue: (route: ActivatedRouteSnapshot) => {
      return route.queryParams[name] as string;
    },
  } as Provider;
}
