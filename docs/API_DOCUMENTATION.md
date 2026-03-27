# ProxyPay REST API Documentation

## Authentication

- **Store Controller**: Requires Bearer token authentication (JWT) via `Authorization: Bearer <token>` header. Also requires `X-Tenant-Id` header.
- **Payment Controller**: Public endpoints. No authentication required. Requires `X-Tenant-Id` header. Uses `clientId` in the request body to identify the store.
- **Webhook Controller**: Public endpoint. Validates requests via `secret` query parameter.
- **GraphQL**: Requires Bearer token authentication. Endpoint: `POST /graphql`

---

## Objects

### CustomerInsertInfo

Customer data for creating or identifying a customer.

```json
{
  "name": "John Doe",
  "documentId": "89639766100",
  "cellphone": "11999999999",
  "email": "john@example.com"
}
```

| Property | Type | Description |
|----------|------|-------------|
| name | string | Customer full name |
| documentId | string | Customer CPF (11 digits, no formatting) |
| cellphone | string | Customer phone number |
| email | string | Customer email address |

### InvoiceItemRequest

Item included in an invoice or QR code payment.

```json
{
  "id": "PROD-001",
  "description": "Monthly subscription",
  "quantity": 1,
  "unitPrice": 99.90,
  "discount": 0
}
```

| Property | Type | Description |
|----------|------|-------------|
| id | string | External product identifier (required) |
| description | string | Item description |
| quantity | int | Quantity (must be > 0) |
| unitPrice | double | Unit price in BRL |
| discount | double | Discount amount (>= 0) |

### BillingItemInfo

Item included in a recurring billing.

```json
{
  "billingItemId": 0,
  "billingId": 0,
  "description": "Monthly subscription",
  "quantity": 1,
  "unitPrice": 99.90,
  "discount": 0
}
```

| Property | Type | Description |
|----------|------|-------------|
| billingItemId | long | Item ID (0 for new items) |
| billingId | long | Parent billing ID (0 for new items) |
| description | string | Item description |
| quantity | int | Quantity |
| unitPrice | double | Unit price in BRL |
| discount | double | Discount amount |

### BillingRequest

Request body for creating a recurring billing with card payment.

```json
{
  "clientId": "50169143aa0e46b593dcf43adec0464e",
  "frequency": 1,
  "paymentMethod": 3,
  "billingStartDate": "2026-04-01T00:00:00",
  "completionUrl": "https://example.com/success",
  "returnUrl": "https://example.com/return",
  "customer": {
    "name": "John Doe",
    "documentId": "89639766100",
    "cellphone": "11999999999",
    "email": "john@example.com"
  },
  "items": [
    {
      "billingItemId": 0,
      "billingId": 0,
      "description": "Monthly subscription",
      "quantity": 1,
      "unitPrice": 99.90,
      "discount": 0
    }
  ]
}
```

| Property | Type | Description |
|----------|------|-------------|
| clientId | string | Store client ID (32-char hex) |
| frequency | BillingFrequencyEnum | Billing frequency |
| paymentMethod | PaymentMethodEnum | Payment method |
| billingStartDate | datetime | First billing date |
| completionUrl | string | URL to redirect after payment |
| returnUrl | string | URL to redirect on cancel/back |
| customer | CustomerInsertInfo | Customer data |
| items | BillingItemInfo[] | List of billing items |

### BillingResponse

Response returned after creating a billing.

```json
{
  "billingId": 1,
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "url": "https://app.abacatepay.com/pay/bill_TuKCsUpYDJYyZQKMr0CdGcX0"
}
```

| Property | Type | Description |
|----------|------|-------------|
| billingId | long | Created billing ID |
| invoiceId | long | Created invoice ID |
| invoiceNumber | string | Generated invoice number |
| url | string | AbacatePay payment page URL |

### InvoiceRequest

Request body for creating a one-time card payment invoice.

```json
{
  "clientId": "50169143aa0e46b593dcf43adec0464e",
  "customer": {
    "name": "John Doe",
    "documentId": "89639766100",
    "cellphone": "11999999999",
    "email": "john@example.com"
  },
  "paymentMethod": 3,
  "completionUrl": "https://example.com/success",
  "returnUrl": "https://example.com/return",
  "notes": "Invoice for consulting services",
  "discount": 0,
  "dueDate": "2026-04-30T00:00:00",
  "items": [
    {
      "id": "PROD-001",
      "description": "Consulting - 10 hours",
      "quantity": 10,
      "unitPrice": 150.00,
      "discount": 0
    }
  ]
}
```

| Property | Type | Description |
|----------|------|-------------|
| clientId | string | Store client ID |
| customer | CustomerInsertInfo | Customer data |
| paymentMethod | PaymentMethodEnum | Payment method |
| completionUrl | string | URL to redirect after payment |
| returnUrl | string | URL to redirect on cancel/back |
| notes | string | Optional invoice notes |
| discount | double | Invoice-level discount |
| dueDate | datetime | Payment due date |
| items | InvoiceItemRequest[] | List of invoice items |

### InvoiceResponse

Response returned after creating an invoice.

```json
{
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "url": "https://app.abacatepay.com/pay/bill_abc123"
}
```

| Property | Type | Description |
|----------|------|-------------|
| invoiceId | long | Created invoice ID |
| invoiceNumber | string | Generated invoice number |
| url | string | AbacatePay payment page URL |

### QRCodeRequest

Request body for creating a PIX QR code payment.

```json
{
  "clientId": "50169143aa0e46b593dcf43adec0464e",
  "customer": {
    "name": "John Doe",
    "documentId": "89639766100",
    "cellphone": "11999999999",
    "email": "john@example.com"
  },
  "items": [
    {
      "id": "PROD-001",
      "description": "Product A",
      "quantity": 1,
      "unitPrice": 100.00,
      "discount": 0
    }
  ]
}
```

| Property | Type | Description |
|----------|------|-------------|
| clientId | string | Store client ID |
| customer | CustomerInsertInfo | Customer data (CPF required and validated) |
| items | InvoiceItemRequest[] | List of items to charge |

### QRCodeResponse

Response returned after creating a PIX QR code.

```json
{
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "brCode": "00020101021126580014BR.GOV.BCB.PIX0136devmode-pix-abc1235204000053039865406100.005802BR5920AbacatePay DevMode6009Sao Paulo62070503***6304B14F",
  "brCodeBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "expiredAt": "2026-03-27T12:00:00Z"
}
```

| Property | Type | Description |
|----------|------|-------------|
| invoiceId | long | Created invoice ID |
| invoiceNumber | string | Generated invoice number |
| brCode | string | PIX copy-paste code |
| brCodeBase64 | string | QR code image as base64 PNG |
| expiredAt | datetime? | QR code expiration date |

### QRCodeStatusResponse

Response returned when checking QR code payment status.

```json
{
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "paid": true,
  "status": 3,
  "statusText": "Paid",
  "expiresAt": "2026-03-27T12:00:00Z"
}
```

| Property | Type | Description |
|----------|------|-------------|
| invoiceId | long | Invoice ID |
| invoiceNumber | string | Invoice number |
| paid | bool | True if payment was received |
| status | InvoiceStatusEnum | Current invoice status |
| statusText | string | Status as text (e.g. "Paid", "Pending") |
| expiresAt | datetime? | QR code expiration date |

### StoreInsertInfo

Request body for creating a store.

```json
{
  "name": "Proxy Pay Demo",
  "email": "store@example.com",
  "billingStrategy": 1
}
```

| Property | Type | Description |
|----------|------|-------------|
| name | string | Store name |
| email | string | Store email |
| billingStrategy | BillingStrategyEnum | Billing strategy |

### StoreUpdateInfo

Request body for updating a store.

```json
{
  "storeId": 1,
  "name": "Proxy Pay Demo Updated",
  "email": "store@example.com",
  "billingStrategy": 1
}
```

| Property | Type | Description |
|----------|------|-------------|
| storeId | long | Store ID to update |
| name | string | Store name |
| email | string | Store email |
| billingStrategy | BillingStrategyEnum | Billing strategy |

### AbacatePayWebhookPayload

Webhook payload sent by AbacatePay.

```json
{
  "event": "billing.paid",
  "devMode": false,
  "data": {
    "id": "bill_TuKCsUpYDJYyZQKMr0CdGcX0",
    "amount": 10000,
    "status": "PAID",
    "url": "https://app.abacatepay.com/pay/bill_TuKCsUpYDJYyZQKMr0CdGcX0",
    "createdAt": "2026-03-26T18:48:11.442Z",
    "updatedAt": "2026-03-26T19:00:00.000Z"
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| event | string | Event type: `billing.created`, `billing.paid`, `billing.refunded`, `billing.failed` |
| devMode | bool | True if from test environment |
| data | AbacatePayWebhookData | Event resource data |
| data.id | string | AbacatePay resource ID |
| data.amount | int | Amount in cents |
| data.status | string | Payment status |
| data.updatedAt | string | ISO 8601 date of last update |

### Enums

#### PaymentMethodEnum

```json
{
  "1": "Pix",
  "2": "Boleto",
  "3": "CreditCard",
  "4": "DebitCard"
}
```

#### BillingFrequencyEnum

```json
{
  "1": "Monthly",
  "2": "Quarterly",
  "3": "Semiannual",
  "4": "Annual"
}
```

#### BillingStrategyEnum

```json
{
  "1": "Immediate",
  "2": "FirstDayOfMonth"
}
```

#### InvoiceStatusEnum

```json
{
  "1": "Pending",
  "2": "Sent",
  "3": "Paid",
  "4": "Overdue",
  "5": "Cancelled",
  "6": "Expired"
}
```

---

## Endpoints

### 1. Create Billing (Recurring Card Payment)

Creates a recurring billing via AbacatePay with card payment and generates an invoice.

**Endpoint:** `POST /payment/billing`

**Authentication:** Not Required

**Request Headers:**
- `X-Tenant-Id` (string, required) - Tenant identifier
- `Content-Type: application/json`

**Request Body:** BillingRequest

**Request Example:**
```http
POST /payment/billing
X-Tenant-Id: emagine
Content-Type: application/json

{
  "clientId": "50169143aa0e46b593dcf43adec0464e",
  "frequency": 1,
  "paymentMethod": 3,
  "billingStartDate": "2026-04-01T00:00:00",
  "completionUrl": "https://example.com/success",
  "returnUrl": "https://example.com/return",
  "customer": {
    "name": "John Doe",
    "documentId": "89639766100",
    "cellphone": "11999999999",
    "email": "john@example.com"
  },
  "items": [
    {
      "description": "Monthly subscription",
      "quantity": 1,
      "unitPrice": 99.90,
      "discount": 0
    }
  ]
}
```

**Response Success (200):**
```json
{
  "billingId": 1,
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "url": "https://app.abacatepay.com/pay/bill_TuKCsUpYDJYyZQKMr0CdGcX0"
}
```

**Response Error (400):**
```json
"Customer is required"
```

---

### 2. Create Invoice (One-Time Card Payment)

Creates a one-time invoice via AbacatePay with card payment.

**Endpoint:** `POST /payment/invoice`

**Authentication:** Not Required

**Request Headers:**
- `X-Tenant-Id` (string, required) - Tenant identifier
- `Content-Type: application/json`

**Request Body:** InvoiceRequest

**Request Example:**
```http
POST /payment/invoice
X-Tenant-Id: emagine
Content-Type: application/json

{
  "clientId": "50169143aa0e46b593dcf43adec0464e",
  "customer": {
    "name": "John Doe",
    "documentId": "89639766100",
    "cellphone": "11999999999",
    "email": "john@example.com"
  },
  "paymentMethod": 3,
  "completionUrl": "https://example.com/success",
  "returnUrl": "https://example.com/return",
  "notes": "Invoice for consulting services",
  "discount": 0,
  "dueDate": "2026-04-30T00:00:00",
  "items": [
    {
      "id": "PROD-001",
      "description": "Consulting - 10 hours",
      "quantity": 10,
      "unitPrice": 150.00,
      "discount": 0
    }
  ]
}
```

**Response Success (200):**
```json
{
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "url": "https://app.abacatepay.com/pay/bill_abc123"
}
```

**Response Error (400):**
```json
"Customer email is required"
```

---

### 3. Create QR Code (PIX Payment)

Creates a PIX QR code for instant payment via AbacatePay.

**Endpoint:** `POST /payment/qrcode`

**Authentication:** Not Required

**Request Headers:**
- `X-Tenant-Id` (string, required) - Tenant identifier
- `Content-Type: application/json`

**Request Body:** QRCodeRequest

**Request Example:**
```http
POST /payment/qrcode
X-Tenant-Id: emagine
Content-Type: application/json

{
  "clientId": "50169143aa0e46b593dcf43adec0464e",
  "customer": {
    "name": "John Doe",
    "documentId": "89639766100",
    "cellphone": "11999999999",
    "email": "john@example.com"
  },
  "items": [
    {
      "id": "PROD-001",
      "description": "Product A",
      "quantity": 1,
      "unitPrice": 100.00,
      "discount": 0
    }
  ]
}
```

**Response Success (200):**
```json
{
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "brCode": "00020101021126580014BR.GOV.BCB.PIX0136devmode-pix-abc123...",
  "brCodeBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "expiredAt": "2026-03-27T12:00:00Z"
}
```

**Response Error (400):**
```json
{
  "errors": [
    "Customer CPF (documentId) is invalid",
    "Invoice must have at least one item"
  ]
}
```

---

### 4. Check QR Code Status

Checks the payment status of a PIX QR code by querying AbacatePay.

**Endpoint:** `GET /payment/qrcode/status/{invoiceId}`

**Authentication:** Not Required

**Request Headers:**
- `X-Tenant-Id` (string, required) - Tenant identifier

**Path Parameters:**
- `invoiceId` (long, required) - Invoice ID returned from Create QR Code

**Request Example:**
```http
GET /payment/qrcode/status/5
X-Tenant-Id: emagine
```

**Response Success (200):**
```json
{
  "invoiceId": 5,
  "invoiceNumber": "INV-0001-000005",
  "paid": true,
  "status": 3,
  "statusText": "Paid",
  "expiresAt": "2026-03-27T12:00:00Z"
}
```

**Response Error (400):**
```json
"Invoice not found"
```

---

### 5. Create Store

Creates a new store for the authenticated user. Each user can only have one store.

**Endpoint:** `POST /store`

**Authentication:** Required (Bearer Token)

**Request Headers:**
- `Authorization: Bearer <token>` (required)
- `X-Tenant-Id` (string, required) - Tenant identifier
- `Content-Type: application/json`

**Request Body:** StoreInsertInfo

**Request Example:**
```http
POST /store
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Tenant-Id: emagine
Content-Type: application/json

{
  "name": "Proxy Pay Demo",
  "email": "store@example.com",
  "billingStrategy": 1
}
```

**Response Success (201):**
```json
{
  "storeId": 1,
  "clientId": "50169143aa0e46b593dcf43adec0464e"
}
```

**Response Error (400):**
```json
"User already has a store"
```

**Response Error (401):**
Unauthorized

---

### 6. Update Store

Updates an existing store. Only the store owner can update.

**Endpoint:** `PUT /store`

**Authentication:** Required (Bearer Token)

**Request Headers:**
- `Authorization: Bearer <token>` (required)
- `X-Tenant-Id` (string, required) - Tenant identifier
- `Content-Type: application/json`

**Request Body:** StoreUpdateInfo

**Request Example:**
```http
PUT /store
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Tenant-Id: emagine
Content-Type: application/json

{
  "storeId": 1,
  "name": "Proxy Pay Demo Updated",
  "email": "store@example.com",
  "billingStrategy": 1
}
```

**Response Success (204):** No Content

**Response Error (400):**
```json
"Store not found"
```

**Response Error (401):** Unauthorized

**Response Error (403):** Forbidden (not store owner)

---

### 7. Delete Store

Deletes a store. Only the store owner can delete.

**Endpoint:** `DELETE /store/{storeId}`

**Authentication:** Required (Bearer Token)

**Request Headers:**
- `Authorization: Bearer <token>` (required)
- `X-Tenant-Id` (string, required) - Tenant identifier

**Path Parameters:**
- `storeId` (long, required) - Store ID to delete

**Request Example:**
```http
DELETE /store/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Tenant-Id: emagine
```

**Response Success (204):** No Content

**Response Error (400):**
```json
"Store not found"
```

**Response Error (401):** Unauthorized

**Response Error (403):** Forbidden (not store owner)

---

### 8. AbacatePay Webhook

Receives payment event notifications from AbacatePay. Always returns 200 OK.

**Endpoint:** `POST /webhook/abacatepay`

**Authentication:** Secret via query parameter

**Query Parameters:**
- `secret` (string, required) - Webhook secret for validation

**Request Body:** AbacatePayWebhookPayload

**Request Example:**
```http
POST /webhook/abacatepay?secret=your-webhook-secret
Content-Type: application/json

{
  "event": "billing.paid",
  "devMode": false,
  "data": {
    "id": "bill_TuKCsUpYDJYyZQKMr0CdGcX0",
    "amount": 10000,
    "status": "PAID",
    "updatedAt": "2026-03-26T19:00:00.000Z"
  }
}
```

**Response (200):** Always returns 200 OK regardless of processing result.

**Supported Events:**
- `billing.paid` - Marks the invoice as Paid
- `billing.refunded` - Marks the invoice as Cancelled
- `billing.failed` - Marks the invoice as Expired
- `billing.created` - Logged, no action taken

---

### 9. GraphQL (Authenticated Queries)

Single GraphQL endpoint for all read operations. Requires authentication.

**Endpoint:** `POST /graphql`

**Authentication:** Required (Bearer Token)

**Request Headers:**
- `Authorization: Bearer <token>` (required)
- `X-Tenant-Id` (string, required) - Tenant identifier
- `Content-Type: application/json`

**Available Queries:**
- `myStore` - Returns the authenticated user's store
- `myInvoices(skip, take)` - Paginated list of invoices
- `myInvoiceByNumber(invoiceNumber)` - Find invoice by number
- `myTransactions(skip, take)` - Paginated list of transactions
- `myBalance` - Balance summary (balance, totalCredits, totalDebits, transactionCount)
- `myCustomers(skip, take)` - Paginated list of customers
- `myBillings(skip, take)` - Paginated list of billings

**Request Example:**
```http
POST /graphql
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Tenant-Id: emagine
Content-Type: application/json

{
  "query": "{ myStore { storeId clientId name email billingStrategy createdAt updatedAt } }"
}
```

**Response Success (200):**
```json
{
  "data": {
    "myStore": [
      {
        "storeId": 1,
        "clientId": "50169143aa0e46b593dcf43adec0464e",
        "name": "Proxy Pay Demo",
        "email": "store@example.com",
        "billingStrategy": 1,
        "createdAt": "2026-03-26T12:00:00",
        "updatedAt": "2026-03-26T12:00:00"
      }
    ]
  }
}
```

**Response Error (401):**
```json
{
  "errors": [
    {
      "message": "The current user is not authorized to access this resource."
    }
  ]
}
```
