# Quick Reference - Product Upload Feature

## 🎯 Core Concept

Users upload **used products** by selecting a **granular category** (e.g., "Electric Guitar - Solid Body"). The system **automatically calculates environmental impact** based on pre-configured materials for that category.

## 📊 Key Queries

### 1. Browse Catalog

```graphql
query {
  marketCatalog {
    id
    departmentName
    departmentCategory {
      id
      departmentCategoryName
      productCategory {
        id
        productCategoryName
      }
    }
  }
}
```

### 2. View Category Materials

```graphql
query GetCategory($id: ID!) {
  getProductCategory(id: $id) {
    productCategoryName
    averageWeight
    weightUnit
    materials {
      quantity
      unit
      isPrimary
      material {
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
    }
  }
}
```

### 3. Create Product

```graphql
mutation AddProduct($input: AddProductInput!) {
  addProduct(input: $input) {
    id
    name
    price
  }
}

# Variables
{
  "input": {
    "name": "Fender Stratocaster",
    "description": "Used guitar, good condition",
    "brand": "Fender",
    "price": 350000,
    "productCategoryId": 100,
    "condition": "FAIR",
    "conditionDescription": "Minor scratches",
    "color": "Sunburst",
    "images": ["url1", "url2"],
    "isExchangeable": true,
    "isActive": true,
    "badges": ["OPEN_TO_OFFERS"],
    "interests": ["music", "guitars"]
  }
}
```

### 4. View with Impact

```graphql
query GetProduct($id: ID!) {
  getProduct(id: $id) {
    name
    price
    condition
    seller {
      id
      personProfile {
        displayName
      }
    }
    productCategory {
      productCategoryName
      materials {
        quantity
        material {
          materialType
        }
      }
    }
    environmentalImpact {
      totalCo2SavingsKG
      totalWaterSavingsLT
      materialBreakdown {
        materialType
        percentage
        weightKG
        co2SavingsKG
        waterSavingsLT
      }
    }
  }
}
```

## 🔧 Admin Setup (One-time)

### Create Department

```sql
INSERT INTO "Department" (id, "departmentName")
VALUES (1, 'Musical Instruments');
```

### Create Department Category

```sql
INSERT INTO "DepartmentCategory" (id, "departmentId", "departmentCategoryName")
VALUES (10, 1, 'Guitars');
```

### Create Product Categories (Granular!)

```sql
-- Good ✅
INSERT INTO "ProductCategory"
  (id, "departmentCategoryId", "productCategoryName", "averageWeight", "weightUnit")
VALUES
  (100, 10, 'Electric Guitars - Solid Body', 3.5, 'KG'),
  (101, 10, 'Electric Guitars - Semi-Hollow', 3.2, 'KG'),
  (102, 10, 'Acoustic Guitars - Steel String', 2.8, 'KG');

-- Bad ❌ (too generic)
-- 'Electric Guitars' - needs subdivision
```

### Create Materials

```sql
INSERT INTO "MaterialImpactEstimate"
  ("materialType", "estimatedCo2SavingsKG", "estimatedWaterSavingsLT")
VALUES
  ('Wood', 2.1, 150),
  ('Electronics', 5.5, 300),
  ('Metal', 3.2, 200),
  ('Plastic', 4.0, 250);
```

### Link Materials to Category

```sql
INSERT INTO "ProductCategoryMaterial"
  ("productCategoryId", "materialTypeId", "quantity", "unit", "isPrimary")
VALUES
  (100, 1, 70, 'percentage', true),   -- Wood 70%
  (100, 2, 20, 'percentage', false),  -- Electronics 20%
  (100, 3, 10, 'percentage', false);  -- Metal 10%
```

## 💡 Impact Calculation

```
Electric Guitar (3.5kg total weight):

Wood (70%):
  Weight: 3.5kg × 70% = 2.45kg
  CO2: 2.45kg × 2.1 = 5.15 kg CO2 saved
  Water: 2.45kg × 150 = 367.5 L water saved

Electronics (20%):
  Weight: 3.5kg × 20% = 0.7kg
  CO2: 0.7kg × 5.5 = 3.85 kg CO2 saved
  Water: 0.7kg × 300 = 210 L water saved

Metal (10%):
  Weight: 3.5kg × 10% = 0.35kg
  CO2: 0.35kg × 3.2 = 1.12 kg CO2 saved
  Water: 0.35kg × 200 = 70 L water saved

TOTAL: 10.12kg CO2 saved, 647.5L water saved
```

## 🔒 Authentication

All mutations require JWT token with `sellerId` claim:

```
Authorization: Bearer <token>
```

Context extraction in resolver:

```typescript
context.sellerId; // automatically from JWT
```

## 🏗️ Users Subgraph TODO

Add to `users/src/graphql/schema.ts`:

```graphql
type Seller @key(fields: "id") {
  id: ID!
  # ... other fields
}
```

Add to `users/src/graphql/resolvers/seller.ts`:

```typescript
Seller: {
  __resolveReference: async (ref: { id: string }) => {
    return prisma.seller.findUnique({ where: { id: ref.id } });
  };
}
```

## 📁 Files Changed

### Modified

- `src/graphql/schema.ts` - Added types
- `src/graphql/resolvers/product.ts` - Added field resolvers
- `src/graphql/resolvers/impact.ts` - Added queries
- `src/graphql/services/product.ts` - Enhanced logic
- `src/graphql/services/productCategories.ts` - Added materials

### Created

- `src/graphql/services/materialImpacts.ts` - Impact calculations
- `PRODUCT_UPLOAD_FLOW.md` - Complete guide
- `FEDERATION_REQUIREMENTS.md` - Users subgraph guide
- `IMPLEMENTATION_SUMMARY.md` - Tech details
- `QUICK_REFERENCE.md` - This file

## ✅ Testing

```bash
# Start server
cd products
npm run dev

# Test in Apollo Sandbox
# http://localhost:4001/graphql
```

## 🎨 UI Flow

1. **Select Category**

   ```
   Musical Instruments → Guitars → Electric Guitars - Solid Body
   ```

2. **See Impact Preview**

   ```
   "Products in this category save an average of:
    • 10kg CO2 (equal to 2 trees planted)
    • 647L water (equal to 15 showers)"
   ```

3. **Fill Form**
   - Name, description, price
   - Condition + explanation
   - Upload 3-10 images
   - Select badges
   - Toggle exchangeable (Person only)

4. **Confirm & Post**
   - Show calculated impact
   - Display in marketplace

## 🚫 Important Rules

- ❌ **Don't** let users input material percentages
- ✅ **Do** create specific categories for different materials
- ❌ **Don't** use generic categories like "Guitars"
- ✅ **Do** use specific ones like "Electric Guitars - Solid Body"
- ❌ **Don't** allow Business sellers to mark exchangeable
- ✅ **Do** restrict exchanges to Person sellers only

## 📊 Example Categories (Good vs Bad)

### ✅ GOOD (Specific)

- Electric Guitars - Solid Body
- Electric Guitars - Semi-Hollow
- Acoustic Guitars - Steel String
- Acoustic Guitars - Nylon String
- Travel Guitars

### ❌ BAD (Too Generic)

- Guitars
- Electric Guitars
- Musical Instruments

---

**Ready to use!** See `PRODUCT_UPLOAD_FLOW.md` for complete examples.
