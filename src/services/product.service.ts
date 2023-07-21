import { product, ProductAttrs } from '../models/product.model';
import { clothing } from '../models/clothing.model';
import { BadRequestError } from '../errors/badRequestError';
import { InternalServerError } from '../errors/InternalServerError';
import {
  draftProductByShop,
  findAllDraftsForShop,
  findAllProducts,
  findAllPublishedForShop,
  publishProductByShop,
  searchForPublishedProducts,
} from '../models/repositories/product.repo';

export class ProductFactory {
  static productRegistry: { [k: string]: any } = {};
  static registNewProductType(type: string, classRef: any) {
    this.productRegistry[type] = classRef;
  }
  static async createProduct(type: string, payload: ProductAttrs) {
    const productClass = this.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError('invalid product type');
    }

    return new productClass(payload).createProduct();
  }

  static async findAllDraftsForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    limit?: number;
    skip?: number;
    product_shop: string;
  }) {
    try {
      const productDrafts = await findAllDraftsForShop(
        product_shop,
        limit,
        skip
      );

      console.log(product_shop);

      return {
        code: 200,
        metadata: {
          products: productDrafts,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async findAllPublishedForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    limit?: number;
    skip?: number;
    product_shop: string;
  }) {
    try {
      const publishedProducts = await findAllPublishedForShop(
        product_shop,
        limit,
        skip
      );

      console.log(product_shop);

      return {
        code: 200,
        metadata: {
          products: publishedProducts,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async publishProductByShop({
    product_shop,
    _id,
  }: {
    product_shop: string;
    _id: string;
  }) {
    try {
      const publishedProduct = await publishProductByShop(_id, product_shop);
      return {
        code: 200,
        metadata: {
          product: publishedProduct,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async draftProductByShop({
    product_shop,
    _id,
  }: {
    product_shop: string;
    _id: string;
  }) {
    try {
      const draftedProduct = await draftProductByShop(_id, product_shop);
      return {
        code: 200,
        metadata: {
          product: draftedProduct,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }
  static async searchForPublishedProduct({ keyword }: { keyword: string }) {
    try {
      console.log(keyword);

      const products = await searchForPublishedProducts(keyword);
      return {
        code: 200,
        metadata: {
          products,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }
  static async findAllProducts({
    filter = { isPublished: true },
    sort = 'ctime',
    limit = 50,
    page = 1,
  }: {
    filter?: any;
    sort?: string;
    limit?: number;
    page?: number;
  }) {
    try {
      const select = ['product_name', 'product_price'];
      const products = await findAllProducts(filter, select, sort, limit, page);
      return {
        code: 200,
        metadata: {
          products,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }
}

class Product {
  protected product_name: string;
  protected product_desc: string;
  protected product_price: number;
  protected product_quantity: number;
  protected product_type: string;
  protected product_shop: string;
  protected product_attributes: any;

  constructor({
    product_name,
    product_desc,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }: ProductAttrs) {
    this.product_name = product_name;
    this.product_desc = product_desc;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(_id: string) {
    const newProduct = product.build({
      _id,
      product_name: this.product_name,
      product_desc: this.product_desc,
      product_price: this.product_price,
      product_quantity: this.product_quantity,
      product_type: this.product_type,
      product_shop: this.product_shop,
      product_attributes: this.product_attributes,
    });
    await newProduct.save();
    return newProduct;
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = clothing.build({
      product_shop: this.product_shop,
      brand: this.product_attributes.brand,
      size: this.product_attributes.size,
      material: this.product_attributes.material,
    });
    if (!newClothing) {
      throw new BadRequestError('');
    }
    try {
      await newClothing.save();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new InternalServerError();
      }
    }

    try {
      const newProduct = await super.createProduct(newClothing._id);
      if (!newProduct) {
        throw new BadRequestError('');
      }
      return newProduct;
    } catch (error) {
      throw new InternalServerError();
    }
  }
}

ProductFactory.registNewProductType('Clothing', Clothing);
