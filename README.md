


# ProductStatusTracker
API for Tracking Product Status and Location

### Models
- User Model
```
{username: {type: String,required: true},email:{type: String, required: true, unique: true},password: { type: String, required: true },role: { type: String, enum: ['Admin', 'Customer'], default: "Customer",required: true },isDeleted:{type: Boolean, default: false}}
```
- Product Model
```
{productName: { type: String, required: true },userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true },description: { type: String },deliveryAddress: { type: String, },trackingNumber: { type: String},isDeleted:{type: Boolean, default: false},quantity:{type: Number,default:1},price:{type: Number},additionalInfo:{type: String}}
```

- Tracker Model
```
{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'productDetails', required: true }, trackingNumber: { type: String, required: true }, status: { type: String, enum: ['Created', 'In Manufacturing', 'Packaged', 'In Transit', 'Out for Delivery', 'Delivered', 'Returned', 'Canceled'], required: true }, additionalInfo: { type: String }, location: { type: String, required: true }, timestamp: { type: Date, default: Date.now }, isDeleted: { type: Boolean, default: false } }
```

To start the server, run the following command in your terminal:
`npm start`

# User Registration API

This API endpoint is used to register a new user with default customer status.

## Endpoint

- **Method:** POST
- **URL:** `http://localhost:5000/register`
- **Content-Type:** application/json

## Request Body

The request body must be a JSON object with the following fields:

- `username`: The custom username for the new user.
- `email`: The email address of the new user (must be unique and in valid format).
- `password`: The password for the new user (Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character. For example, "Qwerty@1" meets these requirements).

## Sample Request

```json
{
  "username": "example_user",
  "email": "example@example.com",
  "password": "Password@123"
}
```

# User Login API

This API endpoint is used for user authentication and login.

## Endpoint

- **Method:** POST
- **URL:** `http://localhost:5000/login`
- **Content-Type:** application/json

## Request Body

The request body must be a JSON object with the following fields:

- `email`: The email address of the user.
- `password`: The password associated with the user's account.

## Sample Request

```json
{
  "email": "example@example.com",
  "password": "Password@123"
}
```


# Create Product API

This API endpoint is used to create a new product.

## Endpoint

- **Method:** POST
- **URL:** `http://localhost:5000/create-product`
- **Content-Type:** application/json
- **Authorization:** JWT Token (Bearer token)

## Request Body

The request body must be a JSON object with the following fields:

- `productName`: The name of the product.
- `description`: The description of the product.
- `deliveryAddress`: The delivery address for the product.
- `quantity`: The quantity of the product.
- `price`: The price of the product.

## Sample Request

```json
{
  "productName": "Example Product",
  "description": "This is an example product.",
  "deliveryAddress": "123 Example St, City, Country",
  "quantity": 10,
  "price": 99.99
}
```

# Get Products API

This API endpoint is used to retrieve products based on user roles.

## Endpoint

- **Method:** GET
- **URL:** `http://localhost:5000/products`
- **Authorization:** JWT Token (Bearer token)

## Response

- **Status Code:** 200 OK
- **Content-Type:** application/json

### Success Response

```json
{
  "status": true,
  "data": [
    {
      "_id": "product_id",
      "productName": "Example Product 1",
      "description": "This is an example product 1.",
      "deliveryAddress": "123 Example St, City, Country",
      "quantity": 10,
      "price": 99.99,
      "trackingNumber": "unique_tracking_code_1"
    },
    {
      "_id": "product_id",
      "productName": "Example Product 2",
      "description": "This is an example product 2.",
      "deliveryAddress": "456 Example St, City, Country",
      "quantity": 5,
      "price": 49.99,
      "trackingNumber": "unique_tracking_code_2"
    }
   
  ]
}


```

# Update Product API

This API endpoint is used to update the quantity and/or price of a product.

## Endpoint

- **Method:** PUT
- **URL:** `http://localhost:5000/update-product`
- **Content-Type:** application/json
- **Authorization:** JWT Token (Bearer token)

## Request Body

The request body must be a JSON object with the following fields:

- `productId`: The ID of the product to update.
- `quantity`: (Optional) The new quantity of the product.
- `price`: (Optional) The new price of the product.

## Sample Request

```json
{
  "productId": "product_id",
  "quantity": 20,
  "price": 129.99
}
```

# Delete Product API

This API endpoint is used to delete a product.

## Endpoint

- **Method:** DELETE
- **URL:** `http://localhost:5000/delete-product`
- **Content-Type:** application/json
- **Authorization:** JWT Token (Bearer token)

## Request Body

The request body must be a JSON object with the following fields:

- `productId`: The ID of the product to delete.
- `reason`: The reason for deleting the product.

## Sample Request

```json
{
  "productId": "product_id",
  "reason": "Product no longer needed"
}

```

# Create Tracking Event API

This API endpoint is used to create a new tracking event for a product.

## Endpoint

- **Method:** POST
- **URL:** `http://localhost:5000/create-tracking-event`
- **Content-Type:** application/json
- **Authorization:** JWT Token (Bearer token)

## Request Body

The request body must be a JSON object with the following fields:

- `location`: The location where the tracking event occurred.
- `trackingCode`: The tracking code associated with the product.

## Sample Request

```json
{
  "location": "Warehouse A",
  "trackingCode": "unique_tracking_code"
}

```


# Update Tracking Event API

This API endpoint is used to update the status and/or location of a tracking event.

## Endpoint

- **Method:** PUT
- **URL:** `http://localhost:5000/update-tracking-event`
- **Content-Type:** application/json
- **Authorization:** JWT Token (Bearer token)

## Request Body

The request body must be a JSON object with the following fields:

- `status`: The new status of the tracking event (e.g., "Delivered", "Returned").
- `location`: (Optional) The new location of the tracking event.
- `trackingNumber`: The tracking number associated with the product.
- `additionalInfo`: (Optional) Additional information related to the tracking event.

## Sample Request

```json
{
  "status": "Delivered",
  "trackingNumber": "unique_tracking_code"
}
```


# Get Tracking Event API

This API endpoint is used to retrieve tracking event details based on the provided tracking number.

## Endpoint

- **Method:** GET
- **URL:** `http://localhost:5000/get-tracking-event?trackingNumber={trackingNumber}`
- **Authorization:** JWT Token (Bearer token)

## Request Parameters

- `trackingNumber`: The tracking number associated with the product.

## Response

- **Status Code:** 200 OK
- **Content-Type:** application/json

### Success Response

```json
{
  "status": true,
  "data": {
    "location": "Warehouse A",
    "status": "Delivered",
    "additionalInfo": "Signed by John Doe",
    "product": {
      "productName": "Product Name",
      "description": "Product Description",
      "deliveryAddress": "Delivery Address"
    }
  }
}

```

# Get Filtered Tracking Event API

This API endpoint is used to retrieve tracking event details based on the provided filter status. Only admins can perform this task.

## Endpoint

- **Method:** GET
- **URL:** `http://localhost:5000/get-filtered-tracking-event?filter={filter}`
- **Authorization:** JWT Token (Bearer token)

## Request Parameters

- `filter`: The status filter to apply (e.g., "Delivered", "In Transit").

## Response

- **Status Code:** 200 OK
- **Content-Type:** application/json

### Success Response

```json
{
  "status": true,
  "data": [
    {
      "location": "Warehouse A",
      "additionalInfo": "Signed by John Doe",
      "product": {
        "productName": "Product Name",
        "description": "Product Description",
        "deliveryAddress": "Delivery Address",
        "status": "Delivered"
      }
    },
    {
      "location": "Warehouse B",
      "additionalInfo": "Unable to deliver",
      "product": {
        "productName": "Product Name 2",
        "description": "Product Description 2",
        "deliveryAddress": "Delivery Address 2",
        "status": "Returned"
      }
    }
  ]
}

```
# Delete Tracking Event API

This API endpoint is used to delete a tracking event based on the provided tracking number. Only admins can perform this task.

## Endpoint

- **Method:** DELETE
- **URL:** `http://localhost:5000/delete-tracking-event`
- **Authorization:** JWT Token (Bearer token)

## Request Body

```json
{
  "trackingNumber": "ABC12345"
}
```

---
