/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  const discount = 1 - purchase.discount / 100;
  return purchase.sale_price * purchase.quantity * discount;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
  if (index === 0) return seller.profit * 0.15;
  if (index <= 2) return seller.profit * 0.1;
  if (index === total - 1) return 0;
  return seller.profit * 0.05;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
  // проверки
  if (
    !data?.sellers?.length ||
    !data?.products?.length ||
    !data?.purchase_records?.length
  ) {
    throw new Error("Некорректные входные данные");
  }
  if (
    typeof options?.calculateRevenue !== "function" ||
    typeof options?.calculateBonus !== "function"
  ) {
    throw new Error("Не найдены необходимые функции");
  }

  // подготовка структур
  const sellerStats = data.sellers.map((s) => ({
    id: s.id,
    name: `${s.first_name} ${s.last_name}`,
    revenue: 0,
    profit: 0,
    sales_count: 0,
    products_sold: {},
  }));

  const sellerIndex = Object.fromEntries(sellerStats.map((s) => [s.id, s]));
  const productIndex = Object.fromEntries(data.products.map((p) => [p.sku, p]));

  // TODO: расчет выручки и прибыли для каждого продавца

  // TODO: сортировка и назначение бонусов

  // временный возврат
  return sellerStats;
}
