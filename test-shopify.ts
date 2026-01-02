
import { ShopifyData } from './src/lib/shopify.ts';

async function debugShopifyData() {
    console.log("Debugging Shopify Payment Settings...");

    try {
        const query = `
          query {
            shop {
              name
              paymentSettings {
                acceptedCardBrands
                currencyCode
                supportedDigitalWallets
              }
            }
          }
        `;

        const response = await ShopifyData(query);

        console.log("Shop Settings:", JSON.stringify(response, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

debugShopifyData();
