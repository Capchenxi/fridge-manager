-- ============================================
-- Supabase RLS Policies for Fridge Manager
-- 在 Supabase Dashboard → SQL Editor 中运行
-- ============================================

-- 1. households 表
-- 已登录用户可以创建家庭
CREATE POLICY "允许已登录用户创建家庭"
  ON households FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 用户只能看到自己所属的家庭
CREATE POLICY "用户可查看自己所属的家庭"
  ON households FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- 允许通过邀请码查找家庭（加入家庭时需要）
CREATE POLICY "允许通过邀请码查找家庭"
  ON households FOR SELECT
  TO authenticated
  USING (true);

-- 2. household_members 表
-- 已登录用户可以加入家庭
CREATE POLICY "允许已登录用户加入家庭"
  ON household_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 用户可以查看自己所属家庭的成员
CREATE POLICY "用户可查看自己的家庭成员关系"
  ON household_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 3. inventory_items 表
-- 用户可以查看自己家庭的库存
CREATE POLICY "用户可查看自己家庭的库存"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- 用户可以为自己的家庭添加库存
CREATE POLICY "用户可添加自己家庭的库存"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- 用户可以删除自己家庭的库存
CREATE POLICY "用户可删除自己家庭的库存"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- 4. shopping_items 表
-- 用户可以查看自己家庭的待买清单
CREATE POLICY "用户可查看自己家庭的待买清单"
  ON shopping_items FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- 用户可以为自己的家庭添加待买项
CREATE POLICY "用户可添加自己家庭的待买项"
  ON shopping_items FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- 用户可以删除自己家庭的待买项
CREATE POLICY "用户可删除自己家庭的待买项"
  ON shopping_items FOR DELETE
  TO authenticated
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );
