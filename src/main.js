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

  // расчет выручки и прибыли для каждого продавца
  data.purchase_records.forEach((record) => {
    const seller = sellerIndex[record.seller_id];
    seller.sales_count++;
    seller.revenue += record.total_amount;

    record.items.forEach((item) => {
      const product = productIndex[item.sku];
      const revenue = options.calculateRevenue(item, product);
      const profit = revenue - product.purchase_price * item.quantity;
      seller.profit += profit;
      seller.products_sold[item.sku] =
        (seller.products_sold[item.sku] || 0) + item.quantity;
    });
  });

  // сортировка по прибыли
  sellerStats.sort((a, b) => b.profit - a.profit);

  // назначение бонусов и топов
  sellerStats.forEach((seller, idx) => {
    seller.bonus = options.calculateBonus(idx, sellerStats.length, seller);
    seller.top_products = Object.entries(seller.products_sold)
      .map(([sku, qty]) => ({ sku, quantity: qty }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  });

  // итоговый результат
  return sellerStats.map((s) => ({
    seller_id: s.id,
    name: s.name,
    revenue: +s.revenue.toFixed(2),
    profit: +s.profit.toFixed(2),
    sales_count: s.sales_count,
    top_products: s.top_products,
    bonus: +s.bonus.toFixed(2),
  }));
}
