import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { OrderTemplateData } from '../../models/order-templates/order-template.interface';
import { OrderTemplate, OrderTemplateHeader } from '../../models/order-templates/order-template.model';

import { OrderTemplateService } from './order-template.service';

describe('Order Template Service', () => {
  let apiServiceMock: ApiService;
  let orderTemplateService: OrderTemplateService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    orderTemplateService = TestBed.get(OrderTemplateService);
  });

  it('should be created', () => {
    expect(orderTemplateService).toBeTruthy();
  });

  it("should get order templates when 'getOrderTemplates' is called", done => {
    when(apiServiceMock.get(`customers/-/wishlists`)).thenReturn(of({ elements: [{ uri: 'any/wishlists/1234' }] }));
    when(apiServiceMock.get(`customers/-/wishlists/1234`)).thenReturn(of({ id: '1234', preferred: true }));

    orderTemplateService.getOrderTemplates().subscribe(data => {
      verify(apiServiceMock.get(`customers/-/wishlists`)).once();
      verify(apiServiceMock.get(`customers/-/wishlists/1234`)).once();
      expect(data).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "1234",
            "items": Array [],
            "itemsCount": 0,
            "preferred": true,
            "public": undefined,
            "title": undefined,
          },
        ]
      `);
      done();
    });
  });

  it("should create an order template when 'createOrderTemplate' is called", done => {
    const orderTemplateId = '1234';
    const orderTemplateHeader: OrderTemplateHeader = { title: 'order template title', preferred: false };
    when(apiServiceMock.post(`customers/-/wishlists`, anything())).thenReturn(
      of({ title: orderTemplateId } as OrderTemplateData)
    );

    orderTemplateService.createOrderTemplate(orderTemplateHeader).subscribe(data => {
      expect(orderTemplateId).toEqual(data.id);
      verify(apiServiceMock.post(`customers/-/wishlists`, anything())).once();
      done();
    });
  });

  it("should delete a order template when 'deleteOrderTemplate' is called", done => {
    const orderTemplateId = '1234';

    when(apiServiceMock.delete(`customers/-/wishlists/${orderTemplateId}`)).thenReturn(of({}));

    orderTemplateService.deleteOrderTemplate(orderTemplateId).subscribe(() => {
      verify(apiServiceMock.delete(`customers/-/wishlists/${orderTemplateId}`)).once();
      done();
    });
  });

  it("should update a order template when 'updateOrderTemplate' is called", done => {
    const orderTemplate: OrderTemplate = { id: '1234', title: 'order template title', preferred: false };

    when(apiServiceMock.put(`customers/-/wishlists/${orderTemplate.id}`, anything())).thenReturn(of({ orderTemplate }));

    orderTemplateService.updateOrderTemplate(orderTemplate).subscribe(data => {
      expect(orderTemplate.id).toEqual(data.id);
      verify(apiServiceMock.put(`customers/-/wishlists/${orderTemplate.id}`, anything())).once();
      done();
    });
  });

  it("should add a product to a order template when 'addProductToOrderTemplate' is called", done => {
    const orderTemplateId = '1234';
    const sku = 'abcd';

    when(apiServiceMock.post(`customers/-/wishlists/${orderTemplateId}/products/${sku}`, anything())).thenReturn(
      of({})
    );
    when(apiServiceMock.get(`customers/-/wishlists/${orderTemplateId}`)).thenReturn(
      of({ title: 'order template title' } as OrderTemplateData)
    );

    orderTemplateService.addProductToOrderTemplate(orderTemplateId, sku).subscribe(() => {
      verify(apiServiceMock.post(`customers/-/wishlists/${orderTemplateId}/products/${sku}`, anything())).once();
      verify(apiServiceMock.get(`customers/-/wishlists/${orderTemplateId}`)).once();
      done();
    });
  });

  it("should remove a product from a order template when 'removeProductToOrderTemplate' is called", done => {
    const orderTemplateId = '1234';
    const sku = 'abcd';

    when(apiServiceMock.delete(`customers/-/wishlists/${orderTemplateId}/products/${sku}`)).thenReturn(of({}));
    when(apiServiceMock.get(`customers/-/wishlists/${orderTemplateId}`)).thenReturn(
      of({ title: 'order template title' } as OrderTemplateData)
    );

    orderTemplateService.removeProductFromOrderTemplate(orderTemplateId, sku).subscribe(() => {
      verify(apiServiceMock.delete(`customers/-/wishlists/${orderTemplateId}/products/${sku}`)).once();
      verify(apiServiceMock.get(`customers/-/wishlists/${orderTemplateId}`)).once();
      done();
    });
  });
});
