const { test, expect, request } = require('@playwright/test');



test.describe('DummyJSON products API', () => {
  /**
   * Playwright’s request fixture provides a way to create an APIRequestContext
   * with a common base URL and default headers.  We create one context per
   * suite to avoid reconnecting for each test.  Each test uses this context
   * to send HTTP requests and then asserts on the status code and response
   * body.  See https://playwright.dev/docs/api-testing for more details.
   */
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: 'https://dummyjson.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('positive: GET single product returns expected fields', async () => {
    const response = await apiContext.get('/products/1');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    // The API should return a product object with id 1 and a defined title【368992141903063†L0-L20】.
    expect(body.id).toBe(1);
    expect(body.title).toBeDefined();
  });

  test('positive: GET products list with limit returns limited items', async () => {
    const limit = 5;
    const response = await apiContext.get(`/products?limit=${limit}`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(limit);
  });

  test('positive: POST add product returns created product with new id', async () => {
    const newProduct = {
      title: 'Playwright Test Product',
      description: 'Created during automated API test',
      price: 12.34,
      brand: 'TestBrand',
      category: 'test-category',
    };
    const response = await apiContext.post('/products/add', { data: newProduct });
    // According to the documentation, adding a product simulates a POST and returns
    // the created product with a generated id【490333067743040†L1185-L1212】.
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.title).toBe(newProduct.title);
  });

  test('positive: PUT update product modifies existing product', async () => {
    const updatedFields = { title: 'Playwright Updated Title' };
    const response = await apiContext.put('/products/1', { data: updatedFields });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    // Only the supplied fields are updated on the returned object【490333067743040†L1223-L1241】.
    expect(body.id).toBe(1);
    expect(body.title).toBe(updatedFields.title);
  });

  test('positive: DELETE product returns deletion metadata', async () => {
    const response = await apiContext.delete('/products/1');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    // Deleting a product sets isDeleted to true and returns deletedOn timestamp【490333067743040†L1244-L1267】.
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toBeDefined();
  });

  test('negative: GET non‑existent product returns not found message', async () => {
    const response = await apiContext.get('/products/9999');
    // The API returns a JSON object with a message field when an ID does not exist【155732635864417†L0-L0】.
    expect(response.status()).not.toBe(200);
    const body = await response.json();
    expect(body.message).toContain("not found");
  });

  test('negative: POST add product with missing required field returns error', async () => {
    // The DummyJSON API does not enforce required fields and will create a product object even if 'title' is missing.
    const incompleteProduct = {
      description: 'Missing title field',
      price: 1.23,
    };
    const response = await apiContext.post('/products/add', { data: incompleteProduct });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.description).toBe(incompleteProduct.description);
    expect(body.price).toBe(incompleteProduct.price);
  });

  test('negative: PUT update non‑existent product returns not found message', async () => {
    const response = await apiContext.put('/products/9999', { data: { title: 'Does not matter' } });
    expect(response.status()).not.toBe(200);
    const body = await response.json();
    expect(body.message).toContain("not found");
  });

  test('negative: DELETE non‑existent product returns not found message', async () => {
    const response = await apiContext.delete('/products/9999');
    expect(response.status()).not.toBe(200);
    const body = await response.json();
    expect(body.message).toContain("not found");
  });
});