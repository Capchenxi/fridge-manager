import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Home,
  PlusCircle,
  ShoppingCart,
  Settings,
  Mic,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Baby,
  Refrigerator,
  ScanLine,
  Undo2,
} from 'lucide-react';

const SUPABASE_URL = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : '';
const SUPABASE_ANON_KEY = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : '';

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const demoHousehold = {
  id: 'demo-household-1',
  name: 'XX 的家',
  inviteCode: 'FRIDGE-DEMO',
};

const INVITE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateInviteCode(length = 8) {
  return Array.from({ length }, () => INVITE_ALPHABET[Math.floor(Math.random() * INVITE_ALPHABET.length)]).join('');
}

function generateHouseholdName(user) {
  const fallback = user?.email?.split('@')[0] || '新成员';
  return `${fallback} 的家`;
}

const emojiMap = {
  生抽: '🫙',
  老抽: '🫙',
  蚝油: '🫙',
  醋: '🧴',
  盐: '🧂',
  糖: '🍬',
  半个西瓜: '🍉',
  冷鲜排骨: '🥩',
  三文鱼泥: '🐟',
  胡萝卜块: '🥕',
  鸡蛋: '🥚',
  番茄: '🍅',
  牛奶: '🥛',
  西兰花: '🥦',
  牛肉: '🥩',
  洋葱: '🧅',
  虾仁: '🍤',
};

const initialInventory = [
  {
    id: 101,
    name: '生抽',
    category: '调料',
    zone: '调料区',
    daysLeft: 60,
    amount: '剩 1/3 瓶',
    forBaby: false,
    note: '快见底，适合提醒补货',
    isSeasoning: true,
    lowStock: true,
  },
  {
    id: 102,
    name: '老抽',
    category: '调料',
    zone: '调料区',
    daysLeft: 90,
    amount: '剩 1/2 瓶',
    forBaby: false,
    note: '常用上色调料',
    isSeasoning: true,
    lowStock: false,
  },
  {
    id: 103,
    name: '蚝油',
    category: '调料',
    zone: '调料区',
    daysLeft: 45,
    amount: '剩 1/4 瓶',
    forBaby: false,
    note: '快吃完了',
    isSeasoning: true,
    lowStock: true,
  },
  {
    id: 104,
    name: '醋',
    category: '调料',
    zone: '调料区',
    daysLeft: 120,
    amount: '剩 2/3 瓶',
    forBaby: false,
    note: '库存正常',
    isSeasoning: true,
    lowStock: false,
  },
  {
    id: 105,
    name: '盐',
    category: '调料',
    zone: '调料区',
    daysLeft: 180,
    amount: '剩半袋',
    forBaby: false,
    note: '基础调料',
    isSeasoning: true,
    lowStock: false,
  },
  {
    id: 106,
    name: '糖',
    category: '调料',
    zone: '调料区',
    daysLeft: 180,
    amount: '剩 1/3 袋',
    forBaby: false,
    note: '可以提前补货',
    isSeasoning: true,
    lowStock: true,
  },
  {
    id: 1,
    name: '半个西瓜',
    category: '水果',
    zone: '冷藏',
    daysLeft: 1,
    amount: '半个',
    forBaby: false,
    note: '切开未包保鲜膜',
    isSeasoning: false,
    lowStock: false,
  },
  {
    id: 2,
    name: '冷鲜排骨',
    category: '肉类',
    zone: '冷藏',
    daysLeft: 2,
    amount: '500g',
    forBaby: false,
    note: '建议今晚处理',
    isSeasoning: false,
    lowStock: false,
  },
  {
    id: 3,
    name: '三文鱼泥',
    category: '宝宝辅食',
    zone: '冷冻',
    daysLeft: 4,
    amount: '2盒',
    forBaby: true,
    note: '宝宝专区',
    isSeasoning: false,
    lowStock: false,
  },
  {
    id: 4,
    name: '胡萝卜块',
    category: '宝宝辅食',
    zone: '冷冻',
    daysLeft: 2,
    amount: '1包',
    forBaby: true,
    note: '建议明日吃完',
    isSeasoning: false,
    lowStock: false,
  },
  {
    id: 5,
    name: '鸡蛋',
    category: '蛋类',
    zone: '冷藏',
    daysLeft: 10,
    amount: '8个',
    forBaby: false,
    note: '库存偏低时提醒补货',
    isSeasoning: false,
    lowStock: false,
  },
];

const initialShopping = [
  { id: 's-seasoning-1', name: '生抽', qty: '1瓶' },
  { id: 's-seasoning-2', name: '蚝油', qty: '1瓶' },
  { id: 's1', name: '鸡蛋', qty: '1盒' },
  { id: 's2', name: '牛奶', qty: '1盒' },
  { id: 's3', name: '西兰花', qty: '1颗' },
];

const quickAddDefaults = {
  生抽: { category: '调料', zone: '调料区', daysLeft: 90, amount: '1瓶', forBaby: false, isSeasoning: true, lowStock: false },
  老抽: { category: '调料', zone: '调料区', daysLeft: 120, amount: '1瓶', forBaby: false, isSeasoning: true, lowStock: false },
  蚝油: { category: '调料', zone: '调料区', daysLeft: 90, amount: '1瓶', forBaby: false, isSeasoning: true, lowStock: false },
  醋: { category: '调料', zone: '调料区', daysLeft: 180, amount: '1瓶', forBaby: false, isSeasoning: true, lowStock: false },
  盐: { category: '调料', zone: '调料区', daysLeft: 365, amount: '1袋', forBaby: false, isSeasoning: true, lowStock: false },
  糖: { category: '调料', zone: '调料区', daysLeft: 365, amount: '1袋', forBaby: false, isSeasoning: true, lowStock: false },
  鸡蛋: { category: '蛋类', zone: '冷藏', daysLeft: 10, amount: '1盒', forBaby: false, isSeasoning: false, lowStock: false },
  番茄: { category: '蔬菜', zone: '冷藏', daysLeft: 5, amount: '2个', forBaby: false, isSeasoning: false, lowStock: false },
  排骨: { category: '肉类', zone: '冷藏', daysLeft: 3, amount: '500g', forBaby: false, isSeasoning: false, lowStock: false },
  牛奶: { category: '乳制品', zone: '冷藏', daysLeft: 5, amount: '1盒', forBaby: false, isSeasoning: false, lowStock: false },
  西兰花: { category: '蔬菜', zone: '冷藏', daysLeft: 4, amount: '1颗', forBaby: false, isSeasoning: false, lowStock: false },
};

const mealDishRules = [
  { dish: '番茄炒蛋', ingredients: ['番茄', '鸡蛋'] },
  { dish: '排骨汤', ingredients: ['排骨'] },
  { dish: '牛肉炒洋葱', ingredients: ['牛肉', '洋葱'] },
  { dish: '西兰花炒虾仁', ingredients: ['西兰花', '虾仁'] },
  { dish: '三文鱼饭', ingredients: ['三文鱼'] },
];

const cookingKeywordRules = [
  { keyword: '排骨', inventoryName: '冷鲜排骨' },
  { keyword: '鸡蛋', inventoryName: '鸡蛋' },
  { keyword: '西瓜', inventoryName: '半个西瓜' },
  { keyword: '三文鱼', inventoryName: '三文鱼泥' },
  { keyword: '胡萝卜', inventoryName: '胡萝卜块' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function splitInputTokens(text) {
  return text
    .split(/[，,、\n\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function analyzeMealPlan(text, inventory) {
  const cleaned = text.trim();
  if (!cleaned) return { dishes: [], matchedInventory: [], needToBuy: [] };

  const dishes = cleaned
    .split(/[，,、\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const requiredIngredients = Array.from(
    new Set(
      dishes.flatMap((dish) => {
        const rule = mealDishRules.find((entry) => dish.includes(entry.dish) || entry.dish.includes(dish));
        return rule ? rule.ingredients : [dish];
      })
    )
  );

  const matchedInventory = [];
  const needToBuy = [];

  requiredIngredients.forEach((ingredient) => {
    const matched = inventory.find((item) => item.name.includes(ingredient) || ingredient.includes(item.name));
    if (matched) {
      matchedInventory.push({ ingredient, item: matched.name, amount: matched.amount });
    } else {
      needToBuy.push(ingredient);
    }
  });

  return { dishes, matchedInventory, needToBuy };
}

function getInventoryLevel(item) {
  if (item.isSeasoning) return item.lowStock ? 'red' : 'green';
  if (item.daysLeft <= 2) return 'red';
  if (item.daysLeft <= 4) return 'yellow';
  return 'green';
}

function getInventoryProgress(item) {
  if (item.isSeasoning) {
    if (item.amount?.includes('1/4') || item.amount?.includes('1/3') || item.amount?.includes('半袋')) return 25;
    if (item.amount?.includes('1/2')) return 50;
    if (item.amount?.includes('2/3')) return 70;
    return item.lowStock ? 15 : 85;
  }
  if (item.daysLeft <= 1) return 10;
  if (item.daysLeft <= 2) return 30;
  if (item.daysLeft <= 4) return 55;
  if (item.daysLeft <= 7) return 75;
  return 90;
}

function getShoppingSecondaryText(entry) {
  const preset = quickAddDefaults[entry.name];
  if (!preset) return '';
  return preset.isSeasoning ? entry.qty : preset.category;
}

function normalizeInventoryRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    zone: row.zone,
    daysLeft: row.days_left,
    amount: row.amount,
    forBaby: row.for_baby,
    note: row.note || '',
    isSeasoning: row.is_seasoning,
    lowStock: row.low_stock,
  };
}

function runSelfChecks() {
  const checks = [];
  checks.push({
    name: 'Supabase 数据行可映射为前端库存对象',
    passed:
      normalizeInventoryRow({
        id: '1',
        name: '鸡蛋',
        category: '蛋类',
        zone: '冷藏',
        days_left: 10,
        amount: '1盒',
        for_baby: false,
        note: '',
        is_seasoning: false,
        low_stock: false,
      }).daysLeft === 10,
  });
  checks.push({
    name: '预设调料存在且分类正确',
    passed: quickAddDefaults['生抽']?.category === '调料',
  });
  const tokens = splitInputTokens('排骨 番茄，鸡蛋\n牛奶');
  checks.push({
    name: 'splitInputTokens 支持空格/逗号/换行',
    passed: tokens.join('|') === '排骨|番茄|鸡蛋|牛奶',
  });
  const plan = analyzeMealPlan('番茄炒蛋，排骨汤', initialInventory);
  checks.push({
    name: 'analyzeMealPlan 可识别菜名并匹配库存',
    passed:
      plan.matchedInventory.some((entry) => entry.ingredient === '鸡蛋') &&
      plan.matchedInventory.some((entry) => entry.ingredient === '排骨') &&
      plan.needToBuy.includes('番茄'),
  });
  checks.push({
    name: '待买清单非调料显示类别而不是量词',
    passed: getShoppingSecondaryText({ name: '鸡蛋', qty: '1盒' }) === '蛋类',
  });
  return checks;
}

function MobileShell({ children, title, right, householdName }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500">{householdName || 'XX 的家'}</div>
        </div>
        <div>{right}</div>
      </div>
      <div className="min-h-[680px] bg-slate-50">{children}</div>
    </div>
  );
}

function Section({ title, icon, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          {icon}
          <span>{title}</span>
        </div>
        {action ? <button className="text-xs text-slate-500 hover:text-slate-700">{action}</button> : null}
      </div>
      {children}
    </div>
  );
}

function InventoryCard({ item, onOpen }) {
  const level = getInventoryLevel(item);
  const progress = getInventoryProgress(item);
  const emoji = emojiMap[item.name] || '📦';
  const ringClass = level === 'red' ? 'text-red-500' : level === 'yellow' ? 'text-amber-500' : 'text-emerald-500';
  const textClass = level === 'red' ? 'text-red-600' : level === 'yellow' ? 'text-amber-600' : 'text-emerald-600';

  return (
    <button
      onClick={() => onOpen(item)}
      className="flex min-h-[120px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative mb-2 h-16 w-16">
        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
          <path d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 1 1 0-31" fill="none" stroke="currentColor" strokeWidth="2.8" className="text-slate-200" strokeLinecap="round" />
          <path d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 1 1 0-31" fill="none" stroke="currentColor" strokeWidth="2.8" className={ringClass} strokeDasharray={`${progress} 100`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">{emoji}</div>
      </div>
      <div className="text-sm font-semibold text-slate-800">{item.name}</div>
      <div className={`mt-1 text-xs font-medium ${textClass}`}>{item.isSeasoning ? item.amount : `剩 ${item.daysLeft} 天`}</div>
      <div className="mt-1 text-[10px] text-slate-500">{item.zone}</div>
    </button>
  );
}

function ShoppingCard({ entry, checked, onCheck }) {
  const emoji = emojiMap[entry.name] || '🛒';
  const secondaryText = getShoppingSecondaryText(entry);
  return (
    <button
      onClick={() => onCheck(entry)}
      className={classNames(
        'relative flex min-h-[110px] flex-col items-center justify-center rounded-3xl border p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
        checked ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'
      )}
    >
      <div className="mb-2 text-3xl">{emoji}</div>
      <div className="text-sm font-semibold text-slate-800">{entry.name}</div>
      <div className="mt-1 text-xs text-slate-500">{secondaryText}</div>
      <div className="mt-1 text-[10px] text-slate-400">点一下加入库存</div>
      {checked ? (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      ) : null}
    </button>
  );
}

function ActionSheet({ item, onClose, onEat, onDiscard, onCook }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-slate-900">{item.name}</div>
            <div className="mt-1 text-sm text-slate-500">{item.zone} · {item.amount} · {item.isSeasoning ? '调料库存' : `剩 ${item.daysLeft} 天`}</div>
            <div className="mt-1 text-xs text-slate-500">备注：{item.note || '无'}</div>
          </div>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-sm text-slate-500 hover:bg-slate-100">关闭</button>
        </div>
        <div className="grid gap-2">
          <button onClick={() => onEat(item)} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white">我吃了</button>
          <button onClick={() => onCook(item)} className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-medium text-white">今日做掉</button>
          <button onClick={() => onDiscard(item)} className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-medium text-white">已坏扔掉</button>
        </div>
      </div>
    </div>
  );
}

function AuthPanel({ email, setEmail, onSendMagicLink, onUseDemo, loading, authMode, setAuthMode }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="text-2xl font-bold text-slate-900">家庭共享登录</div>
      <div className="mt-2 text-sm text-slate-500">用邮箱登录后进入同一个家庭空间，库存、待买和带饭计划都会同步。</div>
      <div className="mt-5 flex gap-2 rounded-2xl bg-slate-100 p-1 text-sm">
        {[
          ['magic', '邮箱登录'],
          ['demo', '先看演示'],
        ].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setAuthMode(mode)}
            className={classNames('flex-1 rounded-xl px-3 py-2', authMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}
          >
            {label}
          </button>
        ))}
      </div>
      {authMode === 'magic' ? (
        <div className="mt-5 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="输入家庭成员邮箱" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" />
          <button onClick={onSendMagicLink} disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50">{loading ? '发送中…' : '发送登录链接'}</button>
          <div className="text-xs text-slate-500">适合你、老人和其他家庭成员共享同一个冰箱空间。</div>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">演示模式会直接进入示例家庭，不需要配置 Supabase，也方便先看交互。</div>
          <button onClick={onUseDemo} className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white">进入演示家庭</button>
        </div>
      )}
    </div>
  );
}

function HouseholdJoinPanel({
  email,
  household,
  inviteCodeInput,
  setInviteCodeInput,
  onJoinHousehold,
  joinLoading,
  onLogout,
}) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="text-xl font-bold text-slate-900">家庭空间</div>
      <div className="mt-2 text-sm text-slate-500">
        当前账号：{email || '未识别邮箱'}
      </div>
      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-sm font-semibold text-emerald-800">当前家庭</div>
        <div className="mt-1 text-sm text-emerald-700">{household?.name || '未加入家庭'}</div>
        <div className="mt-1 text-xs text-emerald-700">邀请码：{household?.inviteCode || '未生成'}</div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="text-sm font-semibold text-slate-800">输入邀请码加入/切换家庭</div>
        <input
          value={inviteCodeInput}
          onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
          placeholder="例如：ABCD1234"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none"
        />
        <button
          onClick={onJoinHousehold}
          disabled={joinLoading}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {joinLoading ? '加入中…' : '加入该家庭'}
        </button>
      </div>
      <button onClick={onLogout} className="mt-4 text-xs text-slate-500 underline">退出登录</button>
    </div>
  );
}

export default function FridgeManagerPrototype() {
  const [tab, setTab] = useState('home');
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authMode, setAuthMode] = useState('magic');
  const [authLoading, setAuthLoading] = useState(false);
  const [household, setHousehold] = useState(null);
  const [inventory, setInventory] = useState(initialInventory);
  const [shoppingList, setShoppingList] = useState(initialShopping);
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState('');
  const [draftInput, setDraftInput] = useState('');
  const [parsedItems, setParsedItems] = useState([]);
  const [cookingLogInput, setCookingLogInput] = useState('');
  const [mealPlanInput, setMealPlanInput] = useState('');
  const [checkedShoppingIds, setCheckedShoppingIds] = useState([]);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(supabase));

  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  const urgentItems = useMemo(() => inventory.filter((item) => item.daysLeft <= 2 && !item.forBaby && !item.isSeasoning), [inventory]);
  const babyItems = useMemo(() => inventory.filter((item) => item.forBaby), [inventory]);
  const seasoningItems = useMemo(() => inventory.filter((item) => item.isSeasoning), [inventory]);
  const lowSeasoningItems = useMemo(() => inventory.filter((item) => item.isSeasoning && item.lowStock), [inventory]);
  const mealPlanAnalysis = useMemo(() => analyzeMealPlan(mealPlanInput, inventory), [mealPlanInput, inventory]);
  const riskSummary = useMemo(() => {
    const urgent = inventory.filter((item) => item.daysLeft <= 2 && !item.isSeasoning).length;
    const stale = inventory.filter((item) => item.daysLeft <= 5 && item.daysLeft > 2 && !item.isSeasoning).length;
    return { urgent, stale };
  }, [inventory]);
  const selfChecks = useMemo(() => runSelfChecks(), []);

  const showToast = (message) => {
    setToast(message);
    if (typeof window !== 'undefined') {
      window.clearTimeout(showToast.timer);
      showToast.timer = window.setTimeout(() => setToast(''), 2200);
    }
  };

  const hydrateHouseholdData = async (householdId) => {
    if (!supabase || !householdId) return;

    const { data: inventoryRows } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false });

    const { data: shoppingRows } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false });

    if (inventoryRows) setInventory(inventoryRows.map(normalizeInventoryRow));
    if (shoppingRows) {
      setShoppingList(shoppingRows.map((row) => ({ id: row.id, name: row.name, qty: row.qty || '' })));
    }
  };

  const createAndBindHouseholdForUser = async (user) => {
    if (!supabase || !user) return null;

    const payload = {
      name: generateHouseholdName(user),
      invite_code: generateInviteCode(),
    };

    const { data: householdRow, error: createError } = await supabase
      .from('households')
      .insert(payload)
      .select('id, name, invite_code')
      .single();

    if (createError || !householdRow) {
      throw new Error(createError?.message || '创建家庭失败');
    }

    const { error: memberError } = await supabase
      .from('household_members')
      .insert({ household_id: householdRow.id, user_id: user.id, role: 'owner' });

    if (memberError) {
      throw new Error(memberError.message || '绑定家庭成员失败');
    }

    return {
      id: householdRow.id,
      name: householdRow.name,
      inviteCode: householdRow.invite_code,
    };
  };

  const resolveHouseholdForUser = async (user) => {
    if (!supabase || !user) return null;

    const { data: memberships, error: membershipError } = await supabase
      .from('household_members')
      .select('household_id, role, households(id, name, invite_code)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (membershipError) {
      throw new Error(membershipError.message || '查询家庭关系失败');
    }

    const existing = memberships?.[0]?.households;
    if (existing) {
      return {
        id: existing.id,
        name: existing.name,
        inviteCode: existing.invite_code,
      };
    }

    return createAndBindHouseholdForUser(user);
  };

  useEffect(() => {
    if (!supabase) {
      setIsBootstrapping(false);
      return;
    }
    let mounted = true;

    async function bootstrap() {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(currentSession || null);

      if (currentSession?.user) {
        try {
          const nextHousehold = await resolveHouseholdForUser(currentSession.user);
          if (!mounted) return;
          if (nextHousehold) {
            setHousehold(nextHousehold);
            await hydrateHouseholdData(nextHousehold.id);
          }
        } catch (error) {
          showToast(`家庭初始化失败：${error.message}`);
        }
      }
      setIsBootstrapping(false);
    }

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession || null);
      if (nextSession?.user) {
        setIsBootstrapping(true);
        try {
          const nextHousehold = await resolveHouseholdForUser(nextSession.user);
          if (nextHousehold) {
            setHousehold(nextHousehold);
            await hydrateHouseholdData(nextHousehold.id);
          }
        } catch (error) {
          showToast(`家庭初始化失败：${error.message}`);
        } finally {
          setIsBootstrapping(false);
        }
      } else {
        setHousehold(null);
        setInventory(initialInventory);
        setShoppingList(initialShopping);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const persistInventoryItem = async (item) => {
    if (!supabase || !household) return;
    await supabase.from('inventory_items').insert({
      household_id: household.id,
      name: item.name,
      category: item.category,
      zone: item.zone,
      days_left: item.daysLeft,
      amount: item.amount,
      for_baby: item.forBaby,
      note: item.note,
      is_seasoning: item.isSeasoning,
      low_stock: item.lowStock,
    });
  };

  const persistShoppingItem = async (entry) => {
    if (!supabase || !household) return;
    await supabase.from('shopping_items').insert({ household_id: household.id, name: entry.name, qty: entry.qty || '' });
  };

  const removeShoppingItemRemote = async (id) => {
    if (!supabase || !household) return;
    await supabase.from('shopping_items').delete().eq('id', id).eq('household_id', household.id);
  };

  const removeInventoryItemRemote = async (id) => {
    if (!supabase || !household) return;
    await supabase.from('inventory_items').delete().eq('id', id).eq('household_id', household.id);
  };

  const sendMagicLink = async () => {
    if (!authEmail.trim()) {
      showToast('先输入邮箱');
      return;
    }
    if (!supabase) {
      showToast('当前还没配置 Supabase 环境变量，先用演示模式更合适');
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail.trim(),
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
    });
    setAuthLoading(false);
    if (error) {
      showToast(`发送失败：${error.message}`);
      return;
    }
    showToast('登录链接已发送，请去邮箱确认');
  };

  const joinHouseholdByInviteCode = async () => {
    if (!supabase || !session?.user) {
      showToast('请先登录');
      return;
    }

    const code = inviteCodeInput.trim().toUpperCase();
    if (!code) {
      showToast('请输入邀请码');
      return;
    }

    setJoinLoading(true);

    const { data: targetHousehold, error: householdError } = await supabase
      .from('households')
      .select('id, name, invite_code')
      .eq('invite_code', code)
      .maybeSingle();

    if (householdError || !targetHousehold) {
      setJoinLoading(false);
      showToast('邀请码无效，请检查后重试');
      return;
    }

    const { data: existingMembership } = await supabase
      .from('household_members')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('household_id', targetHousehold.id)
      .maybeSingle();

    if (!existingMembership) {
      const { error: joinError } = await supabase
        .from('household_members')
        .insert({ user_id: session.user.id, household_id: targetHousehold.id, role: 'member' });

      if (joinError) {
        setJoinLoading(false);
        showToast(`加入失败：${joinError.message}`);
        return;
      }
    }

    const nextHousehold = {
      id: targetHousehold.id,
      name: targetHousehold.name,
      inviteCode: targetHousehold.invite_code,
    };

    setHousehold(nextHousehold);
    setInviteCodeInput('');
    await hydrateHouseholdData(nextHousehold.id);
    setJoinLoading(false);
    showToast(`已加入 ${nextHousehold.name}`);
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setHousehold(null);
  };

  const enterDemoHousehold = () => {
    setHousehold(demoHousehold);
    setSession({ user: { id: 'demo-user', email: 'demo@example.com' } });
    setIsBootstrapping(false);
    showToast('已进入演示家庭');
  };

  const maybeAddShoppingItem = (name) => {
    const shouldTrack = ['鸡蛋', '牛奶', '西兰花', '生抽', '老抽', '蚝油', '醋', '盐', '糖'];
    if (!shouldTrack.includes(name)) return;
    setShoppingList((prev) => {
      if (prev.some((entry) => entry.name === name)) return prev;
      const preset = quickAddDefaults[name];
      const qty = preset?.isSeasoning ? preset.amount : preset?.amount || '';
      const newEntry = { id: `s-${Date.now()}-${name}`, name, qty };
      persistShoppingItem(newEntry);
      return [...prev, newEntry];
    });
  };

  const removeInventoryItem = (item, reason) => {
    setInventory((prev) => prev.filter((entry) => entry.id !== item.id));
    removeInventoryItemRemote(item.id);
    setHistory((prev) => [{ action: reason, item }, ...prev].slice(0, 6));
    setSelectedItem(null);
    maybeAddShoppingItem(item.name);
    showToast(`${item.name} 已标记为${reason}`);
  };

  const parseVoiceInput = () => {
    const names = splitInputTokens(draftInput);
    const parsed = names.map((name, index) => {
      const preset = quickAddDefaults[name] || { category: '其他', zone: '冷藏', daysLeft: 3, amount: '1份', forBaby: false, isSeasoning: false, lowStock: false };
      return { id: `draft-${index}`, name, ...preset };
    });
    setParsedItems(parsed);
  };

  const parseCookingLog = () => {
    const text = cookingLogInput.trim();
    if (!text) {
      showToast('先输入今天做了什么菜');
      return;
    }
    const directMatches = inventory.filter((item) => text.includes(item.name));
    const fuzzyMatches = cookingKeywordRules
      .filter((rule) => text.includes(rule.keyword))
      .map((rule) => inventory.find((item) => item.name === rule.inventoryName))
      .filter(Boolean);
    const mergedMatches = Array.from(new Map([...directMatches, ...fuzzyMatches].map((item) => [item.id, item])).values());
    const usedUp = /(用完|没了|见底|清空|最后一[份个盒包点]|最后一点)/.test(text);

    if (usedUp && mergedMatches.length) {
      setInventory((prev) => prev.filter((item) => !mergedMatches.some((matched) => matched.id === item.id)));
      mergedMatches.forEach((item) => {
        removeInventoryItemRemote(item.id);
        maybeAddShoppingItem(item.name);
      });
      setHistory((prev) => [{ action: '做菜并用完', item: { name: `${text}（${mergedMatches.map((item) => item.name).join('、')}）` } }, ...prev].slice(0, 6));
      showToast(`已记录做菜，并标记 ${mergedMatches.map((item) => item.name).join('、')} 已用完`);
    } else {
      const usedNames = mergedMatches.length ? `（用了：${mergedMatches.map((item) => item.name).join('、')}）` : '';
      setHistory((prev) => [{ action: '做菜记录', item: { name: `${text}${usedNames}` } }, ...prev].slice(0, 6));
      showToast(mergedMatches.length ? '已记录做菜，默认这些食材还有剩余' : '已记录做菜内容');
    }
    setCookingLogInput('');
  };

  const confirmAddItems = () => {
    if (!parsedItems.length) return;
    const newItems = parsedItems.map((item, index) => ({
      id: Date.now() + index,
      name: item.name,
      category: item.category,
      zone: item.zone,
      daysLeft: item.daysLeft,
      amount: item.amount,
      forBaby: Boolean(item.forBaby),
      isSeasoning: Boolean(item.isSeasoning),
      lowStock: Boolean(item.lowStock),
      note: '新录入',
    }));
    setInventory((prev) => [...newItems, ...prev]);
    newItems.forEach((item) => persistInventoryItem(item));
    setHistory((prev) => [{ action: '入库', item: { name: newItems.map((item) => item.name).join('、') } }, ...prev].slice(0, 6));
    setParsedItems([]);
    setDraftInput('');
    showToast('已确认入库');
    setTab('inventory');
  };

  const markPurchased = (entry) => {
    setCheckedShoppingIds((prev) => [...prev, entry.id]);
    const preset = quickAddDefaults[entry.name] || { category: '其他', zone: '冷藏', daysLeft: 3, amount: entry.qty || '1份', forBaby: false, isSeasoning: false, lowStock: false };
    const newItem = {
      id: Date.now(),
      name: entry.name,
      category: preset.category,
      zone: preset.zone,
      daysLeft: preset.daysLeft,
      amount: preset.amount || entry.qty || '1份',
      forBaby: Boolean(preset.forBaby),
      isSeasoning: Boolean(preset.isSeasoning),
      lowStock: false,
      note: '从待买清单补货',
    };
    window.setTimeout(() => {
      setShoppingList((prev) => prev.filter((item) => item.id !== entry.id));
      removeShoppingItemRemote(entry.id);
      setInventory((prev) => [newItem, ...prev]);
      persistInventoryItem(newItem);
      setCheckedShoppingIds((prev) => prev.filter((id) => id !== entry.id));
      setHistory((prev) => [{ action: '补货入库', item: { name: entry.name } }, ...prev].slice(0, 6));
      showToast(`${entry.name} 已加入库存`);
    }, 450);
  };

  const renderHome = () => (
    <MobileShell
      title="首页看板"
      householdName={household?.name}
      right={<div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700"><Refrigerator className="h-3.5 w-3.5" /> 良好</div>}
    >
      <div className="space-y-4 p-4">
        <Section title="临期抢救区" icon={<AlertTriangle className="h-4 w-4 text-rose-500" />} action="更多">
          <div className="grid grid-cols-3 gap-3">
            {urgentItems.map((item) => <InventoryCard key={item.id} item={item} onOpen={setSelectedItem} />)}
            {!urgentItems.length ? <div className="col-span-3 text-sm text-slate-500">今天没有临期食材，冰箱情绪稳定。</div> : null}
          </div>
        </Section>
        <Section title="宝宝专属区" icon={<Baby className="h-4 w-4 text-violet-500" />} action="更多">
          <div className="grid grid-cols-3 gap-3">
            {babyItems.map((item) => <InventoryCard key={item.id} item={item} onOpen={setSelectedItem} />)}
          </div>
        </Section>
        <Section title="调料补货提醒" icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}>
          <div className="grid grid-cols-3 gap-3">
            {lowSeasoningItems.length ? lowSeasoningItems.map((item) => <InventoryCard key={item.id} item={item} onOpen={setSelectedItem} />) : <div className="col-span-3 text-sm text-slate-500">调料库存还算稳，没有谁在偷偷见底。</div>}
          </div>
        </Section>
        <Section title="下周带饭计划" icon={<CheckCircle2 className="h-4 w-4 text-sky-500" />}>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <div className="mb-2 text-sm font-medium text-sky-800">每周四提醒：决定下一周要带什么菜</div>
            <textarea value={mealPlanInput} onChange={(e) => setMealPlanInput(e.target.value)} placeholder="例如：番茄炒蛋，排骨汤，西兰花炒虾仁" className="h-24 w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm outline-none" />
            <div className="mt-3 flex gap-2"><button onClick={() => setMealPlanInput('番茄炒蛋，排骨汤，西兰花炒虾仁')} className="rounded-xl border border-sky-200 px-4 py-2 text-sm text-sky-700">示例</button></div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs font-semibold text-sky-900">已有库存</div>
                <div className="mt-2 space-y-2">
                  {mealPlanAnalysis.matchedInventory.length ? mealPlanAnalysis.matchedInventory.map((entry, index) => <div key={`${entry.ingredient}-${index}`} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700">{entry.ingredient} → {entry.item}（{entry.amount}）</div>) : <div className="text-sm text-slate-500">还没有匹配到库存</div>}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-sky-900">需要采购</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mealPlanAnalysis.needToBuy.length ? mealPlanAnalysis.needToBuy.map((name) => <span key={name} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">{name}</span>) : <div className="text-sm text-slate-500">当前计划所需食材库存里基本都有</div>}
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section title="冰箱风险提示" icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}>
          <div className="space-y-2 text-sm text-slate-700">
            <div>• {riskSummary.urgent} 样食材将在 2 天内过期</div>
            <div>• {riskSummary.stale} 样食材已进入优先消耗区</div>
          </div>
        </Section>
      </div>
    </MobileShell>
  );

  const renderInput = () => (
    <MobileShell title="录入页" householdName={household?.name} right={<div className="text-xs text-slate-500">极简数据入口</div>}>
      <div className="space-y-4 p-4">
        <Section title="语音闪录" icon={<Mic className="h-4 w-4 text-emerald-600" />}>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="mb-3 flex items-center gap-3 text-emerald-700"><div className="rounded-full bg-white p-3 shadow-sm"><Mic className="h-6 w-6" /></div><div><div className="font-medium">按住告诉我，今天买了什么菜？</div><div className="text-xs opacity-80">这里先用文本模拟语音解析</div></div></div>
            <textarea value={draftInput} onChange={(e) => setDraftInput(e.target.value)} placeholder="例如：排骨 番茄 鸡蛋 生抽" className="h-24 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm outline-none" />
            <div className="mt-3 flex gap-2"><button onClick={parseVoiceInput} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white">解析</button><button onClick={() => setDraftInput('排骨 番茄 鸡蛋 生抽')} className="rounded-xl border border-emerald-200 px-4 py-2 text-sm text-emerald-700">示例</button></div>
          </div>
        </Section>
        <Section title="视觉入库" icon={<Camera className="h-4 w-4 text-sky-600" />}>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setParsedItems([{ id: 'scan-1', name: '牛奶', ...quickAddDefaults['牛奶'] }, { id: 'scan-2', name: '鸡蛋', ...quickAddDefaults['鸡蛋'] }]); showToast('已模拟小票识别'); }} className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-medium text-sky-700"><ScanLine className="mx-auto mb-2 h-6 w-6" />扫小票</button>
            <button onClick={() => { setParsedItems([{ id: 'photo-1', name: '番茄', ...quickAddDefaults['番茄'] }]); showToast('已模拟拍食材识别'); }} className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-medium text-sky-700"><Camera className="mx-auto mb-2 h-6 w-6" />拍食材</button>
          </div>
        </Section>
        <Section title="待确认入库" icon={<CheckCircle2 className="h-4 w-4 text-slate-600" />}>
          {parsedItems.length ? <div className="space-y-2">{parsedItems.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{item.name} · {item.category} · {item.zone} ·{item.isSeasoning ? ` ${item.amount}` : ` ${item.daysLeft} 天`}</div>)}<button onClick={confirmAddItems} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">确认入库</button></div> : <div className="text-sm text-slate-500">还没有待确认的食材。</div>}
        </Section>
        <Section title="做菜记录" icon={<CheckCircle2 className="h-4 w-4 text-orange-500" />}>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="mb-3 text-sm font-medium text-orange-800">一句话记录今天做了什么菜</div>
            <textarea value={cookingLogInput} onChange={(e) => setCookingLogInput(e.target.value)} placeholder="例如：今天做了番茄炒蛋和排骨汤，用了鸡蛋和排骨；如果没说用完，默认还有剩" className="h-24 w-full rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm outline-none" />
            <div className="mt-3 flex gap-2"><button onClick={parseCookingLog} className="flex-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white">记录做菜</button><button onClick={() => setCookingLogInput('今天做了番茄炒蛋和排骨汤，用了鸡蛋和排骨')} className="rounded-xl border border-orange-200 px-4 py-2 text-sm text-orange-700">示例</button></div>
            <div className="mt-2 text-xs text-orange-700">规则：只有明确说“用完了/没了”，系统才会把食材从库存移除。</div>
          </div>
        </Section>
        <Section title="历史记录" icon={<Undo2 className="h-4 w-4 text-slate-500" />}>
          <div className="space-y-2 text-sm text-slate-600">{history.length ? history.map((entry, index) => <div key={`${entry.action}-${index}`}>• {entry.action}：{entry.item.name}</div>) : '暂无记录'}</div>
        </Section>
      </div>
    </MobileShell>
  );

  const renderInventory = () => (
    <MobileShell title="库存与待买" householdName={household?.name} right={<div className="text-xs text-slate-500">按区域查看</div>}>
      <div className="space-y-4 p-4">
        <Section title="待买清单" icon={<PlusCircle className="h-4 w-4 text-slate-700" />}>
          <div className="grid grid-cols-3 gap-3">
            {shoppingList.length ? shoppingList.map((entry) => <ShoppingCard key={entry.id} entry={entry} checked={checkedShoppingIds.includes(entry.id)} onCheck={markPurchased} />) : <div className="col-span-3 text-sm text-slate-500">待买清单已经清空，采购节奏很优秀。</div>}
          </div>
        </Section>
        <Section title="库存清单" icon={<ShoppingCart className="h-4 w-4 text-slate-700" />}>
          <div className="grid grid-cols-3 gap-3">
            {inventory.filter((item) => !item.isSeasoning).length ? inventory.filter((item) => !item.isSeasoning).map((item) => <InventoryCard key={item.id} item={item} onOpen={setSelectedItem} />) : <div className="col-span-3 text-sm text-slate-500">这里暂时没有食材库存。</div>}
          </div>
        </Section>
        <Section title="调料库存" icon={<CheckCircle2 className="h-4 w-4 text-orange-600" />}>
          <div className="grid grid-cols-3 gap-3">
            {seasoningItems.length ? seasoningItems.map((item) => <InventoryCard key={item.id} item={item} onOpen={setSelectedItem} />) : <div className="col-span-3 text-sm text-slate-500">这里暂时没有调料库存。</div>}
          </div>
        </Section>
      </div>
    </MobileShell>
  );

  const renderSettings = () => (
    <MobileShell title="设置" householdName={household?.name} right={<Settings className="h-4 w-4 text-slate-500" />}>
      <div className="space-y-4 p-4">
        <Section title="家庭信息" icon={<Home className="h-4 w-4 text-slate-700" />}>
          <div className="space-y-2 text-sm text-slate-600">
            <div>• 当前家庭：{household?.name || 'XX 的家'}</div>
            <div>• 模式：家庭共享</div>
            <div>• 邀请码：{household?.inviteCode || '未生成'}</div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium text-slate-700">输入邀请码加入/切换家庭</div>
            <input
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
              placeholder="输入邀请码"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm uppercase outline-none"
            />
            <button
              onClick={joinHouseholdByInviteCode}
              disabled={joinLoading}
              className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {joinLoading ? '处理中…' : '加入该家庭'}
            </button>
          </div>
        </Section>
        <Section title="提醒规则" icon={<AlertTriangle className="h-4 w-4 text-slate-700" />}>
          <div className="space-y-2 text-sm text-slate-600">
            <div>• 剩余 ≤ 2 天：进入临期抢救区</div>
            <div>• 鸡蛋或常用调料库存偏低：自动加入待买清单</div>
            <div>• 每周四提醒制定下周带饭菜单，并自动分析库存与待买</div>
          </div>
        </Section>
      </div>
    </MobileShell>
  );

  if (isBootstrapping) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6"><div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-xl">正在连接家庭冰箱……</div></div>;
  }

  if (!session || !household) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 p-6">
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-slate-900">冰箱管理原型</h1>
          <p className="mt-2 text-sm text-slate-600">现在开始接入真实数据库和家庭共享登录。先登录，再进入属于你们家的冰箱空间。</p>
        </div>
        {!session ? (
          <AuthPanel email={authEmail} setEmail={setAuthEmail} onSendMagicLink={sendMagicLink} onUseDemo={enterDemoHousehold} loading={authLoading} authMode={authMode} setAuthMode={setAuthMode} />
        ) : (
          <HouseholdJoinPanel
            email={session?.user?.email}
            household={household}
            inviteCodeInput={inviteCodeInput}
            setInviteCodeInput={setInviteCodeInput}
            onJoinHousehold={joinHouseholdByInviteCode}
            joinLoading={joinLoading}
            onLogout={logout}
          />
        )}
        <div className="mx-auto mt-6 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="text-base font-semibold text-slate-900">Supabase 表结构建议</div>
          <pre className="mt-3 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`-- households\ncreate table households (\n  id uuid primary key default gen_random_uuid(),\n  name text not null,\n  invite_code text unique not null,\n  created_at timestamptz default now()\n);\n\n-- household_members\ncreate table household_members (\n  id uuid primary key default gen_random_uuid(),\n  household_id uuid references households(id) on delete cascade,\n  user_id uuid not null,\n  role text default 'member',\n  created_at timestamptz default now()\n);\n\n-- inventory_items\ncreate table inventory_items (\n  id uuid primary key default gen_random_uuid(),\n  household_id uuid references households(id) on delete cascade,\n  name text not null,\n  category text not null,\n  zone text not null,\n  days_left integer default 3,\n  amount text default '',\n  for_baby boolean default false,\n  note text default '',\n  is_seasoning boolean default false,\n  low_stock boolean default false,\n  created_at timestamptz default now()\n);\n\n-- shopping_items\ncreate table shopping_items (\n  id uuid primary key default gen_random_uuid(),\n  household_id uuid references households(id) on delete cascade,\n  name text not null,\n  qty text default '',\n  created_at timestamptz default now()\n);`}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 p-6">
      <div className="mx-auto mb-5 max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900">冰箱管理原型</h1>
        <p className="mt-1 text-sm text-slate-600">可点击测试：首页提醒、录入模拟、库存处理、待买清单自动流转。</p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[380px_1fr]">
        <div>
          {tab === 'home' && renderHome()}
          {tab === 'input' && renderInput()}
          {tab === 'inventory' && renderInventory()}
          {tab === 'settings' && renderSettings()}
          <div className="mx-auto mt-4 grid max-w-sm grid-cols-4 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
            {[
              ['home', '首页', Home],
              ['input', '录入', PlusCircle],
              ['inventory', '库存', ShoppingCart],
              ['settings', '设置', Settings],
            ].map(([key, label, Icon]) => (
              <button key={key} onClick={() => setTab(key)} className={classNames('flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium', tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">你可以直接测试的流程</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4"><div className="font-medium">1. 消耗闭环</div><div className="mt-2">到首页点“半个西瓜”或“冷鲜排骨”，再点“我吃了 / 已坏扔掉 / 今日做掉”。</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="font-medium">2. 录入闭环</div><div className="mt-2">切到“录入”，输入“排骨 番茄 鸡蛋 生抽”，点“解析”再“确认入库”。</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="font-medium">3. 防重买闭环</div><div className="mt-2">切到“库存”，点待买方块会先显示对勾，然后自动从待买清单消失，并直接加入库存。</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="font-medium">4. 下周带饭计划</div><div className="mt-2">在首页输入下周想带的菜，系统会自动分析哪些库存已有、哪些需要采购。</div></div>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">内置自检</h3>
            <div className="mt-3 space-y-2 text-sm">{selfChecks.map((check) => <div key={check.name} className={classNames('rounded-xl border px-3 py-2', check.passed ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800')}>{check.passed ? '✓' : '✗'} {check.name}</div>)}</div>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">当前版本已经加上 Supabase-ready 的登录与家庭空间骨架。接下来最适合继续做的是：数据库行级权限（RLS）、邀请家人加入同一 household，以及库存/待买的实时订阅同步。</div>
        </div>
      </div>
      {selectedItem ? <ActionSheet item={selectedItem} onClose={() => setSelectedItem(null)} onEat={(item) => removeInventoryItem(item, '已吃完')} onDiscard={(item) => removeInventoryItem(item, '已扔掉')} onCook={(item) => removeInventoryItem(item, '今日做掉')} /> : null}
      {toast ? <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-xl">{toast}</div> : null}
    </div>
  );
}
