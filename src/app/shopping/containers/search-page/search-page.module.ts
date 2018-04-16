import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { SearchPageComponent } from '../../components/search/search-page/search-page.component';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { SearchPageContainerComponent } from './search-page.container';
import { searchPageRoutes } from './search-page.routes';

@NgModule({
  imports: [RouterModule.forChild(searchPageRoutes), SharedModule, ShoppingSharedModule],
  providers: [ProductsService],
  declarations: [SearchPageContainerComponent, SearchPageComponent],
})
export class SearchPageModule {}