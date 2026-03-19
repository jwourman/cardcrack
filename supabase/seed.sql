-- ============================================================
-- CardCrack Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Insert decks
-- Note: replace admin_user_id with the UUID of your admin user

do $$
declare
  admin_id uuid;
  -- Deck IDs
  d1 uuid := uuid_generate_v4();
  d2 uuid := uuid_generate_v4();
  d3 uuid := uuid_generate_v4();
  d4 uuid := uuid_generate_v4();
  d5 uuid := uuid_generate_v4();
  d6 uuid := uuid_generate_v4();
  d7 uuid := uuid_generate_v4();
  d8 uuid := uuid_generate_v4();
  d9 uuid := uuid_generate_v4();
  d10 uuid := uuid_generate_v4();
begin
  -- Get the first admin user (or null)
  select id into admin_id from public.users where role = 'admin' limit 1;

  -- ================================================================
  -- DECK 1: Financial Accounting Basics (FREE)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d1, 'Financial Accounting Basics', 'financial-accounting-basics',
    'Master the core concepts of financial accounting: the accounting equation, journal entries, financial statements, and GAAP principles. Ideal for intro accounting students.',
    'accounting', 'beginner', 40, false, true, 0, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d1, 'What is the accounting equation?', 'Assets = Liabilities + Owner''s Equity. This fundamental equation forms the basis of double-entry bookkeeping.', 0),
    (d1, 'What is a debit?', 'A debit is an entry on the left side of an account. Debits increase assets and expenses; debits decrease liabilities, equity, and revenue.', 1),
    (d1, 'What is a credit?', 'A credit is an entry on the right side of an account. Credits increase liabilities, equity, and revenue; credits decrease assets and expenses.', 2),
    (d1, 'What are the four main financial statements?', '1) Income Statement, 2) Balance Sheet, 3) Statement of Cash Flows, 4) Statement of Changes in Equity.', 3),
    (d1, 'What is GAAP?', 'Generally Accepted Accounting Principles — a set of rules and standards for financial reporting in the United States, maintained by FASB.', 4),
    (d1, 'What is the matching principle?', 'Expenses should be recognized in the same period as the revenues they help generate, regardless of when cash is exchanged.', 5),
    (d1, 'What is accrual accounting?', 'A method where revenues and expenses are recorded when earned/incurred, not when cash is received or paid.', 6),
    (d1, 'What is the difference between assets and liabilities?', 'Assets are resources owned by the company with economic value. Liabilities are obligations owed to outside parties (debts).', 7),
    (d1, 'What is working capital?', 'Working Capital = Current Assets − Current Liabilities. It measures short-term liquidity and operational efficiency.', 8),
    (d1, 'What is depreciation?', 'The systematic allocation of the cost of a long-term asset over its useful life. It is a non-cash expense that reduces asset book value.', 9),
    (d1, 'What is accounts receivable?', 'Money owed to the company by customers who have purchased goods/services on credit. It''s a current asset.', 10),
    (d1, 'What is accounts payable?', 'Money the company owes to suppliers/vendors for goods and services received. It''s a current liability.', 11),
    (d1, 'What is the income statement?', 'A financial statement showing revenues, expenses, and net income (profit or loss) over a specific period.', 12),
    (d1, 'What is the balance sheet?', 'A snapshot of a company''s financial position at a specific point in time, showing assets, liabilities, and equity.', 13),
    (d1, 'What is net income?', 'Revenue minus all expenses (COGS, operating, interest, taxes). Also called "bottom line" or profit.', 14),
    (d1, 'What is retained earnings?', 'Cumulative net income that has been kept in the business rather than distributed as dividends.', 15),
    (d1, 'What is a journal entry?', 'The basic accounting record that records business transactions using debits and credits, ensuring the accounting equation stays balanced.', 16),
    (d1, 'What is the revenue recognition principle?', 'Revenue should be recognized when it is earned and realizable, not necessarily when cash is received.', 17),
    (d1, 'What is a trial balance?', 'A list of all general ledger accounts and their balances at a specific point in time. Used to verify that total debits equal total credits.', 18),
    (d1, 'What is goodwill?', 'An intangible asset representing the premium paid above fair value when acquiring another company — related to brand, reputation, and customer base.', 19),
    (d1, 'What is COGS?', 'Cost of Goods Sold — the direct costs of producing the goods sold during a period (materials, labor). COGS = Beginning Inventory + Purchases - Ending Inventory.', 20);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d1, 'What does the accounting equation state?', 'Assets = Revenue + Expenses', 'Assets = Liabilities + Owner''s Equity', 'Liabilities = Assets - Revenue', 'Equity = Liabilities + Assets', 'b', 'The fundamental accounting equation is Assets = Liabilities + Owner''s Equity.', 0),
    (d1, 'Which of the following is increased by a debit entry?', 'Revenue', 'Liabilities', 'Assets', 'Owner''s Equity', 'c', 'Debits increase assets and expenses; they decrease liabilities, equity, and revenue.', 1),
    (d1, 'What financial statement shows a company''s performance over a period?', 'Balance Sheet', 'Statement of Cash Flows', 'Income Statement', 'Statement of Retained Earnings', 'c', 'The Income Statement shows revenues and expenses over a specific time period.', 2),
    (d1, 'Working capital is calculated as:', 'Total Assets - Total Liabilities', 'Current Assets - Current Liabilities', 'Revenue - Expenses', 'Cash + Receivables', 'b', 'Working Capital = Current Assets - Current Liabilities.', 3),
    (d1, 'Under accrual accounting, revenue is recognized when:', 'Cash is received', 'An invoice is sent', 'It is earned, regardless of cash receipt', 'The customer pays within 30 days', 'c', 'Accrual accounting recognizes revenue when earned, not when cash is received.', 4),
    (d1, 'Depreciation is:', 'A cash expense', 'The systematic allocation of asset cost over its useful life', 'The decline in market value of an asset', 'An increase in asset value', 'b', 'Depreciation allocates the cost of a long-term asset over its useful life — it is non-cash.', 5),
    (d1, 'Accounts receivable is classified as:', 'A current liability', 'A long-term asset', 'A current asset', 'Owner''s equity', 'c', 'Accounts receivable represents money owed to the company — a current asset.', 6),
    (d1, 'Net income equals:', 'Revenue + Expenses', 'Revenue - Expenses', 'Assets - Liabilities', 'Cash + Receivables', 'b', 'Net Income = Revenue minus all Expenses.', 7),
    (d1, 'What is the purpose of GAAP?', 'To reduce tax liability', 'To ensure consistent and comparable financial reporting', 'To maximize shareholder value', 'To simplify bookkeeping', 'b', 'GAAP provides standards for consistent financial reporting, enabling comparability.', 8),
    (d1, 'Retained earnings represent:', 'Total dividends paid', 'Net income distributed to shareholders', 'Cumulative profits kept in the business', 'Cash held in reserve accounts', 'c', 'Retained earnings are cumulative net income not distributed as dividends.', 9);

  -- ================================================================
  -- DECK 2: Intro to Microeconomics (FREE)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d2, 'Intro to Microeconomics', 'intro-to-microeconomics',
    'Core microeconomics concepts including supply and demand, elasticity, market equilibrium, consumer theory, and market structures. Perfect for Econ 101 exam prep.',
    'economics', 'beginner', 35, false, true, 0, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d2, 'What is the Law of Demand?', 'As price increases, quantity demanded decreases (inverse relationship), all else being equal (ceteris paribus).', 0),
    (d2, 'What is the Law of Supply?', 'As price increases, quantity supplied increases (positive relationship), all else being equal.', 1),
    (d2, 'What is market equilibrium?', 'The point where quantity demanded equals quantity supplied. The market-clearing price and quantity with no surplus or shortage.', 2),
    (d2, 'What is price elasticity of demand?', 'The percentage change in quantity demanded divided by the percentage change in price. Measures how sensitive demand is to price changes.', 3),
    (d2, 'What is a substitute good?', 'A good that can replace another in consumption. When the price of one rises, demand for the substitute increases (e.g., Pepsi vs. Coca-Cola).', 4),
    (d2, 'What is a complementary good?', 'A good consumed together with another. When the price of one rises, demand for the complement falls (e.g., hot dogs and buns).', 5),
    (d2, 'What is consumer surplus?', 'The difference between the maximum a consumer is willing to pay and what they actually pay. Area above price and below the demand curve.', 6),
    (d2, 'What is producer surplus?', 'The difference between the price a producer receives and their minimum willingness to accept. Area below price and above the supply curve.', 7),
    (d2, 'What is a price ceiling?', 'A government-imposed maximum price below equilibrium. Creates shortages because quantity demanded exceeds quantity supplied.', 8),
    (d2, 'What is a price floor?', 'A government-imposed minimum price above equilibrium. Creates surpluses because quantity supplied exceeds quantity demanded.', 9),
    (d2, 'What is perfect competition?', 'A market structure with many buyers and sellers, identical products, free entry/exit, and no single firm has pricing power.', 10),
    (d2, 'What is a monopoly?', 'A single seller dominates the market with no close substitutes and significant barriers to entry. Can set price above marginal cost.', 11),
    (d2, 'What is marginal utility?', 'The additional satisfaction gained from consuming one more unit of a good. Typically diminishes as more is consumed (diminishing marginal utility).', 12),
    (d2, 'What is opportunity cost?', 'The value of the next best alternative forgone when making a decision. The true cost of any choice.', 13),
    (d2, 'What is deadweight loss?', 'The loss of economic efficiency when equilibrium is not achieved — typically due to taxes, subsidies, price controls, or monopolies.', 14),
    (d2, 'What causes a shift in the demand curve?', 'Changes in income, prices of related goods, consumer preferences, expectations, or number of buyers — NOT changes in the good''s own price.', 15),
    (d2, 'What is an inferior good?', 'A good for which demand decreases as consumer income rises (e.g., instant noodles, public transit). Opposite of a normal good.', 16),
    (d2, 'What is the Cobb-Douglas production function?', 'Q = A * K^α * L^β — a standard model showing output (Q) as a function of capital (K) and labor (L) with constants A, α, β.', 17),
    (d2, 'What is game theory in microeconomics?', 'The study of strategic interactions where the outcome of one party depends on the choices of others. Key concept: Nash Equilibrium.', 18),
    (d2, 'What is moral hazard?', 'When a party takes greater risks because they don''t bear the full cost of those risks — common in insurance markets.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d2, 'According to the Law of Demand, as price increases:', 'Quantity demanded increases', 'Quantity demanded decreases', 'Supply increases', 'Demand curve shifts right', 'b', 'The Law of Demand states an inverse relationship between price and quantity demanded.', 0),
    (d2, 'Market equilibrium occurs when:', 'Supply exceeds demand', 'Demand exceeds supply', 'Quantity demanded equals quantity supplied', 'Price is zero', 'c', 'Equilibrium is where Qs = Qd — the market-clearing price.', 1),
    (d2, 'A price ceiling set BELOW equilibrium will cause:', 'A surplus', 'A shortage', 'Higher prices', 'Increased supply', 'b', 'Price ceilings below equilibrium create shortages (Qd > Qs).', 2),
    (d2, 'If the price of tea rises and demand for coffee increases, these goods are:', 'Complementary goods', 'Inferior goods', 'Normal goods', 'Substitute goods', 'd', 'When price of one good rises and demand for another rises, they are substitutes.', 3),
    (d2, 'Consumer surplus is the area:', 'Above price and below supply curve', 'Below price and above demand curve', 'Above price and below demand curve', 'Between supply and demand curves', 'c', 'Consumer surplus = area above the price line and below the demand curve.', 4),
    (d2, 'Deadweight loss represents:', 'Government tax revenue', 'Lost economic efficiency', 'Producer profits', 'Consumer spending', 'b', 'Deadweight loss is the efficiency loss when equilibrium output is not achieved.', 5),
    (d2, 'In perfect competition, firms are:', 'Price makers', 'Price takers', 'Monopolists', 'Oligopolists', 'b', 'In perfect competition, firms have no pricing power — they are price takers.', 6),
    (d2, 'Opportunity cost is:', 'The dollar cost of a good', 'The value of the next best alternative forgone', 'Sunk costs already paid', 'The production cost', 'b', 'Opportunity cost = value of the next best alternative not chosen.', 7),
    (d2, 'Diminishing marginal utility means:', 'Total utility is always decreasing', 'Additional utility per unit consumed decreases', 'Price increases reduce utility', 'Utility is constant', 'b', 'Each additional unit consumed adds less satisfaction than the previous one.', 8),
    (d2, 'An inferior good is one where demand:', 'Increases as income rises', 'Decreases as income rises', 'Is perfectly inelastic', 'Always has unit elasticity', 'b', 'Inferior goods have a negative income effect — demand falls as income rises.', 9);

  -- ================================================================
  -- DECK 3: Personal Finance Core Concepts (FREE)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d3, 'Personal Finance Core Concepts', 'personal-finance-core',
    'Essential personal finance knowledge: budgeting, compound interest, credit scores, investing basics, tax concepts, and retirement planning. Build financial literacy fast.',
    'personal-finance', 'beginner', 30, false, true, 0, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d3, 'What is compound interest?', 'Interest calculated on both the principal and accumulated interest. Formula: A = P(1 + r/n)^(nt). Money grows exponentially over time.', 0),
    (d3, 'What is the Rule of 72?', 'Divide 72 by the annual interest rate to estimate how many years it takes to double your money. E.g., at 8%, money doubles in ~9 years.', 1),
    (d3, 'What is net worth?', 'Total Assets minus Total Liabilities. Your financial snapshot: what you own minus what you owe.', 2),
    (d3, 'What is a credit score?', 'A numerical rating (300–850) representing creditworthiness. Factors: payment history (35%), amounts owed (30%), length of history (15%), credit mix (10%), new credit (10%).', 3),
    (d3, 'What is a 401(k)?', 'An employer-sponsored retirement savings plan with pre-tax contributions. Many employers match contributions. 2024 contribution limit: $23,000.', 4),
    (d3, 'What is an IRA?', 'Individual Retirement Account — a tax-advantaged savings account. Traditional IRA = pre-tax contributions; Roth IRA = after-tax contributions with tax-free withdrawals.', 5),
    (d3, 'What is dollar-cost averaging?', 'Investing a fixed dollar amount at regular intervals regardless of price. Reduces the risk of investing a lump sum at the wrong time.', 6),
    (d3, 'What is diversification?', 'Spreading investments across different asset classes, sectors, and geographies to reduce unsystematic risk. "Don''t put all your eggs in one basket."', 7),
    (d3, 'What is an emergency fund?', 'A liquid savings reserve of 3–6 months of living expenses for unexpected costs like job loss, medical bills, or car repairs.', 8),
    (d3, 'What is the 50/30/20 budgeting rule?', '50% of income to needs, 30% to wants, 20% to savings and debt repayment. A simple framework for personal budgeting.', 9),
    (d3, 'What is APR?', 'Annual Percentage Rate — the yearly cost of borrowing, including interest and fees. Used to compare loan/credit card costs.', 10),
    (d3, 'What is the difference between a stock and a bond?', 'Stock = ownership in a company (equity). Bond = a loan to a company or government (debt). Stocks are higher risk/higher return; bonds are lower risk/lower return.', 11),
    (d3, 'What is inflation?', 'The general increase in prices over time, reducing purchasing power. Measured by CPI. Target inflation in the US is ~2% annually.', 12),
    (d3, 'What is a Roth IRA?', 'An individual retirement account funded with after-tax dollars. Qualified withdrawals in retirement are tax-free. Income limits apply for contributions.', 13),
    (d3, 'What is asset allocation?', 'How an investor distributes investments among asset classes (stocks, bonds, cash, real estate). Should reflect risk tolerance, time horizon, and goals.', 14),
    (d3, 'What is a W-2 form?', 'A tax form sent by employers showing annual wages and taxes withheld. Required to file your income tax return.', 15),
    (d3, 'What is a mutual fund?', 'A pooled investment vehicle managed by professionals. Investors buy shares and get proportional exposure to a diversified portfolio.', 16),
    (d3, 'What is an index fund?', 'A passive investment fund that tracks a market index (e.g., S&P 500). Low fees, broad diversification, and historically outperforms most active managers.', 17),
    (d3, 'What is debt-to-income ratio?', 'Monthly debt payments divided by gross monthly income. Lenders use this to evaluate loan affordability. Below 36% is generally considered healthy.', 18),
    (d3, 'What is FICO score vs credit score?', 'FICO (Fair Isaac Corporation) is the most widely used credit scoring model (300–850). "Credit score" is a general term; FICO is a specific scoring brand.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d3, 'The Rule of 72 is used to estimate:', 'How much tax you owe', 'How many years it takes to double money', 'Your credit score improvement', 'Monthly budget allocation', 'b', 'Divide 72 by the interest rate to estimate doubling time.', 0),
    (d3, 'Net worth equals:', 'Income minus expenses', 'Assets minus liabilities', 'Savings minus debt', 'Revenue minus costs', 'b', 'Net Worth = Total Assets - Total Liabilities.', 1),
    (d3, 'A Roth IRA differs from a Traditional IRA in that:', 'Contributions are pre-tax', 'Withdrawals are taxed in retirement', 'Contributions are after-tax; qualified withdrawals are tax-free', 'No income limits apply', 'c', 'Roth IRA: after-tax contributions, tax-free growth and qualified withdrawals.', 2),
    (d3, 'The 50/30/20 rule allocates 20% to:', 'Housing', 'Entertainment', 'Savings and debt repayment', 'Food and transportation', 'c', '50% needs, 30% wants, 20% savings/debt repayment.', 3),
    (d3, 'Dollar-cost averaging means:', 'Buying only when prices are low', 'Investing a fixed amount at regular intervals', 'Timing the market perfectly', 'Diversifying across currencies', 'b', 'DCA = investing a fixed amount regularly, regardless of price.', 4),
    (d3, 'Which factor has the MOST weight in calculating a FICO credit score?', 'Length of credit history', 'Types of credit', 'Payment history', 'New credit inquiries', 'c', 'Payment history accounts for 35% of a FICO score — the largest factor.', 5),
    (d3, 'An emergency fund should cover:', '1 month of expenses', '3–6 months of living expenses', '1 year of income', 'Only medical bills', 'b', 'Standard recommendation is 3–6 months of living expenses in liquid savings.', 6),
    (d3, 'An index fund is best described as:', 'An actively managed fund', 'A fund that tracks a market index', 'A fund investing only in bonds', 'A single-stock investment', 'b', 'Index funds passively track market indices with low fees.', 7),
    (d3, 'Inflation measures:', 'Interest rates set by the Fed', 'General rise in price levels over time', 'Stock market returns', 'GDP growth rate', 'b', 'Inflation is the general increase in price levels, reducing purchasing power.', 8),
    (d3, 'A debt-to-income ratio of 25% means:', '25% of assets are financed by debt', '25% of gross income goes to debt payments', '25% of expenses are discretionary', 'None of the above', 'b', 'DTI = monthly debt payments / gross monthly income.', 9);

  -- ================================================================
  -- DECK 4: Managerial Accounting Essentials (PREMIUM)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d4, 'Managerial Accounting Essentials', 'managerial-accounting-essentials',
    'Cost behavior, CVP analysis, budgeting, variance analysis, job and process costing, and activity-based costing. Built for managerial accounting courses and business exams.',
    'accounting', 'intermediate', 50, true, true, 1299, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d4, 'What is a variable cost?', 'A cost that changes in total in direct proportion to changes in activity level. Examples: direct materials, direct labor, sales commissions.', 0),
    (d4, 'What is a fixed cost?', 'A cost that remains constant in total regardless of activity level within the relevant range. Examples: rent, depreciation, salaries.', 1),
    (d4, 'What is the contribution margin?', 'Sales Revenue minus Variable Costs. CM = Revenue - Variable Costs. Used to cover fixed costs and generate profit.', 2),
    (d4, 'What is the contribution margin ratio?', 'Contribution Margin divided by Sales Revenue. Tells you what percentage of each dollar of sales is available to cover fixed costs.', 3),
    (d4, 'What is the break-even point?', 'The level of sales where total revenues equal total costs (profit = $0). BEP (units) = Fixed Costs ÷ CM per unit.', 4),
    (d4, 'What is CVP analysis?', 'Cost-Volume-Profit analysis examines the relationship between costs, volume, and profit to make planning decisions.', 5),
    (d4, 'What is a standard cost?', 'A predetermined cost for inputs (materials, labor) used as benchmarks to compare against actual costs for variance analysis.', 6),
    (d4, 'What is a budget variance?', 'The difference between budgeted and actual results. Favorable = actual cost < budget; Unfavorable = actual cost > budget.', 7),
    (d4, 'What is activity-based costing (ABC)?', 'A costing method that assigns overhead costs to products based on the activities that drive those costs, rather than simple volume-based allocation.', 8),
    (d4, 'What is job order costing?', 'A costing system used when products are unique or custom-made. Costs are tracked per individual job or batch.', 9),
    (d4, 'What is process costing?', 'A costing system used when identical units are mass-produced continuously. Costs are averaged across all units.', 10),
    (d4, 'What is the margin of safety?', 'The difference between actual/budgeted sales and break-even sales. Measures how much sales can drop before losses occur.', 11),
    (d4, 'What is absorption costing?', 'A product costing method that assigns all manufacturing costs (fixed and variable) to products. Required by GAAP for external reporting.', 12),
    (d4, 'What is variable costing?', 'A product costing method that assigns only variable manufacturing costs to products. Fixed manufacturing overhead is a period cost.', 13),
    (d4, 'What is a master budget?', 'The comprehensive budget package for an organization, including the operating budget (sales, production, expenses) and financial budget (cash, balance sheet).', 14),
    (d4, 'What is a flexible budget?', 'A budget that adjusts to actual activity levels. Used for performance evaluation to separate volume variances from efficiency variances.', 15),
    (d4, 'What is the overhead efficiency variance?', 'Measures whether overhead was used efficiently. = (Standard hours allowed - Actual hours worked) × Standard overhead rate.', 16),
    (d4, 'What is transfer pricing?', 'The price at which one division of a company sells goods/services to another division. Affects divisional profitability and tax planning.', 17),
    (d4, 'What is residual income?', 'Residual Income = Net Operating Income - (Required Rate of Return × Investment). Measures profit above the minimum required return.', 18),
    (d4, 'What is return on investment (ROI)?', 'ROI = Net Operating Income ÷ Average Operating Assets. Measures how effectively a division uses assets to generate profit.', 19),
    (d4, 'What are period costs?', 'Costs not associated with manufacturing — expensed in the period incurred. Include selling and administrative expenses.', 20),
    (d4, 'What are product costs?', 'Manufacturing costs that are inventoriable: direct materials, direct labor, and manufacturing overhead. Expensed when the product is sold.', 21),
    (d4, 'What is just-in-time (JIT) inventory?', 'A strategy that minimizes inventory by producing/ordering only what is needed, when needed. Reduces holding costs but requires reliable suppliers.', 22),
    (d4, 'What is the relevant range?', 'The range of activity within which cost behavior assumptions (fixed vs. variable) remain valid. Outside this range, relationships may change.', 23),
    (d4, 'What is sunk cost?', 'A cost that has already been incurred and cannot be recovered. Sunk costs should NOT influence future decisions.', 24);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d4, 'The break-even point in units is calculated as:', 'Revenue ÷ Variable Costs', 'Fixed Costs ÷ Contribution Margin per Unit', 'Revenue ÷ Fixed Costs', 'Variable Costs ÷ Fixed Costs', 'b', 'BEP (units) = Fixed Costs ÷ CM per unit. This is where total revenue = total costs.', 0),
    (d4, 'Contribution margin equals:', 'Net income + Fixed costs', 'Revenue - Variable costs', 'Revenue - Fixed costs', 'Gross profit - Operating expenses', 'b', 'CM = Revenue - Variable Costs. It contributes to covering fixed costs and profit.', 1),
    (d4, 'Activity-based costing differs from traditional costing by:', 'Using fewer cost pools', 'Assigning costs based on activities rather than volume', 'Ignoring overhead', 'Using only direct costs', 'b', 'ABC identifies activities that drive costs and assigns overhead accordingly.', 2),
    (d4, 'Absorption costing includes which costs in product cost?', 'Only variable manufacturing costs', 'All manufacturing costs (fixed + variable)', 'Only direct materials and labor', 'Selling and administrative costs', 'b', 'Absorption costing = direct materials + direct labor + variable OH + fixed OH.', 3),
    (d4, 'A flexible budget adjusts for:', 'Changes in fixed costs', 'Changes in volume/activity level', 'Changes in selling prices', 'Currency fluctuations', 'b', 'Flexible budgets adjust to actual activity levels for meaningful performance comparison.', 4),
    (d4, 'A sunk cost should be:', 'Used in all future decisions', 'Ignored in future decisions', 'Added to variable costs', 'Subtracted from revenue', 'b', 'Sunk costs are irrelevant to future decisions — they cannot be recovered.', 5),
    (d4, 'Residual income is BEST described as:', 'Total net income', 'Profit above the minimum required return on investment', 'Revenue minus variable costs', 'Cash flow minus expenses', 'b', 'Residual Income = NOI - (Required ROR × Investment). It incentivizes growth.', 6),
    (d4, 'Job order costing is appropriate when:', 'Products are mass-produced identically', 'Products are unique or customized', 'Only one product is made', 'Costs are all variable', 'b', 'Job order costing tracks costs per individual unique job or batch.', 7),
    (d4, 'The margin of safety represents:', 'The break-even sales level', 'How much sales can fall before losses occur', 'Fixed costs divided by variable costs', 'The contribution margin ratio', 'b', 'Margin of Safety = Actual Sales - Break-Even Sales.', 8),
    (d4, 'Product costs include:', 'Selling expenses', 'Administrative salaries', 'Direct materials, direct labor, and manufacturing overhead', 'Marketing and distribution costs', 'c', 'Product costs = DM + DL + Manufacturing OH. They are inventoriable costs.', 9),
    (d4, 'Variable costing differs from absorption costing by:', 'Including fixed OH as a product cost', 'Treating fixed OH as a period cost', 'Excluding variable costs', 'Adding admin costs to inventory', 'b', 'Variable costing treats fixed manufacturing OH as a period expense, not product cost.', 10),
    (d4, 'ROI (Return on Investment) is calculated as:', 'Revenue ÷ Assets', 'Net Operating Income ÷ Average Operating Assets', 'Profit ÷ Sales', 'Net Income ÷ Equity', 'b', 'ROI = NOI ÷ Average Operating Assets. Measures asset utilization efficiency.', 11);

  -- ================================================================
  -- DECK 5: Corporate Finance Fundamentals (PREMIUM)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d5, 'Corporate Finance Fundamentals', 'corporate-finance-fundamentals',
    'NPV, IRR, WACC, capital structure, dividend policy, valuation methods, risk and return, and financial modeling concepts. Built for intermediate finance students.',
    'finance', 'intermediate', 55, true, true, 1499, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d5, 'What is NPV (Net Present Value)?', 'NPV = PV of future cash flows - Initial Investment. A positive NPV means the investment creates value. The primary capital budgeting criterion.', 0),
    (d5, 'What is IRR (Internal Rate of Return)?', 'The discount rate that makes NPV = 0. Accept a project if IRR > WACC (hurdle rate). Represents the project''s intrinsic rate of return.', 1),
    (d5, 'What is WACC?', 'Weighted Average Cost of Capital. WACC = (E/V)×Re + (D/V)×Rd×(1-T). The minimum return a company must earn on its investments to satisfy all providers of capital.', 2),
    (d5, 'What is the time value of money?', 'A dollar today is worth more than a dollar in the future due to its earning potential. Foundation of all financial valuation.', 3),
    (d5, 'What is the DCF (Discounted Cash Flow) method?', 'A valuation method that discounts projected future cash flows back to present value using an appropriate discount rate.', 4),
    (d5, 'What is capital structure?', 'The mix of debt and equity a firm uses to finance its assets. Affects WACC, risk profile, and firm value.', 5),
    (d5, 'What is the Modigliani-Miller theorem?', 'Under perfect markets (no taxes, no bankruptcy costs), capital structure is irrelevant to firm value. In reality, taxes and distress costs matter.', 6),
    (d5, 'What is beta (β)?', 'A measure of a stock''s volatility relative to the market. β = 1 means same risk as market; β > 1 means more volatile; β < 1 means less volatile.', 7),
    (d5, 'What is the CAPM formula?', 'Expected Return = Risk-Free Rate + β × (Market Return - Risk-Free Rate). Calculates expected return based on systematic risk.', 8),
    (d5, 'What is systematic vs. unsystematic risk?', 'Systematic (market) risk cannot be diversified away. Unsystematic (company-specific) risk can be eliminated through diversification.', 9),
    (d5, 'What is the payback period?', 'Time for cumulative cash inflows to recover initial investment. Simple but ignores time value of money and post-payback cash flows.', 10),
    (d5, 'What is free cash flow (FCF)?', 'FCF = EBIT(1-T) + D&A - ΔWorking Capital - CapEx. Cash available to all capital providers after operating expenses and investments.', 11),
    (d5, 'What is EV/EBITDA?', 'Enterprise Value / EBITDA — a common valuation multiple used to compare companies across capital structures. Typically ranges 5-15x depending on industry.', 12),
    (d5, 'What is dividend policy?', 'How a firm decides to distribute profits — retained earnings vs. dividends vs. buybacks. Affects investor clientele and stock price signaling.', 13),
    (d5, 'What is leverage?', 'Using debt to amplify returns on equity. Financial leverage = Debt/Equity. Increases ROE but also increases financial risk.', 14),
    (d5, 'What is the Gordon Growth Model?', 'Stock Price = D1 / (Ke - g). Prices a stock based on next year''s dividend (D1), cost of equity (Ke), and constant growth rate (g).', 15),
    (d5, 'What is the efficient market hypothesis?', 'Prices reflect all available information. Weak form: past prices; Semi-strong: all public info; Strong form: all info including insider info.', 16),
    (d5, 'What is an LBO (Leveraged Buyout)?', 'Acquisition of a company using significant debt financing (often 60-90%), with assets of the acquired company as collateral. Common in private equity.', 17),
    (d5, 'What is EVA (Economic Value Added)?', 'EVA = NOPAT - (WACC × Capital Invested). Measures whether a firm is earning above its cost of capital. Positive EVA = value creation.', 18),
    (d5, 'What is scenario analysis in finance?', 'Evaluating a project''s NPV under different scenarios (base, best, worst case). Helps assess risk and sensitivity to key assumptions.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d5, 'A project should be accepted if its NPV is:', 'Exactly zero', 'Negative', 'Positive', 'Equal to the IRR', 'c', 'Positive NPV means the project creates value. Accept if NPV > 0.', 0),
    (d5, 'WACC represents:', 'The risk-free rate of return', 'The average return earned historically', 'The minimum return required to satisfy all capital providers', 'The IRR of the firm''s projects', 'c', 'WACC is the blended cost of all capital (debt + equity), weighted by their proportions.', 1),
    (d5, 'Beta measures:', 'A stock''s absolute volatility', 'A stock''s risk relative to the market', 'The firm''s debt level', 'Dividend yield', 'b', 'Beta measures systematic risk relative to the market (β = 1 matches market movement).', 2),
    (d5, 'The CAPM calculates:', 'Optimal capital structure', 'Expected return based on systematic risk', 'The break-even investment amount', 'Net present value', 'b', 'CAPM: E(R) = Rf + β × (Rm - Rf). Prices systematic risk.', 3),
    (d5, 'Unsystematic risk can be eliminated by:', 'Using more debt', 'Diversification', 'Increasing dividend payments', 'Reducing beta to zero', 'b', 'Unsystematic (firm-specific) risk is diversifiable. Systematic risk is not.', 4),
    (d5, 'Free cash flow is important because:', 'It matches GAAP net income', 'It represents cash available to all capital providers', 'It ignores depreciation', 'It equals EPS', 'b', 'FCF = EBIT(1-T) + D&A - ΔNWC - CapEx. Available to debt and equity holders.', 5),
    (d5, 'According to Modigliani-Miller (with no taxes):', 'More debt always increases firm value', 'Capital structure is irrelevant to firm value', 'Equity financing is always cheaper', 'Dividends determine firm value', 'b', 'MM theorem: under perfect markets, firm value is unaffected by capital structure.', 6),
    (d5, 'The Gordon Growth Model values a stock based on:', 'P/E ratio and EPS', 'Book value and market price', 'Dividends, cost of equity, and growth rate', 'EBITDA multiples', 'c', 'Gordon Growth: P = D1 / (Ke - g). A dividend discount model.', 7),
    (d5, 'Which metric adjusts for capital structure when comparing firms?', 'P/E ratio', 'EV/EBITDA', 'Dividend yield', 'EPS growth', 'b', 'EV/EBITDA includes debt in enterprise value, making it capital-structure neutral.', 8),
    (d5, 'EVA is positive when:', 'Net income is positive', 'NOPAT exceeds the cost of capital × investment', 'Revenue exceeds expenses', 'Dividends are paid', 'b', 'EVA = NOPAT - (WACC × Capital). Positive EVA means returns exceed cost of capital.', 9),
    (d5, 'The payback period''s main weakness is:', 'It''s too complex to calculate', 'It ignores time value of money and post-payback cash flows', 'It uses WACC as the discount rate', 'It always underestimates project risk', 'b', 'Payback ignores TVM and all cash flows after payback — making it incomplete.', 10);

  -- ================================================================
  -- DECK 6: Macroeconomics Exam Review (PREMIUM)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d6, 'Macroeconomics Exam Review', 'macroeconomics-exam-review',
    'GDP, inflation, unemployment, monetary policy, fiscal policy, aggregate demand and supply, international trade, and exchange rates. Built for macro exam prep.',
    'economics', 'intermediate', 45, true, true, 1299, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d6, 'What is GDP?', 'Gross Domestic Product — the total monetary value of all goods and services produced within a country in a given period. GDP = C + I + G + (X - M).', 0),
    (d6, 'What is the GDP expenditure formula?', 'GDP = Consumption (C) + Investment (I) + Government Spending (G) + Net Exports (X - M).', 1),
    (d6, 'What is the difference between nominal and real GDP?', 'Nominal GDP uses current prices. Real GDP adjusts for inflation using a base year price level. Real GDP better reflects actual output changes.', 2),
    (d6, 'What is the CPI?', 'Consumer Price Index — measures the average change in prices paid by consumers for a basket of goods over time. Used to calculate inflation.', 3),
    (d6, 'What is the natural rate of unemployment?', 'The unemployment rate when the economy is at full employment — includes only structural and frictional unemployment, not cyclical. ~4-5% in the US.', 4),
    (d6, 'What is the Phillips Curve?', 'The inverse short-run relationship between inflation and unemployment — when unemployment falls, inflation tends to rise, and vice versa.', 5),
    (d6, 'What is monetary policy?', 'Actions by the central bank (Fed) to influence the money supply and interest rates. Expansionary = lower rates, increase supply; Contractionary = raise rates.', 6),
    (d6, 'What is fiscal policy?', 'Government use of taxation and spending to influence the economy. Expansionary fiscal policy = increase spending / cut taxes. Contractionary = reverse.', 7),
    (d6, 'What is the multiplier effect?', 'An initial change in spending leads to a larger change in aggregate output. Multiplier = 1 / (1 - MPC) where MPC is marginal propensity to consume.', 8),
    (d6, 'What is the aggregate demand curve?', 'Shows the total quantity of goods and services demanded at different price levels. Downward sloping: lower prices → higher real wealth, lower interest rates, more exports.', 9),
    (d6, 'What is stagflation?', 'A combination of stagnant economic growth, high unemployment, AND high inflation — difficult to address because policies to fight inflation worsen unemployment and vice versa.', 10),
    (d6, 'What is the money multiplier?', 'The maximum amount the money supply can expand from a given amount of reserves. Money Multiplier = 1 / Reserve Requirement.', 11),
    (d6, 'What is quantitative easing (QE)?', 'A Fed policy where it purchases long-term assets (government bonds, MBS) to inject liquidity when interest rates are already near zero.', 12),
    (d6, 'What is Ricardian equivalence?', 'The theory that consumers fully anticipate future tax increases when the government borrows, and save equivalently — making deficit spending ineffective.', 13),
    (d6, 'What is comparative advantage?', 'A country has a comparative advantage when it can produce a good at a lower opportunity cost than another country. Basis for international trade.', 14),
    (d6, 'What is the balance of payments?', 'A record of all economic transactions between a country and the rest of the world: Current account + Capital account + Financial account = 0.', 15),
    (d6, 'What is crowding out?', 'Government borrowing raises interest rates, which reduces private investment. A potential downside of expansionary fiscal policy.', 16),
    (d6, 'What is liquidity trap?', 'A situation where interest rates are near zero and monetary policy is ineffective because people hoard cash instead of investing.', 17),
    (d6, 'What are the tools of monetary policy?', '1) Open market operations (buy/sell bonds), 2) Reserve requirement, 3) Discount rate, 4) Interest on reserves (IOER).', 18),
    (d6, 'What is the output gap?', 'Actual GDP minus Potential GDP. Positive gap = inflationary overheating. Negative gap = recessionary underperformance.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d6, 'GDP is measured by the formula:', 'GDP = C + S + T', 'GDP = C + I + G + (X - M)', 'GDP = Revenue - Costs', 'GDP = Assets - Liabilities', 'b', 'GDP = Consumption + Investment + Government Spending + Net Exports (X-M).', 0),
    (d6, 'Real GDP differs from nominal GDP by:', 'Including net exports', 'Adjusting for price level changes (inflation)', 'Using market prices from this year', 'Excluding government spending', 'b', 'Real GDP adjusts nominal GDP for inflation, showing true output changes.', 1),
    (d6, 'The Phillips Curve shows:', 'A positive relationship between inflation and unemployment', 'An inverse short-run relationship between inflation and unemployment', 'The relationship between GDP and money supply', 'Long-run neutrality of money', 'b', 'Short-run Phillips Curve: lower unemployment correlates with higher inflation.', 2),
    (d6, 'Expansionary fiscal policy includes:', 'Raising taxes and cutting spending', 'Lowering interest rates', 'Increasing government spending or cutting taxes', 'Selling government bonds', 'c', 'Expansionary fiscal policy stimulates the economy through spending or tax cuts.', 3),
    (d6, 'The money multiplier equals:', 'Money Supply × Reserve Requirement', '1 / Reserve Requirement', 'Reserve Requirement × GDP', 'Interest Rate × Money Supply', 'b', 'Money Multiplier = 1 / Reserve Requirement. A 10% requirement = 10× multiplier.', 4),
    (d6, 'Stagflation is difficult to address because:', 'Both problems share the same cause', 'Policies to fight inflation tend to worsen unemployment', 'It only occurs in developing countries', 'It solves itself through the market', 'b', 'Contractionary policy reduces inflation but increases unemployment — a dilemma.', 5),
    (d6, 'Crowding out refers to:', 'Government spending replacing imports', 'Government borrowing raising rates, reducing private investment', 'Tax increases reducing consumption', 'Foreign investment declining', 'b', 'Crowding out: government borrowing increases interest rates → less private investment.', 6),
    (d6, 'Quantitative easing is used when:', 'Interest rates are too high', 'The economy is overheating', 'Interest rates are near zero and conventional policy is limited', 'Unemployment is too low', 'c', 'QE injects liquidity by buying assets when interest rate tools are exhausted.', 7),
    (d6, 'Comparative advantage is based on:', 'Absolute production efficiency', 'Lower opportunity cost of production', 'Larger labor force', 'Better technology', 'b', 'Comparative advantage: produce goods where you have a lower opportunity cost.', 8),
    (d6, 'The output gap is defined as:', 'Trade deficit minus surplus', 'Actual GDP minus Potential GDP', 'Inflation minus unemployment rate', 'Government spending minus revenue', 'b', 'Output Gap = Actual GDP - Potential GDP. Measures cyclical economic position.', 9);

  -- ================================================================
  -- DECK 7: Business Statistics Basics (PREMIUM)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d7, 'Business Statistics Basics', 'business-statistics-basics',
    'Hypothesis testing, probability distributions, regression analysis, confidence intervals, and sampling methods. Essential for business analytics and research methods courses.',
    'statistics', 'intermediate', 45, true, true, 1299, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d7, 'What is the mean?', 'The arithmetic average. Sum of all values divided by the number of values. Sensitive to outliers.', 0),
    (d7, 'What is the median?', 'The middle value when data is ordered. Less sensitive to outliers than the mean. Better for skewed distributions.', 1),
    (d7, 'What is standard deviation?', 'Measures the spread/dispersion of data around the mean. σ = √(Σ(xi - μ)² / N). Larger σ = more spread out data.', 2),
    (d7, 'What is the Central Limit Theorem?', 'As sample size increases, the sampling distribution of the mean approaches a normal distribution, regardless of the population distribution (n ≥ 30 rule of thumb).', 3),
    (d7, 'What is a p-value?', 'The probability of observing results at least as extreme as the data, assuming the null hypothesis is true. p < 0.05 typically rejects H0.', 4),
    (d7, 'What is Type I error?', 'Rejecting a true null hypothesis (false positive). Probability = α (significance level). Example: concluding a drug works when it doesn''t.', 5),
    (d7, 'What is Type II error?', 'Failing to reject a false null hypothesis (false negative). Probability = β. Example: concluding a drug doesn''t work when it does.', 6),
    (d7, 'What is a confidence interval?', 'A range of values that, with a specified probability (e.g., 95%), contains the true population parameter. CI = x̄ ± z*(σ/√n).', 7),
    (d7, 'What is linear regression?', 'A statistical method modeling the linear relationship between a dependent variable (Y) and one or more independent variables (X). Y = β0 + β1X + ε.', 8),
    (d7, 'What is R-squared (R²)?', 'The proportion of variance in the dependent variable explained by the model. R² = 0 (no fit) to 1 (perfect fit). Higher is generally better.', 9),
    (d7, 'What is the null hypothesis?', 'The hypothesis of no effect or no difference (H0). Statistical testing attempts to reject or fail to reject H0 in favor of the alternative (H1).', 10),
    (d7, 'What is the normal distribution?', 'A symmetric, bell-shaped distribution described by mean (μ) and standard deviation (σ). 68-95-99.7 rule: data within 1, 2, 3 standard deviations.', 11),
    (d7, 'What is a z-score?', 'z = (x - μ) / σ. Measures how many standard deviations a value is from the mean. Used to find probabilities in normal distributions.', 12),
    (d7, 'What is correlation?', 'Measures the strength and direction of the linear relationship between two variables. Ranges from -1 to +1. Correlation ≠ causation.', 13),
    (d7, 'What is the Binomial distribution?', 'Models the number of successes in n independent trials with probability p. Mean = np; Variance = np(1-p).', 14),
    (d7, 'What is ANOVA?', 'Analysis of Variance — tests whether means of three or more groups are significantly different. Uses F-statistic.', 15),
    (d7, 'What is multicollinearity?', 'When independent variables in a regression model are highly correlated with each other. Makes it difficult to isolate individual effects. Inflates standard errors.', 16),
    (d7, 'What is heteroscedasticity?', 'When the variance of residuals in a regression is not constant across all levels of the independent variable. Violates OLS assumptions.', 17),
    (d7, 'What is the chi-square test?', 'A non-parametric test used to compare observed frequencies to expected frequencies. Used for categorical data (goodness of fit, independence).', 18),
    (d7, 'What is sampling bias?', 'When a sample systematically over or underrepresents certain parts of the population, leading to inaccurate conclusions.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d7, 'A p-value of 0.03 at α = 0.05 means:', 'Fail to reject the null hypothesis', 'Reject the null hypothesis', 'The result is practically significant', 'The effect size is large', 'b', 'p = 0.03 < α = 0.05, so we reject H0 at the 5% significance level.', 0),
    (d7, 'Type I error occurs when you:', 'Fail to reject a false null hypothesis', 'Reject a true null hypothesis', 'Correctly reject the null hypothesis', 'Fail to find any effect', 'b', 'Type I error = false positive = rejecting H0 when it is actually true.', 1),
    (d7, 'The Central Limit Theorem states that:', 'All populations are normally distributed', 'Sample means become normally distributed as n increases', 'Standard deviation equals the mean', 'Variance decreases with more data', 'b', 'CLT: sampling distribution of the mean approaches normal as n increases (n ≥ 30).', 2),
    (d7, 'R-squared in regression measures:', 'The slope of the regression line', 'The proportion of variance explained by the model', 'The p-value of the regression', 'Statistical significance of predictors', 'b', 'R² indicates goodness of fit — what proportion of Y''s variance the model explains.', 3),
    (d7, 'A z-score of 2.0 means the observation is:', '2 standard deviations below the mean', '2 standard deviations above the mean', 'At the median', 'In the top 50%', 'b', 'z = (x - μ)/σ = 2.0 means the value is 2 SDs above the mean.', 4),
    (d7, 'Correlation of -0.85 indicates:', 'Weak positive relationship', 'No relationship', 'Strong negative relationship', 'Perfect positive correlation', 'c', 'Correlation near -1 = strong negative linear relationship between variables.', 5),
    (d7, 'Multicollinearity in regression means:', 'The dependent variable is binary', 'Independent variables are highly correlated with each other', 'Residuals are not normally distributed', 'The model has too few variables', 'b', 'Multicollinearity: independent variables correlate with each other, complicating interpretation.', 6),
    (d7, 'ANOVA is used to test:', 'Difference between two proportions', 'Whether means of 3+ groups are significantly different', 'Correlation between two variables', 'Regression coefficients', 'b', 'ANOVA tests equality of means across three or more groups using the F-statistic.', 7),
    (d7, 'A 95% confidence interval means:', 'There is a 95% chance the parameter equals the point estimate', '95% of intervals constructed this way contain the true parameter', 'The sample is 95% representative', 'p < 0.05 for all estimates in the interval', 'b', 'If repeated many times, 95% of such intervals would contain the true population parameter.', 8),
    (d7, 'The normal distribution is described by:', 'Mean and variance', 'Min and max values', 'Skewness and kurtosis', 'Mode and range', 'a', 'The normal distribution is fully defined by its mean (μ) and variance (σ²) — or SD (σ).', 9);

  -- ================================================================
  -- DECK 8: Principles of Marketing (PREMIUM)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d8, 'Principles of Marketing', 'principles-of-marketing',
    'The 4 Ps of marketing, market segmentation, consumer behavior, branding, digital marketing basics, and marketing strategy. Built for intro marketing courses.',
    'marketing', 'beginner', 35, true, true, 999, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d8, 'What are the 4 Ps of marketing?', 'Product, Price, Place (distribution), Promotion. The core marketing mix variables that a business can control.', 0),
    (d8, 'What is market segmentation?', 'Dividing a market into distinct groups of buyers with different needs, characteristics, or behaviors who might require separate products or marketing mixes.', 1),
    (d8, 'What is the difference between B2B and B2C marketing?', 'B2B (Business-to-Business): selling to organizations; rational, longer sales cycles. B2C (Business-to-Consumer): selling to individuals; emotional, shorter cycles.', 2),
    (d8, 'What is a value proposition?', 'A clear statement of why a customer should buy from you — the specific benefit you deliver that competitors don''t. "What problem do we solve and why us?"', 3),
    (d8, 'What is brand equity?', 'The added value a brand name gives to a product. Strong brand equity allows premium pricing and greater customer loyalty (e.g., Apple, Nike).', 4),
    (d8, 'What is the product life cycle?', 'The stages a product goes through: 1) Introduction, 2) Growth, 3) Maturity, 4) Decline. Marketing strategy should shift with each stage.', 5),
    (d8, 'What is penetration pricing?', 'Setting a low initial price to quickly gain market share. Risk: may erode brand value; benefit: rapid customer acquisition.', 6),
    (d8, 'What is price skimming?', 'Setting a high initial price to capture maximum value from early adopters, then lowering price over time (e.g., new electronics).', 7),
    (d8, 'What is the difference between push and pull strategy?', 'Push: promote to distribution channels to push product to consumers. Pull: promote to consumers to create demand that pulls product through channels.', 8),
    (d8, 'What is IMC (Integrated Marketing Communications)?', 'Coordinating all promotional channels (advertising, PR, digital, social, direct) to deliver a consistent message and maximize impact.', 9),
    (d8, 'What is customer lifetime value (CLV)?', 'The total revenue a business can expect from a customer over the entire relationship. CLV = (Avg Purchase × Purchase Frequency × Customer Lifespan) - CAC.', 10),
    (d8, 'What is the customer acquisition cost (CAC)?', 'Total marketing and sales costs to acquire one new customer. Lower CAC relative to CLV indicates a healthy business model.', 11),
    (d8, 'What is positioning?', 'How a brand or product is perceived in the minds of consumers relative to competitors. "We are the [X] for [target customer] who needs [benefit]."', 12),
    (d8, 'What is a SWOT analysis?', 'A framework assessing internal Strengths and Weaknesses, and external Opportunities and Threats. Used for strategic marketing planning.', 13),
    (d8, 'What is content marketing?', 'Creating and distributing valuable, relevant content to attract and retain a defined audience, ultimately driving profitable customer actions.', 14),
    (d8, 'What is the net promoter score (NPS)?', 'A customer loyalty metric based on: "How likely are you to recommend us? (0-10)." NPS = % Promoters (9-10) - % Detractors (0-6).', 15),
    (d8, 'What is a buyer persona?', 'A semi-fictional representation of your ideal customer based on research — demographics, behavior, goals, and pain points. Guides marketing decisions.', 16),
    (d8, 'What is conversion rate?', 'The percentage of visitors or leads who take a desired action (purchase, sign-up). Conversion Rate = (Conversions / Total Visitors) × 100.', 17),
    (d8, 'What is omnichannel marketing?', 'A seamless customer experience across all channels (online, in-store, mobile, social) with consistent messaging and integrated data.', 18),
    (d8, 'What is demand generation vs. lead generation?', 'Demand gen: creates awareness and interest in your category. Lead gen: captures information from interested prospects. Both are stages in the marketing funnel.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d8, 'The 4 Ps of marketing are:', 'Product, Profit, People, Promotion', 'Product, Price, Place, Promotion', 'Product, Price, PR, Process', 'People, Process, Physical evidence, Promotion', 'b', 'The 4 Ps: Product, Price, Place (distribution), Promotion.', 0),
    (d8, 'Price skimming involves:', 'Setting a low price to gain market share', 'Charging different prices to different segments', 'Setting a high initial price for early adopters, then reducing it', 'Matching competitor prices', 'c', 'Skimming captures maximum value early, then reduces price as demand falls.', 1),
    (d8, 'A brand''s value proposition explains:', 'How much the product costs', 'Why a customer should choose you over competitors', 'The distribution strategy', 'The product''s manufacturing process', 'b', 'Value proposition: the unique benefit that makes your offer compelling to customers.', 2),
    (d8, 'The product life cycle''s DECLINE stage calls for:', 'Heavy investment and growth', 'Market expansion', 'Cost reduction or product discontinuation', 'Penetration pricing', 'c', 'In decline, firms typically reduce marketing spend and prepare to exit or reformulate.', 3),
    (d8, 'CLV (Customer Lifetime Value) is important because:', 'It measures brand equity', 'It determines how much you can spend to acquire a customer profitably', 'It measures short-term sales', 'It is equal to revenue per visit', 'b', 'CLV sets the ceiling for CAC — you shouldn''t spend more to acquire a customer than their lifetime value.', 4),
    (d8, 'A SWOT analysis examines:', 'Sales, Waste, Operations, Tactics', 'Strengths, Weaknesses, Opportunities, Threats', 'Strategy, Workers, Objectives, Targets', 'Supply, Workforce, Output, Technology', 'b', 'SWOT: Strengths, Weaknesses (internal); Opportunities, Threats (external).', 5),
    (d8, 'Market segmentation divides the market by:', 'Alphabetical product order', 'Distinct groups with different needs or behaviors', 'Sales volume alone', 'Number of competitors', 'b', 'Segmentation identifies groups with similar characteristics to target more effectively.', 6),
    (d8, 'NPS measures:', 'Net profit score', 'Customer loyalty based on recommendation likelihood', 'Net paid subscribers', 'Number of social media followers', 'b', 'NPS = % Promoters (9-10) - % Detractors (0-6). A loyalty and advocacy metric.', 7),
    (d8, 'Integrated Marketing Communications (IMC) means:', 'Using only digital channels', 'Coordinating all channels to deliver a consistent message', 'Integrating finance and marketing teams', 'Combining B2B and B2C strategies', 'b', 'IMC coordinates advertising, PR, digital, and other channels for unified messaging.', 8),
    (d8, 'Brand equity is defined as:', 'The cost of brand registration', 'The total marketing spend', 'The added value a brand name gives to a product', 'Revenue from brand licensing', 'c', 'Brand equity = premium value created by having a strong, trusted brand (e.g., Apple commands price premiums).', 9);

  -- ================================================================
  -- DECK 9: Excel for Finance (PREMIUM)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d9, 'Excel for Finance', 'excel-for-finance',
    'Essential Excel functions and shortcuts for finance: VLOOKUP, SUMIF, NPV, IRR, INDEX/MATCH, pivot tables, and financial modeling best practices.',
    'excel', 'intermediate', 40, true, true, 1299, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d9, 'What does VLOOKUP do?', 'Looks up a value in the leftmost column of a range and returns a value in the same row from a specified column. =VLOOKUP(lookup_value, table_array, col_index, [exact_match]).', 0),
    (d9, 'What is the advantage of INDEX/MATCH over VLOOKUP?', 'INDEX/MATCH can look up to the left, handles column insertions gracefully, is faster on large datasets, and is more flexible.', 1),
    (d9, 'What does SUMIF do?', 'Sums values in a range that meet a single condition. =SUMIF(range, criteria, [sum_range]).', 2),
    (d9, 'What does SUMIFS do?', 'Sums values that meet multiple criteria. =SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...).', 3),
    (d9, 'What is the NPV function in Excel?', '=NPV(rate, value1, [value2], ...) — calculates the net present value of cash flows. Note: add the initial investment separately since NPV() assumes first cash flow at end of period 1.', 4),
    (d9, 'What is the IRR function in Excel?', '=IRR(values, [guess]) — returns the internal rate of return for cash flows. Values must include at least one positive and one negative value.', 5),
    (d9, 'What does IFERROR do?', 'Returns a custom value if a formula produces an error, otherwise returns the formula result. =IFERROR(value, value_if_error). Replaces error messages.', 6),
    (d9, 'What is a Pivot Table?', 'An interactive tool to summarize, analyze, and reorganize large datasets. Allows grouping, filtering, and aggregating data without formulas.', 7),
    (d9, 'What is the keyboard shortcut to apply/remove a filter?', 'Ctrl + Shift + L — toggles AutoFilter on and off for the selected range or table.', 8),
    (d9, 'What does Ctrl + [ do in Excel?', 'Navigates to the precedent cells of a formula — shows which cells feed into the selected formula. Useful for auditing financial models.', 9),
    (d9, 'What is the PMT function?', '=PMT(rate, nper, pv) — calculates the periodic payment for a loan. E.g., monthly mortgage payment given rate, number of periods, and loan amount.', 10),
    (d9, 'What is XLOOKUP?', 'Modern replacement for VLOOKUP. =XLOOKUP(lookup_value, lookup_array, return_array). Can look left, handles errors, returns multiple columns.', 11),
    (d9, 'What are absolute references in Excel?', 'Using $ to lock a row, column, or both (e.g., $A$1). The reference doesn''t change when the formula is copied to other cells.', 12),
    (d9, 'What does Ctrl + Shift + Enter do?', 'Enters an array formula (legacy). Array formulas perform calculations on multiple values simultaneously. Replaced by dynamic arrays in Excel 365.', 13),
    (d9, 'What is the OFFSET function?', '=OFFSET(reference, rows, cols, [height], [width]) — returns a reference offset from a starting cell. Used in dynamic named ranges and dashboards.', 14),
    (d9, 'What are data validation rules in Excel?', 'Rules that restrict what can be entered in a cell — dropdowns, number ranges, date constraints. Reduces input errors in financial models.', 15),
    (d9, 'What is CONCATENATE or the & operator?', 'Joins text strings together. =CONCATENATE(text1, text2) or =text1 & text2. Used to combine first and last names, codes, etc.', 16),
    (d9, 'What is conditional formatting?', 'Automatically formats cells based on their values (e.g., heat maps, data bars, highlighting above/below thresholds). Makes data analysis visual.', 17),
    (d9, 'What is the F4 key in Excel?', 'Toggles absolute/relative reference cycling on a cell reference while editing a formula: A1 → $A$1 → A$1 → $A1 → A1.', 18),
    (d9, 'What is a named range?', 'Assigning a custom name to a cell or range (e.g., "TaxRate"). Makes formulas more readable: =Revenue * TaxRate instead of =A1 * B5.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d9, 'VLOOKUP requires the lookup value to be in:', 'Any column of the table', 'The leftmost column of the table', 'The top row', 'The rightmost column', 'b', 'VLOOKUP searches the leftmost column. INDEX/MATCH has no such restriction.', 0),
    (d9, 'The Excel NPV function:', 'Includes the initial investment automatically', 'Assumes cash flows start at end of period 1', 'Returns IRR when applied', 'Calculates both nominal and real NPV', 'b', 'Excel NPV() discounts from period 1. Add the initial investment at period 0 separately.', 1),
    (d9, 'SUMIFS differs from SUMIF by:', 'Using only one condition', 'Supporting multiple criteria ranges', 'Being faster on small datasets', 'Ignoring blank cells', 'b', 'SUMIFS accepts multiple criteria_range/criteria pairs; SUMIF uses only one.', 2),
    (d9, 'The PMT function calculates:', 'Future value of investments', 'Periodic payments for a loan', 'Internal rate of return', 'Present value of cash flows', 'b', 'PMT(rate, nper, pv) returns the payment amount per period for a fixed-rate loan.', 3),
    (d9, 'To lock a cell reference in Excel, you use:', 'The * symbol', 'The $ symbol', 'The % symbol', 'The @ symbol', 'b', '$ locks references: $A$1 = absolute; A$1 = row locked; $A1 = column locked.', 4),
    (d9, 'INDEX/MATCH is preferred over VLOOKUP because:', 'It is always faster', 'It can look left and handles column insertions better', 'It requires fewer arguments', 'It is built into all versions of Excel', 'b', 'INDEX/MATCH: can look in any direction, doesn''t break on column insertions.', 5),
    (d9, 'Conditional formatting is used to:', 'Protect cells from editing', 'Automatically format cells based on their values', 'Create drop-down lists', 'Apply currency symbols', 'b', 'Conditional formatting changes cell appearance based on rules or value thresholds.', 6),
    (d9, 'The F4 key while editing a formula:', 'Saves the file', 'Cycles through absolute/relative reference modes', 'Closes the workbook', 'Applies a filter', 'b', 'F4 toggles A1 → $A$1 → A$1 → $A1 cycling through reference modes.', 7),
    (d9, 'IFERROR is used to:', 'Calculate error margins', 'Replace error messages with custom values', 'Find and fix formula errors', 'Count cells with errors', 'b', 'IFERROR(value, fallback) returns fallback when the value produces an error.', 8),
    (d9, 'A pivot table is primarily used for:', 'Writing complex formulas', 'Summarizing and analyzing large datasets interactively', 'Protecting sensitive financial data', 'Creating charts automatically', 'b', 'Pivot tables let you group, filter, and aggregate data without writing formulas.', 9);

  -- ================================================================
  -- DECK 10: Banking and Risk Basics (PREMIUM)
  -- ================================================================
  insert into public.decks (id, title, slug, description, category, difficulty, estimated_minutes, is_premium, is_published, price_cents, created_by)
  values (d10, 'Banking and Risk Basics', 'banking-and-risk-basics',
    'Commercial banking, central banking, financial risk types, Basel regulations, credit risk, market risk, and operational risk. Built for banking and risk management courses.',
    'banking', 'intermediate', 40, true, true, 1299, admin_id);

  insert into public.flashcards (deck_id, front, back, order_index) values
    (d10, 'What is fractional reserve banking?', 'Banks hold only a fraction of deposits as reserves and lend out the rest. The reserve ratio determines the money multiplier effect.', 0),
    (d10, 'What is the Federal Reserve?', 'The central bank of the United States. Responsible for monetary policy, bank supervision, and financial system stability. Led by the Federal Reserve Board.', 1),
    (d10, 'What are the three types of financial risk?', '1) Credit Risk (default), 2) Market Risk (price/rate changes), 3) Operational Risk (internal processes/systems failures). Plus liquidity, reputational, regulatory risks.', 2),
    (d10, 'What is credit risk?', 'The risk that a borrower will fail to repay a loan or meet contractual obligations. Managed through credit analysis, diversification, and collateral.', 3),
    (d10, 'What is market risk?', 'The risk of losses due to changes in market prices — interest rates, equity prices, FX rates, commodity prices. Measured by VaR.', 4),
    (d10, 'What is VaR (Value at Risk)?', 'A statistical measure of the potential maximum loss over a given time period at a specified confidence level. E.g., "1-day VaR of $1M at 99% confidence."', 5),
    (d10, 'What is liquidity risk?', 'The risk that an entity cannot meet its short-term financial obligations due to inability to convert assets to cash quickly without significant loss.', 6),
    (d10, 'What is the Basel Accords?', 'International banking regulations (Basel I, II, III) requiring banks to hold minimum capital against risk-weighted assets. Aims to ensure global banking stability.', 7),
    (d10, 'What is Tier 1 capital?', 'The core capital of a bank under Basel: primarily common equity and retained earnings. The strongest buffer against losses. Minimum Tier 1 ratio = 6% under Basel III.', 8),
    (d10, 'What is a credit default swap (CDS)?', 'A financial derivative where the protection buyer pays periodic premiums; in return, the protection seller pays if the reference entity defaults. A form of credit insurance.', 9),
    (d10, 'What is duration in fixed income?', 'A measure of a bond''s price sensitivity to interest rate changes. Higher duration = greater price sensitivity. Duration is measured in years.', 10),
    (d10, 'What is stress testing?', 'Simulating extreme but plausible adverse scenarios to assess the impact on a bank''s capital, liquidity, and profitability. Required by regulators post-2008.', 11),
    (d10, 'What is adverse selection?', 'A form of information asymmetry where one party has better information. In banking: risky borrowers are more eager to borrow → lenders attract riskier applicants.', 12),
    (d10, 'What is the CAMELS rating system?', 'US bank supervisory framework: Capital adequacy, Asset quality, Management, Earnings, Liquidity, Sensitivity to market risk. Used to rate bank health (1–5 scale).', 13),
    (d10, 'What is a systemic risk?', 'Risk that the failure of one institution or market could cascade and cause widespread damage to the entire financial system. Seen in the 2008 financial crisis.', 14),
    (d10, 'What is net interest margin (NIM)?', 'NIM = (Interest Income - Interest Expense) / Average Earning Assets. Key profitability metric for banks — the spread between lending and borrowing rates.', 15),
    (d10, 'What is operational risk?', 'The risk of loss from inadequate or failed internal processes, systems, people, or external events (e.g., fraud, cyberattacks, compliance failures).', 16),
    (d10, 'What is a repo agreement?', 'A repurchase agreement — one party sells securities to another with a commitment to buy them back at a higher price. Effectively a short-term collateralized loan.', 17),
    (d10, 'What is the yield curve?', 'A graph showing interest rates across different maturities for similar bonds. Normal: upward slope. Inverted: downward slope (often signals recession).', 18),
    (d10, 'What is too big to fail?', 'The concept that some financial institutions are so large and interconnected that their failure would be catastrophic — implying government bailout. Highlighted in the 2008 crisis.', 19);

  insert into public.quiz_questions (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, order_index) values
    (d10, 'In fractional reserve banking, banks:', 'Hold 100% of deposits as reserves', 'Hold only a fraction of deposits and lend the rest', 'Cannot make loans', 'Require government approval for each loan', 'b', 'Banks hold a fraction as reserves (e.g., 10%) and lend out the rest, creating money.', 0),
    (d10, 'VaR measures:', 'Average expected loss', 'Maximum potential loss at a given confidence level', 'Minimum expected return', 'Daily trading profit', 'b', 'VaR = potential loss not exceeded with X% probability over a given period.', 1),
    (d10, 'Credit risk is best described as:', 'Risk from interest rate changes', 'Risk from equity price volatility', 'Risk that a borrower will default', 'Risk from internal system failures', 'c', 'Credit risk = the probability that a counterparty will fail to meet obligations.', 2),
    (d10, 'Basel III''s primary purpose is to:', 'Eliminate all banking risk', 'Ensure banks hold minimum capital buffers', 'Set maximum loan amounts', 'Regulate stock prices', 'b', 'Basel III sets minimum capital ratios and liquidity requirements for global banks.', 3),
    (d10, 'Duration measures:', 'A bond''s yield', 'Price sensitivity to interest rate changes', 'Credit quality of a bond', 'Time to maturity only', 'b', 'Duration measures how much a bond''s price changes for a 1% change in interest rates.', 4),
    (d10, 'An inverted yield curve typically signals:', 'Economic expansion', 'A potential recession', 'High inflation', 'Rising interest rates', 'b', 'Inverted yield curves (short rates > long rates) have historically preceded recessions.', 5),
    (d10, 'Net Interest Margin (NIM) measures:', 'Total interest expenses', 'The spread between lending and borrowing rates relative to earning assets', 'Dividend yield for bank stocks', 'Tax rate on interest income', 'b', 'NIM = (Interest Income - Interest Expense) / Avg Earning Assets. Core bank profitability.', 6),
    (d10, 'Operational risk includes:', 'Credit default risk', 'Market price fluctuations', 'Fraud, cyberattacks, and process failures', 'Interest rate changes', 'c', 'Operational risk = loss from internal failures, human error, systems, or external events.', 7),
    (d10, 'Adverse selection in banking means:', 'Banks prefer risky borrowers', 'Risky borrowers are more eager to borrow, attracting them disproportionately', 'All borrowers have equal risk', 'Banks reject all applicants', 'b', 'Adverse selection: information asymmetry leads to riskier borrowers dominating the pool.', 8),
    (d10, 'CAMELS is used to:', 'Price bank stocks', 'Rate banks on their financial health and risk', 'Calculate bank profitability', 'Determine interest rates', 'b', 'CAMELS: Capital, Assets, Management, Earnings, Liquidity, Sensitivity — supervisory rating system.', 9);

  raise notice 'Seed data inserted successfully!';
end $$;
