import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBlogPage } from './searchblog.page';

describe('SearchBlogPage', () => {
  let component: SearchBlogPage;
  let fixture: ComponentFixture<SearchBlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBlogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
