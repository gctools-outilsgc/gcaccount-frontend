import { TestBed } from '@angular/core/testing';

import { TitleService } from './title.service';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { TranslateService } from '@ngx-translate/core';

describe('TitleService', () => {
  let service: TitleService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [ HttpClient ]
          }
        }),
        HttpClientModule
      ],
      providers: [ TranslateService, HttpClient ]
    });
    translateService = TestBed.inject(TranslateService);
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
