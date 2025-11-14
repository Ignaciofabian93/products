# Federation Requirements for Users Subgraph

## Overview

The products subgraph references the `Seller` type from the users subgraph. For proper federation to work, the users subgraph must implement reference resolution for the Seller entity.

## Required Implementation in Users Subgraph

### 1. GraphQL Schema (schema.ts)

The `Seller` type must be marked as an entity with the `@key` directive:

```graphql
type Seller @key(fields: "id") {
  id: ID!
  email: String!
  sellerType: SellerType!
  isActive: Boolean!
  isVerified: Boolean!
  # ... other seller fields

  # Profile relations
  personProfile: PersonProfile
  businessProfile: BusinessProfile

  # Location
  address: String
  city: City
  country: Country
  phone: String
  website: String

  # Gamification
  points: Int!
  sellerLevel: SellerLevel
}
```

### 2. Resolver Implementation

Add a `__resolveReference` resolver for the `Seller` type:

```typescript
// In users/src/graphql/resolvers/seller.ts or similar

export const SellerResolver = {
  // ... existing resolvers

  Seller: {
    __resolveReference: async (reference: { __typename: string; id: string }) => {
      // Fetch seller from database
      const seller = await prisma.seller.findUnique({
        where: { id: reference.id },
        select: {
          id: true,
          email: true,
          sellerType: true,
          isActive: true,
          isVerified: true,
          address: true,
          phone: true,
          website: true,
          points: true,
          sellerLevelId: true,
          // Include profile relations if needed
          personProfile: true,
          businessProfile: true,
          // Include location if needed
          city: { include: { region: { include: { country: true } } } },
        },
      });

      if (!seller) {
        throw new Error(`Seller with id ${reference.id} not found`);
      }

      return seller;
    },
  },
};
```

### 3. Export Resolver in Main Resolver File

```typescript
// In users/src/graphql/resolvers/index.ts

export const resolvers = {
  Query: {
    // ... your queries
  },
  Mutation: {
    // ... your mutations
  },
  Seller: {
    __resolveReference: SellerResolver.Seller.__resolveReference,
  },
};
```

## How It Works

1. **In Products Subgraph:**
   - When a `Product` is queried, it returns `sellerId` field
   - The `Product.seller` field resolver returns: `{ __typename: "Seller", id: parent.sellerId }`
   - This creates a "stub" entity reference

2. **Federation Router:**
   - Receives the stub: `{ __typename: "Seller", id: "some-uuid" }`
   - Routes the request to the users subgraph
   - Calls `Seller.__resolveReference` with the stub

3. **In Users Subgraph:**
   - `__resolveReference` receives `{ __typename: "Seller", id: "some-uuid" }`
   - Fetches full seller data from database
   - Returns complete seller object

4. **Client Receives:**
   ```graphql
   query GetProduct {
     getProduct(id: "1") {
       id
       name
       price
       seller {
         id
         email
         sellerType
         personProfile {
           firstName
           lastName
         }
       }
     }
   }
   ```

## Testing Federation

### Test Query in Apollo Sandbox

```graphql
query TestProductWithSeller {
  getProduct(id: "1") {
    id
    name
    description
    price
    condition
    seller {
      id
      email
      sellerType
      isActive
      isVerified
    }
    productCategory {
      id
      productCategoryName
      materials {
        materialType
        quantity
        unit
        material {
          materialType
          estimatedCo2SavingsKG
          estimatedWaterSavingsLT
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

## Common Issues & Solutions

### Issue: "Cannot return null for non-nullable field Seller.id"

**Solution:** Ensure `__resolveReference` always returns an object with at least the `id` field, even if other fields are null.

### Issue: "Seller type not found in users subgraph"

**Solution:** Verify that:

1. The `Seller` type has the `@key(fields: "id")` directive
2. The type is properly exported in your schema
3. The users subgraph is running and accessible to the gateway

### Issue: Infinite loops or performance problems

**Solution:** Be careful with circular references. If Seller references Products and Products reference Seller, use DataLoader pattern to batch requests.

## Performance Optimization (Optional)

For better performance, implement DataLoader in the users subgraph:

```typescript
import DataLoader from 'dataloader';

// Create a batch function
const batchSellers = async (ids: readonly string[]) => {
  const sellers = await prisma.seller.findMany({
    where: { id: { in: [...ids] } },
  });

  // Return in the same order as requested
  return ids.map(id => sellers.find(s => s.id === id) || null);
};

// In your context creation
export const createContext = () => {
  return {
    dataloaders: {
      sellerLoader: new DataLoader(batchSellers),
    },
  };
};

// In your resolver
Seller: {
  __resolveReference: async (reference, context) => {
    return context.dataloaders.sellerLoader.load(reference.id);
  },
}
```

## Summary

✅ **In Products Subgraph (DONE):**

- Product.seller field resolver returns stub: `{ __typename: "Seller", id: sellerId }`

⚠️ **In Users Subgraph (TODO):**

- Add `@key(fields: "id")` to Seller type in schema
- Implement `Seller.__resolveReference` resolver
- Export resolver in main resolver file

This enables the federation to seamlessly resolve seller data when querying products!
