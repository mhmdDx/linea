
const domain = 'lineastores.myshopify.com';
const storefrontAccessToken = 'cc42a8d47509b5e52fd32b2e714b2604';

async function ShopifyData(query: string, variables = {}) {
  const URL = `https://${domain}/api/2024-01/graphql.json`;

  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  };

  try {
    const data = await fetch(URL, options).then((response) => {
      return response.json();
    });

    if (data.errors) {
      console.error('Shopify API errors:', data.errors);
      throw new Error(data.errors[0].message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw new Error("Error fetching products");
  }
}

export async function getAllProducts() {
  const query = `
  {
    products(first: 25) {
      edges {
        node {
          id
          handle
          title
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
              edges {
                  node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                  }
              }
          }
        }
      }
    }
  }`;

  const response = await ShopifyData(query);
  const allProducts = response.data.products.edges ? response.data.products.edges : [];
  return allProducts;
}

export async function getProductByHandle(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
         variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }`;

  const response = await ShopifyData(query, { handle });
  return response.data.product;
}


export async function createCart(variantId: string, quantity: number) {
  const query = `
    mutation cartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    lines: [{ merchandiseId: variantId, quantity: quantity }]
  };

  const response = await ShopifyData(query, variables);
  return response.data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const query = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
            totalAmount {
                amount
                currencyCode
            }
        }
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                     images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }]
  };

  const response = await ShopifyData(query, variables);
  return response.data.cartLinesAdd.cart;
}

export async function updateCartLines(cartId: string, lineId: string, quantity: number) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
           cost {
            totalAmount {
                amount
                currencyCode
            }
        }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                     price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        images(first: 1) {
                            edges {
                            node {
                                url
                                altText
                            }
                            }
                        }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `;

  const variables = {
    cartId,
    lines: [{ id: lineId, quantity }]
  };

  const response = await ShopifyData(query, variables);
  return response.data.cartLinesUpdate.cart;
}


export async function removeCartLines(cartId: string, lineIds: string[]) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
           cost {
            totalAmount {
                amount
                currencyCode
            }
        }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                     price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        images(first: 1) {
                            edges {
                            node {
                                url
                                altText
                            }
                            }
                        }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `;

  const variables = {
    cartId,
    lineIds
  };

  const response = await ShopifyData(query, variables);
  return response.data.cartLinesRemove.cart;
}

export async function getCart(cartId: string) {
  const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
           cost {
            totalAmount {
                amount
                currencyCode
            }
        }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                     price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        images(first: 1) {
                            edges {
                            node {
                                url
                                altText
                            }
                            }
                        }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

  const response = await ShopifyData(query, { cartId });
  return response.data.cart;
}

export async function getProductsByCollection(handle: string) {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 25) {
          edges {
            node {
              id
              handle
              title
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                    node {
                        id
                        title
                    }
                }
            }
            }
          }
        }
      }
    }`;

  const response = await ShopifyData(query, { handle });
  return response.data.collection?.products?.edges || [];
}

export async function getProductsByQuery(queryStr: string) {
  const query = `
    query getProducts($query: String!) {
      products(first: 25, query: $query) {
        edges {
          node {
            id
            handle
            title
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                  node {
                      id
                      title
                  }
              }
          }
          }
        }
      }
    }
    `;

  const response = await ShopifyData(query, { query: queryStr });
  return response.data.products?.edges || [];
}
