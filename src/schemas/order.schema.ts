import { z } from 'zod';

export const OrderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive()
    
});

export const CreateOrderSchema = z.array(OrderItemSchema);

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;