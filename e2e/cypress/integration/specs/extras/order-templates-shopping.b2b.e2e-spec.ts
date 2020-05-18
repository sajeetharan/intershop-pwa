import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { OrderTemplatesDetailsPage } from '../../pages/account/order-templates-details.page';
import { OrderTemplatesOverviewPage } from '../../pages/account/order-templates-overview.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  category: 'networks',
  subcategory: 'networks.firewalls',
  product1: '859910',
  product2: '3459777',
  product3: '3542794',
};

describe('Order Template Shopping Experience Functionality', () => {
  const accountOrderTemplate = 'account order template';
  const productOrderTemplate = 'product order template';
  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo('/account/order-templates');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page
        .submit()
        .its('status')
        .should('equal', 200);
    });
    at(OrderTemplatesOverviewPage, page => {
      page.addOrderTemplate(accountOrderTemplate);
    });
  });

  it('user adds a product from the product tile to order template (with selecting a order template)', () => {
    at(OrderTemplatesOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page =>
      page.productList.addToOrderTemplate.addProductToOrderTemplateFromList(_.product1, productOrderTemplate)
    );
    at(OrderTemplatesDetailsPage, page => page.listItemLink.invoke('attr', 'href').should('contain', _.product1));
  });

  it('user adds a order template product to cart', () => {
    at(OrderTemplatesDetailsPage, page => {
      page.addProductToBasket(_.product1, 4);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.contains(_.product1).should('exist');
      page.lineItems
        .contains(_.product1)
        .closest('[data-testing-id="product-list-item"]')
        .find('[data-testing-id="quantity"]')
        .should('have.value', '4');
    });
  });

  it('user adds a product to order template from shopping cart (with order template selection)', () => {
    at(CartPage, page => {
      page.addProductToOrderTemplate();
      page.addToOrderTemplate.addProductToOrderTemplateFromPage(accountOrderTemplate, true);
    });
    at(OrderTemplatesDetailsPage, page => {
      page.listItemLink.invoke('attr', 'href').should('contain', _.product1);
    });
  });
});
