import prisma from '../config/prisma';
import { CreateOrderInput } from '../schemas/order.schema';
import { Order, OrderProduct } from '@prisma/client';

class OrderRepository {
    async create(
        userId: string,
        items: CreateOrderInput,
        totalPrice: number
    ): Promise<Order> {
        return prisma.order.create({
            data: {
                userId,
                totalPrice,
                products: {
                    create: items.map(item => ({
                        quantity: item.quantity,
                        product: {
                            connect: {
                                id: item.productId
                            }
                        }
                    }))
                }
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }

    async findByUserId(userId: string): Promise<(Order & {
        products: (OrderProduct & {
            product: { id: string; name: string; price: number }
        })[];
    })[]> {
        return prisma.order.findMany({
            where: {
                userId
            },
            include: {
                products: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async updateProductStock(productId: string, quantity: number): Promise<void> {
        await prisma.product.update({
            where: { id: productId },
            data: {
                stock: {
                    decrement: quantity
                }
            }
        });
    }

    async checkProductStock(productId: string): Promise<number> {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stock: true }
        });
        return product?.stock ?? 0;
    }
}

export default new OrderRepository();