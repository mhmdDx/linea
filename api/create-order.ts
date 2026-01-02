import type { VercelRequest, VercelResponse } from '@vercel/node';

const SHOPIFY_DOMAIN = 'lineastores.myshopify.com';


interface LineItem {
    variantId: string;
    quantity: number;
    price: string;
    title: string;
}

interface ShippingAddress {
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

interface OrderRequest {
    email: string;
    lineItems: LineItem[];
    shippingAddress: ShippingAddress;
    customerId?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Log for debugging
    const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    console.log('Creating order with token:', ADMIN_ACCESS_TOKEN ? 'Token exists' : 'Token missing');

    try {
        const { email, lineItems, shippingAddress, customerId }: OrderRequest = req.body;

        // Validate required fields
        if (!email || !lineItems || !shippingAddress) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!ADMIN_ACCESS_TOKEN) {
            return res.status(500).json({ error: 'Admin access token not configured' });
        }

        // Format line items for Shopify Admin API
        const formattedLineItems = lineItems.map((item) => {
            const variantIdString = item.variantId.replace('gid://shopify/ProductVariant/', '');
            const variantId = parseInt(variantIdString, 10);

            if (isNaN(variantId)) {
                console.error(`Invalid variant ID: ${item.variantId} -> ${variantIdString}`);
            }

            return {
                variant_id: variantId,
                quantity: item.quantity,
                price: item.price,
            };
        });

        // Create draft order using Shopify Admin API (using latest API version)
        const draftOrderPayload: any = {
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

        if (customerId) {
            // Ensure customerId is a number if it's a gid
            const customerIdString = customerId.replace('gid://shopify/Customer/', '');
            const customerIdInt = parseInt(customerIdString, 10);
            if (!isNaN(customerIdInt)) {
                draftOrderPayload.draft_order.customer = { id: customerIdInt };
            }
        }

        console.log('Attempting to create draft order with payload:', JSON.stringify(draftOrderPayload, null, 2));

        console.log('Attempting to create draft order...');

        // Create draft order (using 2024-10 API version)
        const draftOrderResponse = await fetch(
            `https://${SHOPIFY_DOMAIN}/admin/api/2024-10/draft_orders.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
                },
                body: JSON.stringify(draftOrderPayload),
            }
        );

        const responseText = await draftOrderResponse.text();
        console.log('Draft order response status:', draftOrderResponse.status);
        console.log('Draft order response:', responseText);

        if (!draftOrderResponse.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { message: responseText };
            }

            console.error('Shopify API Error Response:', JSON.stringify(errorData, null, 2));
            if (errorData.errors) {
                console.error('Validation errors:', JSON.stringify(errorData.errors, null, 2));
            }
            return res.status(draftOrderResponse.status).json({
                error: 'Failed to create draft order',
                details: errorData,
                statusCode: draftOrderResponse.status,
            });
        }

        const draftOrderData = JSON.parse(responseText);
        const draftOrderId = draftOrderData.draft_order.id;

        console.log('Draft order created:', draftOrderId);

        // Complete the draft order to convert it to a real order
        const completeResponse = await fetch(
            `https://${SHOPIFY_DOMAIN}/admin/api/2024-10/draft_orders/${draftOrderId}/complete.json`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    payment_pending: true,
                }),
            }
        );

        if (!completeResponse.ok) {
            const errorData = await completeResponse.json();
            console.error('Failed to complete draft order:', errorData);
            return res.status(completeResponse.status).json({
                error: 'Failed to complete order',
                details: errorData,
            });
        }

        const completedOrderData: any = await completeResponse.json();
        const orderId = completedOrderData.draft_order.order_id;

        // Fetch the actual order to get its real name (e.g., #1015)
        const orderResponse = await fetch(
            `https://${SHOPIFY_DOMAIN}/admin/api/2024-10/orders/${orderId}.json?fields=id,name`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
                },
            }
        );

        let actualOrderName = completedOrderData.draft_order.name; // Fallback

        if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            actualOrderName = orderData.order.name;
        } else {
            console.warn("Could not fetch created order details to get name");
        }

        return res.status(200).json({
            success: true,
            orderId: orderId,
            orderName: actualOrderName,
            message: 'Order created successfully',
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
