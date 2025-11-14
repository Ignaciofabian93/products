# Complete Product Upload Flow with Environmental Impact

## Overview

This guide explains the complete flow for uploading a used product to the marketplace, including category selection and automatic environmental impact calculation.

## Database Schema Structure

```
Department (e.g., "Musical Instruments")
  └─ DepartmentCategory (e.g., "Guitars")
      └─ ProductCategory (e.g., "Electric Guitars - Solid Body")
          ├─ averageWeight: 3.5 kg
          └─ materials[] ──> ProductCategoryMaterial
              ├─ materialType: "Wood"
              ├─ quantity: 70 (percentage)
              └─ MaterialImpactEstimate
                  ├─ estimatedCo2SavingsKG: 2.1 per kg
                  └─ estimatedWaterSavingsLT: 150 per kg
```

## Step-by-Step User Flow

### Step 1: Get Marketplace Catalog

**Query:**

```graphql
query GetMarketplaceCatalog {
  marketCatalog {
    id
    departmentName
    departmentImage
    href
    departmentCategory {
      id
      departmentCategoryName
      href
      productCategory {
        id
        productCategoryName
        href
      }
    }
  }
}
```

**Response:**

```json
{
  "data": {
    "marketCatalog": [
      {
        "id": "1",
        "departmentName": "Musical Instruments",
        "departmentCategory": [
          {
            "id": "10",
            "departmentCategoryName": "Guitars",
            "productCategory": [
              {
                "id": "100",
                "productCategoryName": "Electric Guitars - Solid Body"
              },
              {
                "id": "101",
                "productCategoryName": "Electric Guitars - Semi-Hollow"
              },
              {
                "id": "102",
                "productCategoryName": "Acoustic Guitars - Steel String"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Step 2: Get Category Details (Optional - Show Materials Before Upload)

**Query:**

```graphql
query GetCategoryWithMaterials($id: ID!) {
  getProductCategory(id: $id) {
    id
    productCategoryName
    averageWeight
    weightUnit
    materials {
      id
      quantity
      unit
      isPrimary
      material {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
    }
  }
}
```

**Variables:**

```json
{
  "id": "100"
}
```

**Response:**

```json
{
  "data": {
    "getProductCategory": {
      "id": "100",
      "productCategoryName": "Electric Guitars - Solid Body",
      "averageWeight": 3.5,
      "weightUnit": "KG",
      "materials": [
        {
          "quantity": 70,
          "unit": "percentage",
          "isPrimary": true,
          "material": {
            "materialType": "Wood",
            "estimatedCo2SavingsKG": 2.1,
            "estimatedWaterSavingsLT": 150
          }
        },
        {
          "quantity": 20,
          "unit": "percentage",
          "isPrimary": false,
          "material": {
            "materialType": "Electronics",
            "estimatedCo2SavingsKG": 5.5,
            "estimatedWaterSavingsLT": 300
          }
        },
        {
          "quantity": 10,
          "unit": "percentage",
          "isPrimary": false,
          "material": {
            "materialType": "Metal",
            "estimatedCo2SavingsKG": 3.2,
            "estimatedWaterSavingsLT": 200
          }
        }
      ]
    }
  }
}
```

### Step 3: Upload Product

**Mutation:**

```graphql
mutation AddProduct($input: AddProductInput!) {
  addProduct(input: $input) {
    id
    name
    description
    price
    condition
    images
    productCategoryId
    sellerId
    isActive
    createdAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "name": "Fender Stratocaster Electric Guitar",
    "description": "Used electric guitar in good condition. Minor scratches on body but fully functional. Comes with original case.",
    "brand": "Fender",
    "price": 350000,
    "productCategoryId": 100,
    "condition": "FAIR",
    "conditionDescription": "Minor scratches on body, fully functional",
    "color": "Sunburst",
    "images": [
      "https://example.com/guitar-front.jpg",
      "https://example.com/guitar-back.jpg",
      "https://example.com/guitar-case.jpg"
    ],
    "isExchangeable": true,
    "isActive": true,
    "hasOffer": false,
    "badges": ["OPEN_TO_OFFERS", "FOR_GIFT"],
    "interests": ["music", "guitars", "fender", "electric"]
  }
}
```

**Note:** The `sellerId` is automatically extracted from the authentication context (JWT token), so you don't need to provide it.

**Response:**

```json
{
  "data": {
    "addProduct": {
      "id": "550",
      "name": "Fender Stratocaster Electric Guitar",
      "price": 350000,
      "condition": "FAIR",
      "productCategoryId": 100,
      "sellerId": "seller-uuid-123",
      "isActive": true,
      "createdAt": "2025-11-07T10:30:00Z"
    }
  }
}
```

### Step 4: View Product with Environmental Impact

**Query:**

```graphql
query GetProductWithImpact($id: ID!) {
  getProduct(id: $id) {
    id
    name
    description
    price
    condition
    conditionDescription
    images
    brand
    color
    badges
    isExchangeable
    createdAt

    # Seller information (federated from users subgraph)
    seller {
      id
      sellerType
      personProfile {
        firstName
        lastName
        displayName
      }
    }

    # Category with materials
    productCategory {
      id
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

    # Calculated environmental impact
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

**Variables:**

```json
{
  "id": "550"
}
```

**Response:**

```json
{
  "data": {
    "getProduct": {
      "id": "550",
      "name": "Fender Stratocaster Electric Guitar",
      "description": "Used electric guitar in good condition...",
      "price": 350000,
      "condition": "FAIR",
      "conditionDescription": "Minor scratches on body, fully functional",
      "productCategory": {
        "id": "100",
        "productCategoryName": "Electric Guitars - Solid Body",
        "averageWeight": 3.5,
        "weightUnit": "KG",
        "materials": [
          {
            "quantity": 70,
            "unit": "percentage",
            "isPrimary": true,
            "material": {
              "materialType": "Wood",
              "estimatedCo2SavingsKG": 2.1,
              "estimatedWaterSavingsLT": 150
            }
          },
          {
            "quantity": 20,
            "unit": "percentage",
            "material": {
              "materialType": "Electronics",
              "estimatedCo2SavingsKG": 5.5,
              "estimatedWaterSavingsLT": 300
            }
          },
          {
            "quantity": 10,
            "unit": "percentage",
            "material": {
              "materialType": "Metal",
              "estimatedCo2SavingsKG": 3.2,
              "estimatedWaterSavingsLT": 200
            }
          }
        ]
      },
      "environmentalImpact": {
        "totalCo2SavingsKG": 9.97,
        "totalWaterSavingsLT": 577.5,
        "materialBreakdown": [
          {
            "materialType": "Wood",
            "percentage": 70,
            "weightKG": 2.45,
            "co2SavingsKG": 5.15,
            "waterSavingsLT": 367.5
          },
          {
            "materialType": "Electronics",
            "percentage": 20,
            "weightKG": 0.7,
            "co2SavingsKG": 3.85,
            "waterSavingsLT": 210
          },
          {
            "materialType": "Metal",
            "percentage": 10,
            "weightKG": 0.35,
            "co2SavingsKG": 1.12,
            "waterSavingsLT": 70
          }
        ]
      }
    }
  }
}
```

## Environmental Impact Calculation

The system automatically calculates the environmental impact based on:

### Formula:

```
For each material in ProductCategory:
  material_weight_kg = category_average_weight * (material_quantity / 100)
  co2_savings_kg = material_weight_kg * material.estimatedCo2SavingsKG
  water_savings_lt = material_weight_kg * material.estimatedWaterSavingsLT

Total CO2 Savings = Sum of all material CO2 savings
Total Water Savings = Sum of all material water savings
```

### Example Calculation (Electric Guitar - 3.5kg):

```
Wood (70%):
  Weight: 3.5kg * 0.70 = 2.45kg
  CO2: 2.45kg * 2.1 kg CO2/kg = 5.15 kg CO2 saved
  Water: 2.45kg * 150 L/kg = 367.5 liters saved

Electronics (20%):
  Weight: 3.5kg * 0.20 = 0.7kg
  CO2: 0.7kg * 5.5 kg CO2/kg = 3.85 kg CO2 saved
  Water: 0.7kg * 300 L/kg = 210 liters saved

Metal (10%):
  Weight: 3.5kg * 0.10 = 0.35kg
  CO2: 0.35kg * 3.2 kg CO2/kg = 1.12 kg CO2 saved
  Water: 0.35kg * 200 L/kg = 70 liters saved

TOTAL:
  CO2: 10.12 kg saved
  Water: 647.5 liters saved
```

## Additional Queries

### Browse Products by Category

```graphql
query GetProductsByCategory($categoryId: ID!, $page: Int, $pageSize: Int) {
  getProductsByCategory(productCategoryId: $categoryId, page: $page, pageSize: $pageSize, isActive: true) {
    nodes {
      id
      name
      price
      condition
      images
      badges
      environmentalImpact {
        totalCo2SavingsKG
        totalWaterSavingsLT
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
      currentPage
      totalPages
    }
  }
}
```

### Get Exchangeable Products (Person Sellers Only)

```graphql
query GetExchangeableProducts($page: Int, $pageSize: Int) {
  getExchangeableProducts(page: $page, pageSize: $pageSize) {
    nodes {
      id
      name
      price
      condition
      images
      seller {
        id
        personProfile {
          displayName
        }
      }
    }
    pageInfo {
      totalCount
      totalPages
    }
  }
}
```

### Update Product

```graphql
mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    id
    name
    price
    isActive
    updatedAt
  }
}
```

### Toggle Product Active Status

```graphql
mutation ToggleProductActive($id: ID!) {
  toggleProductActive(id: $id) {
    id
    isActive
  }
}
```

## UI/UX Recommendations

### Product Upload Form Flow:

1. **Category Selection (Tree Navigation)**
   - Show Department → DepartmentCategory → ProductCategory
   - Display category-specific fields (size, weight hints)
   - Show material composition preview

2. **Product Details Form**
   - Name, Description, Brand, Color
   - Price (with currency: CLP)
   - Condition dropdown (NEW, LIKE_NEW, FAIR, POOR, etc.)
   - Condition description (required for used items)
   - Image upload (3-10 images)
   - Badges selection (OPEN_TO_OFFERS, FOR_GIFT, etc.)
   - Exchangeable toggle (only for Person profiles)

3. **Environmental Impact Preview**
   - Show estimated CO2 and water savings before submitting
   - Display material breakdown
   - Use engaging visuals (trees planted equivalent, pools of water saved)

4. **Confirmation**
   - Review all details
   - Display calculated environmental impact
   - Submit button

## Important Notes

1. **Authentication Required:** All product mutations require a valid JWT token with `sellerId`
2. **Person vs Business:** Only Person sellers can mark products as exchangeable
3. **Soft Delete:** Products are soft-deleted (deletedAt timestamp) not hard-deleted
4. **Material Data:** Categories must be pre-configured with materials by admins
5. **Federation:** Seller data comes from the users subgraph via Apollo Federation

## Testing Checklist

- [ ] Can browse department catalog
- [ ] Can view category with materials
- [ ] Can create product with authenticated user
- [ ] Environmental impact calculates correctly
- [ ] Product includes seller information
- [ ] Category materials display properly
- [ ] Pagination works for product lists
- [ ] Can update own products only
- [ ] Can toggle product active/inactive
- [ ] Soft delete works correctly
- [ ] Exchangeable products filter works

## Next Steps

1. Implement admin panel for managing categories and materials
2. Add product search and filtering
3. Implement image upload to cloud storage
4. Add product reviews and ratings
5. Create messaging system for buyers/sellers
6. Implement exchange proposal system (for Person sellers)
