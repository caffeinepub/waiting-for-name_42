# Online Shop with Payment Methods

## Current State

Fresh Caffeine project with:
- React + TypeScript frontend setup
- shadcn/ui components available
- Internet Identity authentication
- No backend or app logic yet

## Requested Changes (Diff)

### Add

**Backend:**
- Product catalog management (CRUD operations)
- Shopping cart functionality
- Order management system with multiple payment methods:
  - Cash on Delivery (default)
  - EasyPaisa
  - JazzCash
- Order status tracking (pending, confirmed, completed, cancelled)
- Admin panel for order management

**Frontend:**
- Product listing page with grid layout
- Product detail view
- Shopping cart page
- Checkout flow with payment method selection:
  - Cash on Delivery (selected by default)
  - EasyPaisa with instructions (number: 03281325899, request WhatsApp screenshot)
  - JazzCash with instructions (number: 03281325899, request WhatsApp screenshot)
- Order confirmation page showing:
  - Order details
  - Selected payment method with instructions
  - WhatsApp contact: 03281325899
- Admin dashboard for managing products and orders
- Mobile-optimized responsive design

### Modify

None (new app)

### Remove

None (new app)

## Implementation Plan

1. **Select components**: No special Caffeine components needed (using basic backend)

2. **Backend generation**:
   - Product management (create, read, update, delete products)
   - Shopping cart operations (add, remove, update quantities)
   - Order creation with payment method selection
   - Order retrieval and status updates
   - Admin functions for product and order management

3. **Frontend implementation**:
   - Home page with featured products
   - Product catalog with search/filter
   - Product detail pages
   - Shopping cart with item management
   - Checkout page with payment method selection (radio buttons):
     - "Cash on Delivery" (default checked)
     - "EasyPaisa" with payment instructions
     - "JazzCash" with payment instructions
   - Order confirmation page with WhatsApp contact
   - Admin panel for managing inventory and orders
   - Mobile-first responsive design

4. **Validation**: Typecheck, lint, and build

## UX Notes

- **Payment Methods Display**:
  - Radio button selection at checkout
  - Cash on Delivery selected by default
  - EasyPaisa and JazzCash show instructions when selected:
    - "Send payment to: 03281325899"
    - "Please send screenshot of payment to WhatsApp"
- **Order Confirmation**:
  - Clear summary of order items and total
  - Payment method selected and instructions
  - Prominent WhatsApp contact: 03281325899
- **Mobile Optimization**:
  - Touch-friendly buttons and controls
  - Readable text sizes
  - Easy-to-tap payment method selection
  - Simplified checkout flow
- **Admin Features**:
  - Simple product management (add/edit/delete)
  - Order status updates
  - View all orders with payment method info
