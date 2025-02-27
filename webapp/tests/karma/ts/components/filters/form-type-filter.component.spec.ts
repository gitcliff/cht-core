import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { expect } from 'chai';
import sinon from 'sinon';

import { FormTypeFilterComponent } from '@mm-components/filters/form-type-filter/form-type-filter.component';
import {
  MultiDropdownFilterComponent
} from '@mm-components/filters/multi-dropdown-filter/multi-dropdown-filter.component';
import { GlobalActions } from '@mm-actions/global';
import { Selectors } from '@mm-selectors/index';

describe('Form Type Filter Component', () => {
  let component:FormTypeFilterComponent;
  let fixture:ComponentFixture<FormTypeFilterComponent>;
  let store;

  beforeEach(waitForAsync(() => {
    const mockedSelectors = [
      { selector: Selectors.getForms, value: [] },
    ];

    return TestBed
      .configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          BsDropdownModule.forRoot(),
          TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
          RouterTestingModule,
          FormsModule,
        ],
        declarations: [
          FormTypeFilterComponent,
          MultiDropdownFilterComponent,
        ],
        providers: [
          provideMockStore({ selectors: mockedSelectors }),
        ]
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormTypeFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.inject(MockStore);
      });
  }));

  afterEach(() => {
    sinon.restore();
  });

  it('should create Form Type Filter', () => {
    expect(component).to.exist;
  });

  it('ngOnDestroy() should unsubscribe from observables', () => {
    const spySubscriptionsUnsubscribe = sinon.spy(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spySubscriptionsUnsubscribe.callCount).to.equal(1);
  });

  describe('getLabel', () => {
    it('should return the form title', () => {
      const form = { title: 'myform' };
      expect(component.itemLabel(form)).to.equal('myform');
    });

    it('should return form code when title not present', () => {
      const form = { code: 'formcode' };
      expect(component.itemLabel(form)).to.equal('formcode');
    });
  });

  it('trackByFn should return form code', () => {
    const form = { code: 'formcode' };
    expect(component.trackByFn(0, form)).to.equal('formcode');
  });

  it('applyFilter should set correct filter', () => {
    const setFilter = sinon.stub(GlobalActions.prototype, 'setFilter');
    const forms = [{ _id: 'form1' }, { _id: 'form2' }];
    component.applyFilter(forms);
    expect(setFilter.callCount).to.equal(1);
    expect(setFilter.args[0]).to.deep.equal([{ forms: { selected: forms } }]);
  });

  it('clear should clear dropdown filter', () => {
    const dropdownFilterClearSpy = sinon.spy(component.dropdownFilter, 'clear');
    component.clear();
    expect(dropdownFilterClearSpy.callCount).to.equal(1);
    expect(dropdownFilterClearSpy.args[0]).to.deep.equal([false]);
  });

  it('should sort forms by title', fakeAsync(() => {
    const forms = [
      {
        _id: 'id-A',
        code: 'code-A',
        title: 'Form A'
      },
      {
        _id: 'id-C',
        code: 'code-C',
        title: 'Form C'
      },
      {
        _id: 'id-B',
        code: 'code-B',
        title: 'Form B'
      }
    ];
    store.overrideSelector(Selectors.getForms, forms);
    store.refreshState();

    component.ngOnInit();
    flush();

    expect(component.forms).to.have.deep.members([
      {
        _id: 'id-A',
        code: 'code-A',
        title: 'Form A'
      },
      {
        _id: 'id-B',
        code: 'code-B',
        title: 'Form B'
      },
      {
        _id: 'id-C',
        code: 'code-C',
        title: 'Form C'
      }
    ]);
  }));
});
