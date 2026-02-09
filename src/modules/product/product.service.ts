// product.service.ts
async create(data, userId: string) {
  const product = ProductRepository.create({
    ...data,
    created_by_id: userId
  });

  return ProductRepository.save(product);
}
