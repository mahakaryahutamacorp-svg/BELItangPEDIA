-- ============================================
-- BELItangPEDIA - Additional RLS Policies for Sellers
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================

-- ============================================
-- 1. STORES TABLE POLICIES
-- ============================================

-- Sellers can insert their own store
CREATE POLICY "Users can create own store"
ON stores FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Sellers can update their own store
CREATE POLICY "Users can update own store"
ON stores FOR UPDATE
USING (auth.uid() = user_id);

-- Sellers can delete their own store (if needed)
CREATE POLICY "Users can delete own store"
ON stores FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 2. PRODUCTS TABLE POLICIES
-- ============================================

-- Drop existing policy if exists (to avoid conflicts)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Everyone can view active products
CREATE POLICY "Anyone can view active products"
ON products FOR SELECT
USING (is_active = true);

-- Sellers can view ALL their own products (including inactive)
CREATE POLICY "Sellers can view own products"
ON products FOR SELECT
USING (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- Sellers can insert products to their own store
CREATE POLICY "Sellers can create products"
ON products FOR INSERT
WITH CHECK (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
ON products FOR UPDATE
USING (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
ON products FOR DELETE
USING (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- ============================================
-- 3. ORDERS TABLE POLICIES
-- ============================================

-- Sellers can view orders for their store
CREATE POLICY "Sellers can view store orders"
ON orders FOR SELECT
USING (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- Sellers can update orders for their store (to change status)
CREATE POLICY "Sellers can update store orders"
ON orders FOR UPDATE
USING (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- ============================================
-- 4. ORDER ITEMS TABLE POLICIES
-- ============================================

-- Everyone can view order items (needed for order details)
CREATE POLICY "Order items viewable by order owner or seller"
ON order_items FOR SELECT
USING (
    order_id IN (
        SELECT id FROM orders 
        WHERE user_id = auth.uid() 
        OR store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
    )
);

-- ============================================
-- 5. USERS TABLE - Additional Policies
-- ============================================

-- Users can insert their own profile (for new signups)
DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to increment store product count
CREATE OR REPLACE FUNCTION increment_store_products(store_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE stores 
    SET total_products = total_products + 1 
    WHERE id = store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement store product count
CREATE OR REPLACE FUNCTION decrement_store_products(store_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE stores 
    SET total_products = GREATEST(total_products - 1, 0)
    WHERE id = store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. GRANT EXECUTE PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION increment_store_products(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_store_products(UUID) TO authenticated;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- RLS policies for sellers created successfully!
-- Sellers can now:
-- - Create and manage their own store
-- - Create, update, delete their own products
-- - View and update orders for their store
