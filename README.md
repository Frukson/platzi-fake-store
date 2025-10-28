# Platzi Fake Store

A web application for managing an online store using Platzi Fake Store API.

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation and Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will start running on `http://localhost:3000`

## Test Credentials

For testing purposes, you can use the following credentials:

- **Email:** john@mail.com
- **Password:** changeme

## Known Issues

### 1. Category Update Issue
There is a known API issue with updating categories. When sending the category ID returned from the categories response, the update does not apply to the element as expected. 

> Note: We do not use optimistic updates to avoid showing incorrect data to users. When the data refreshes, the categories will revert to those assigned during element creation.

### 2. Refresh Token
The refresh token functionality is not implemented because the API doesn't provide a way to test it by setting a custom expiration time.

### 3. Price Range Filtering
The API does not handle `price_min` and `price_max` parameters correctly when filtering products. Specifically:
- Values of `0` are treated as undefined and ignored by the API
- Providing only one parameter (either `price_min` or `price_max`) without the other results in no filtering being applied

> Note: A fix has been implemented in `products.ts` → `getProducts()` method that automatically sets missing values (`price_min = 1` or `price_max = 999999`) and removes parameters equal to `0` to ensure proper filtering behavior.
