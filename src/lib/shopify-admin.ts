export async function createShopifyOrder(
    email: string,
    lineItems: Array<{ variantId: string; quantity: number; price: string; title: string }>,
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        province: string;
        zip?: string;
        country: string;
        phone?: string;
    }
) {
    const SHOPIFY_DOMAIN = 'lineastores.myshopify.com';
    const ADMIN_ACCESS_TOKEN = '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';

    // Format line items for Shopify Admin API
    const formattedLineItems = lineItems.map((item) => ({
        variant_id: item.variantId.replace('gid://shopify/ProductVariant/', ''),
        quantity: item.quantity,
        price: item.price,
    }));

    // Create draft order using Shopify Admin API
    const draftOrderPayload = {
        draft_order: {
            email: email,
            line_items: formattedLineItems,
            shipping_address: {
                first_name: shippingAddress.firstName,
                last_name: shippingAddress.lastName,
                address1: shippingAddress.address1,
                address2: shippingAddress.address2 || '',
                city: shippingAddress.city,
                province: shippingAddress.province,
                zip: shippingAddress.zip || '',
                country: shippingAddress.country,
                phone: shippingAddress.phone || '',
            },
            billing_address: {
                first_name: shippingAddress.firstName,
                last_name: shippingAddress.lastName,
                address1: shippingAddress.address1,
                address2: shippingAddress.address2 || '',
                city: shippingAddress.city,
                province: shippingAddress.province,
                zip: shippingAddress.zip || '',
                country: shippingAddress.country,
                phone: shippingAddress.phone || '',
            },
            note: 'Order placed via custom checkout',
            tags: 'custom-checkout',
        },
    };

    try {
        // Create draft order
        const draftOrderResponse = await fetch(
            `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/draft_orders.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
                },
                body: JSON.stringify(draftOrderPayload),
            }
        );

        if (!draftOrderResponse.ok) {
            const errorData = await draftOrderResponse.json();
            console.error('Shopify API Error:', errorData);
            throw new Error('Failed to create draft order');
        }

        const draftOrderData = await draftOrderResponse.json();
        const draftOrderId = draftOrderData.draft_order.id;

        // Complete the draft order to convert it to a real order
        const completeResponse = await fetch(
            `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/draft_orders/${draftOrderId}/complete.json`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    payment_pending: false,
                }),
            }
        );

        if (!completeResponse.ok) {
            const errorData = await completeResponse.json();
            console.error('Failed to complete draft order:', errorData);
            throw new Error('Failed to complete order');
        }

        const completedOrderData = await completeResponse.json();

        return {
            success: true,
            orderId: completedOrderData.draft_order.order_id,
            orderName: completedOrderData.draft_order.name,
            message: 'Order created successfully',
        };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}
