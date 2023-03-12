import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GenerationPageComponent } from './components/pages/main-page/generation-page.component';
import { FileUploadDirective } from './components/directive/file-upload.directive';

@NgModule({
  declarations: [
    AppComponent,
    GenerationPageComponent,
    FileUploadDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
