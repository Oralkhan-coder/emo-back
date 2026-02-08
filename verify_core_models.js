const BASE_URL = "http://localhost:3000/api";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verifyCoreModels() {
    try {
        console.log("Starting Core Models verification...");
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);

        // 0. Setup User and Seller (Prerequisites)
        console.log("Setting up prerequisites...");
        const userData = {
            name: "Test User Core",
            email: `core_user_${uniqueId}@example.com`,
            password: "password123",
            role: "student"
        };
        const userRes = await fetch(`${BASE_URL}/users`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userData)
        });
        if (!userRes.ok) throw new Error("User create failed");
        const user = await userRes.json();

        const sellerData = {
            user_id: user._id,
            shop_name: `Core Shop ${uniqueId}`,
            description: "Core shop desc"
        };
        const sellerRes = await fetch(`${BASE_URL}/sellers`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sellerData)
        });
        if (!sellerRes.ok) throw new Error("Seller create failed");
        const seller = await sellerRes.json();

        // 1. Verify Category
        console.log("\n--- Verifying Category ---");
        const categoryData = {
            name: `Category ${uniqueId}`,
            slug: `category-${uniqueId}`,
            description: "A test category"
        };
        console.log("Creating category...");
        const catRes = await fetch(`${BASE_URL}/categories`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(categoryData)
        });
        if (!catRes.ok) throw new Error(`Category create failed: ${catRes.status}`);
        const category = await catRes.json();
        console.log("Category created:", category._id);

        console.log("Fetching categories...");
        const allCatsRes = await fetch(`${BASE_URL}/categories`);
        const allCats = await allCatsRes.json();
        if (!allCats.find(c => c._id === category._id)) throw new Error("Category not found in list");

        // 2. Create Product (Prerequisite for Variants/Images)
        console.log("\n--- Setting up Product ---");
        const productData = {
            seller_id: seller._id,
            title: `Core Product ${uniqueId}`,
            category_id: category._id,
            status: "active"
        };
        const prodRes = await fetch(`${BASE_URL}/products`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(productData)
        });
        if (!prodRes.ok) throw new Error("Product create failed");
        const product = await prodRes.json();
        console.log("Product created:", product._id);

        // 3. Verify ProductVariant
        console.log("\n--- Verifying ProductVariant ---");
        const variantData = {
            product_id: product._id,
            sku_code: `SKU-${uniqueId}`,
            price: 1500,
            stock_quantity: 10,
            attributes: { size: "L", color: "Red" }
        };
        console.log("Creating variant...");
        const varRes = await fetch(`${BASE_URL}/variants`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(variantData)
        });
        if (!varRes.ok) {
            const txt = await varRes.text();
            throw new Error(`Variant create failed: ${varRes.status} ${txt}`);
        }
        const variant = await varRes.json();
        console.log("Variant created:", variant._id);

        console.log("Fetching variants for product...");
        const prodVarsRes = await fetch(`${BASE_URL}/variants?product_id=${product._id}`);
        const prodVars = await prodVarsRes.json();
        if (prodVars.length !== 1 || prodVars[0]._id !== variant._id) throw new Error("Variant list mismatch");

        // 4. Verify ProductImage
        console.log("\n--- Verifying ProductImage ---");
        const imageData = {
            product_id: product._id,
            image_url: "http://example.com/image.jpg",
            sort_order: 1
        };
        console.log("Creating image...");
        const imgRes = await fetch(`${BASE_URL}/images`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(imageData)
        });
        if (!imgRes.ok) throw new Error("Image create failed");
        const image = await imgRes.json();
        console.log("Image created:", image._id);

        console.log("Fetching images for product...");
        const prodImgsRes = await fetch(`${BASE_URL}/images?product_id=${product._id}`);
        const prodImgs = await prodImgsRes.json();
        if (prodImgs.length !== 1 || prodImgs[0]._id !== image._id) throw new Error("Image list mismatch");

        console.log("\n✅ Core Models Verification Successful!");

    } catch (error) {
        console.error("\n❌ Verification Failed:", error);
        process.exit(1);
    }
}

verifyCoreModels();
