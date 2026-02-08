const BASE_URL = "http://localhost:3000/api";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verifyProducts() {
    try {
        console.log("Starting Product verification...");

        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);

        // 1. Create a User
        const userEmail = `testuser_prod_${uniqueId}@example.com`;
        const userData = {
            name: "Test User Product",
            email: userEmail,
            password: "password123",
            role: "student"
        };

        console.log("Creating user...", userData);
        const userResponse = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            throw new Error(`Failed to create user: ${userResponse.status} ${errorText}`);
        }
        const user = await userResponse.json();
        console.log("User created:", user._id);
        const userId = user._id;

        await delay(500);

        // 2. Create a Seller
        const sellerData = {
            user_id: userId,
            shop_name: `Test Shop Product ${uniqueId}`,
            description: "A test shop description for products",
            status: "active"
        };

        console.log("Creating seller...", sellerData);
        const sellerResponse = await fetch(`${BASE_URL}/sellers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sellerData)
        });

        if (!sellerResponse.ok) {
            const errorText = await sellerResponse.text();
            throw new Error(`Failed to create seller: ${sellerResponse.status} ${errorText}`);
        }
        const seller = await sellerResponse.json();
        console.log("Seller created:", seller._id);
        const sellerId = seller._id;

        await delay(500);

        // 3. Create a Product
        // Note: category_id is required. Since we don't have categories yet, we need a valid ObjectId.
        // Mongoose might validate if "Category" collection exists, but usually ref check is loose on save 
        // unless validated. Let's generic a dummy ID.
        const dummyCategoryId = new Array(24).fill('0').join(''); // Or actually better to generate one:
        // Or if we can, let's just use the user ID as a fake category ID for now if referential integrity isn't strictly enforced
        // But better is to just generate a random valid ObjectId string
        const fakeCategoryId = "65c2b6e12f8a9a0b1c2d3e4f"; // Random valid hex

        const productData = {
            seller_id: sellerId,
            title: `Test Product ${uniqueId}`,
            description: "A test product description",
            category_id: fakeCategoryId,
            brand: "Test Brand",
            status: "draft"
        };

        console.log("Creating product...", productData);
        const productResponse = await fetch(`${BASE_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData)
        });

        if (!productResponse.ok) {
            const errorText = await productResponse.text();
            throw new Error(`Failed to create product: ${productResponse.status} ${errorText}`);
        }
        const product = await productResponse.json();
        console.log("Product created:", product);

        if (product.title !== productData.title) throw new Error("Product title mismatch");

        await delay(500);

        // 4. Get All Products
        console.log("Fetching all products...");
        const getAllResponse = await fetch(`${BASE_URL}/products`);
        if (!getAllResponse.ok) throw new Error("Failed to get all products");
        const allProducts = await getAllResponse.json();
        console.log(`Found ${allProducts.length} products`);

        const foundProduct = allProducts.find(p => p._id === product._id);
        if (!foundProduct) throw new Error("Created product not found in list");

        await delay(500);

        // 5. Get Product by ID
        console.log(`Fetching product by ID: ${product._id}...`);
        const getByIdResponse = await fetch(`${BASE_URL}/products/${product._id}`);
        if (!getByIdResponse.ok) throw new Error("Failed to get product by ID");
        const fetchedProduct = await getByIdResponse.json();
        if (fetchedProduct._id !== product._id) throw new Error("Fetched product ID mismatch");

        await delay(500);

        // 6. Update Product
        const updateData = { description: "Updated product description", status: "active" };
        console.log("Updating product...", updateData);
        const updateResponse = await fetch(`${BASE_URL}/products/${product._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) throw new Error("Failed to update product");
        const updatedProduct = await updateResponse.json();
        console.log("Product updated:", updatedProduct);

        if (updatedProduct.description !== updateData.description) throw new Error("Update description failed");

        await delay(500);

        // 7. Delete Product
        console.log("Deleting product...");
        const deleteResponse = await fetch(`${BASE_URL}/products/${product._id}`, {
            method: "DELETE"
        });

        if (!deleteResponse.ok) throw new Error("Failed to delete product");
        console.log("Product deleted");

        await delay(500);

        // Verify Deletion
        const verifyDeleteResponse = await fetch(`${BASE_URL}/products/${product._id}`);
        if (verifyDeleteResponse.status !== 404) {
            throw new Error(`Product still exists after deletion (status ${verifyDeleteResponse.status})`);
        }
        console.log("Deletion verified");

        console.log("✅ Product Verification Successful!");

    } catch (error) {
        console.error("❌ Product Verification Failed:", error);
        process.exit(1);
    }
}

verifyProducts();
