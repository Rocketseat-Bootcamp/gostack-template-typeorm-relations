import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const productByName = await this.ormRepository.findOne({
      where: { name }
    });

    return productByName;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(p => p.id);
    const productsById = await this.ormRepository.findByIds(ids);
    return productsById
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    await this.ormRepository.save(products);
    const ids = products.map(p => p.id);

    const newProducts = await this.ormRepository.findByIds(ids);
    return newProducts;
  }
}

export default ProductsRepository;
